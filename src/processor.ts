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
    url: process.env.RPC_BITTENSOR_HTTP || "https://entrypoint-finney.opentensor.ai",
    rateLimit: 10,
    capacity: 5,
  })
  // Start from recent blocks (RPC has pruned older state)
  // The archive handles historical data, RPC is needed for runtime metadata
  .setBlockRange({ from: 7_700_000 })
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
