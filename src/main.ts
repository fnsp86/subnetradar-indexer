import { TypeormDatabase } from "@subsquid/typeorm-store";
import { In } from "typeorm";
import * as ss58 from "@subsquid/ss58";
import { processor } from "./processor";
import { Account, Transfer, StakeEvent, UnstakeEvent } from "./model";
import { events } from "./types";

const SS58_PREFIX = 42;
const codec = ss58.codec(SS58_PREFIX);

function encodeAddr(raw: Uint8Array | string): string {
  if (typeof raw === "string") {
    // Already hex-encoded, decode first
    return codec.encode(Buffer.from(raw.replace(/^0x/, ""), "hex"));
  }
  return codec.encode(raw);
}

interface TransferData {
  id: string;
  blockNumber: number;
  timestamp: Date;
  extrinsicHash?: string;
  from: string;
  to: string;
  amount: bigint;
  fee: bigint;
}

interface StakeData {
  id: string;
  blockNumber: number;
  timestamp: Date;
  extrinsicHash?: string;
  coldkey: string;
  hotkey: string;
  netuid: number;
  amountStaked: bigint;
}

interface UnstakeData {
  id: string;
  blockNumber: number;
  timestamp: Date;
  extrinsicHash?: string;
  coldkey: string;
  hotkey: string;
  netuid: number;
  amountUnstaked: bigint;
}

processor.run(new TypeormDatabase({ supportHotBlocks: true }), async (ctx) => {
  const transfers: TransferData[] = [];
  const stakes: StakeData[] = [];
  const unstakes: UnstakeData[] = [];
  const accountIds = new Set<string>();

  for (const block of ctx.blocks) {
    const timestamp = block.header.timestamp
      ? new Date(block.header.timestamp)
      : new Date(0);

    for (const event of block.events) {
      // --- Balances.Transfer ---
      if (event.name === "Balances.Transfer") {
        const decoded = events.balances.transfer.v101.decode(event);
        const fromAddr = encodeAddr(decoded.from);
        const toAddr = encodeAddr(decoded.to);
        accountIds.add(fromAddr);
        accountIds.add(toAddr);
        transfers.push({
          id: event.id,
          blockNumber: block.header.height,
          timestamp,
          extrinsicHash: event.extrinsic?.hash,
          from: fromAddr,
          to: toAddr,
          amount: decoded.amount,
          fee: event.extrinsic?.fee ? BigInt(event.extrinsic.fee) : 0n,
        });
      }

      // --- SubtensorModule.StakeAdded ---
      // v101: [coldkey, amount]
      // v233: [coldkey, hotkey, amount, increased, netuid]
      // v257: [coldkey, hotkey, amount, increased, netuid, alpha]
      if (event.name === "SubtensorModule.StakeAdded") {
        let coldkeyAddr = "unknown";
        let hotkeyAddr = "unknown";
        let netuid = 0;
        let amount = 0n;

        if (events.subtensorModule.stakeAdded.v257.is(event)) {
          const [coldkey, hotkey, amountStaked, , n] =
            events.subtensorModule.stakeAdded.v257.decode(event);
          coldkeyAddr = encodeAddr(coldkey);
          hotkeyAddr = encodeAddr(hotkey);
          netuid = n;
          amount = amountStaked;
        } else if (events.subtensorModule.stakeAdded.v233.is(event)) {
          const [coldkey, hotkey, amountStaked, , n] =
            events.subtensorModule.stakeAdded.v233.decode(event);
          coldkeyAddr = encodeAddr(coldkey);
          hotkeyAddr = encodeAddr(hotkey);
          netuid = n;
          amount = amountStaked;
        } else if (events.subtensorModule.stakeAdded.v101.is(event)) {
          const [coldkey, amountStaked] =
            events.subtensorModule.stakeAdded.v101.decode(event);
          coldkeyAddr = encodeAddr(coldkey);
          amount = amountStaked;
          // v101 has no hotkey or netuid in event, try call args
          const callArgs = event.call?.args as any;
          if (callArgs?.hotkey) hotkeyAddr = encodeAddr(callArgs.hotkey);
        }

        accountIds.add(coldkeyAddr);
        stakes.push({
          id: event.id,
          blockNumber: block.header.height,
          timestamp,
          extrinsicHash: event.extrinsic?.hash,
          coldkey: coldkeyAddr,
          hotkey: hotkeyAddr,
          netuid,
          amountStaked: amount,
        });
      }

      // --- SubtensorModule.StakeRemoved ---
      // v101: [coldkey, amount]
      // v233: [coldkey, hotkey, amount, decreased, netuid]
      // v257: [coldkey, hotkey, amount, decreased, netuid, alpha]
      if (event.name === "SubtensorModule.StakeRemoved") {
        let coldkeyAddr = "unknown";
        let hotkeyAddr = "unknown";
        let netuid = 0;
        let amount = 0n;

        if (events.subtensorModule.stakeRemoved.v257.is(event)) {
          const [coldkey, hotkey, amountRemoved, , n] =
            events.subtensorModule.stakeRemoved.v257.decode(event);
          coldkeyAddr = encodeAddr(coldkey);
          hotkeyAddr = encodeAddr(hotkey);
          netuid = n;
          amount = amountRemoved;
        } else if (events.subtensorModule.stakeRemoved.v233.is(event)) {
          const [coldkey, hotkey, amountRemoved, , n] =
            events.subtensorModule.stakeRemoved.v233.decode(event);
          coldkeyAddr = encodeAddr(coldkey);
          hotkeyAddr = encodeAddr(hotkey);
          netuid = n;
          amount = amountRemoved;
        } else if (events.subtensorModule.stakeRemoved.v101.is(event)) {
          const [coldkey, amountRemoved] =
            events.subtensorModule.stakeRemoved.v101.decode(event);
          coldkeyAddr = encodeAddr(coldkey);
          amount = amountRemoved;
          const callArgs = event.call?.args as any;
          if (callArgs?.hotkey) hotkeyAddr = encodeAddr(callArgs.hotkey);
        }

        accountIds.add(coldkeyAddr);
        unstakes.push({
          id: event.id,
          blockNumber: block.header.height,
          timestamp,
          extrinsicHash: event.extrinsic?.hash,
          coldkey: coldkeyAddr,
          hotkey: hotkeyAddr,
          netuid,
          amountUnstaked: amount,
        });
      }
    }
  }

  // Upsert accounts
  const existingAccounts = await ctx.store
    .findBy(Account, { id: In([...accountIds]) })
    .then((accs) => new Map(accs.map((a) => [a.id, a])));

  for (const id of accountIds) {
    if (!existingAccounts.has(id)) {
      existingAccounts.set(id, new Account({ id }));
    }
  }
  await ctx.store.upsert([...existingAccounts.values()]);

  if (transfers.length > 0) {
    await ctx.store.insert(
      transfers.map(
        (t) =>
          new Transfer({
            ...t,
            from: existingAccounts.get(t.from),
            to: existingAccounts.get(t.to),
          })
      )
    );
  }

  if (stakes.length > 0) {
    await ctx.store.insert(
      stakes.map(
        (s) =>
          new StakeEvent({
            ...s,
            coldkey: existingAccounts.get(s.coldkey),
          })
      )
    );
  }

  if (unstakes.length > 0) {
    await ctx.store.insert(
      unstakes.map(
        (u) =>
          new UnstakeEvent({
            ...u,
            coldkey: existingAccounts.get(u.coldkey),
          })
      )
    );
  }
});
