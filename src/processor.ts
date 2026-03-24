import { assertNotNull } from "@subsquid/util-internal";
import {
  BlockHeader,
  DataHandlerContext,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";

export const processor = new SubstrateBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/bittensor")
  .setRpcEndpoint({
    url: assertNotNull(
      process.env.RPC_BITTENSOR_HTTP,
      "No RPC_BITTENSOR_HTTP supplied"
    ),
    rateLimit: 10,
  })
  // Start from dTAO launch (v233) - staking with netuid begins here
  .setBlockRange({ from: 4_920_000 })
  .addEvent({
    name: ["Balances.Transfer"],
    extrinsic: true,
  })
  .addEvent({
    name: ["SubtensorModule.StakeAdded", "SubtensorModule.StakeRemoved"],
    extrinsic: true,
    call: true,
  })
  .addCall({
    name: ["SubtensorModule.add_stake", "SubtensorModule.remove_stake"],
    extrinsic: true,
  })
  .setFields({
    event: { args: true },
    call: { args: true, origin: true },
    extrinsic: { hash: true, fee: true },
    block: { timestamp: true },
  });

export type Fields = SubstrateBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;
