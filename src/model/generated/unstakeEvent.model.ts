import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, IntColumn as IntColumn_, Index as Index_, DateTimeColumn as DateTimeColumn_, StringColumn as StringColumn_, ManyToOne as ManyToOne_, BigIntColumn as BigIntColumn_} from "@subsquid/typeorm-store"
import {Account} from "./account.model"

@Entity_()
export class UnstakeEvent {
    constructor(props?: Partial<UnstakeEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @IntColumn_({nullable: false})
    blockNumber!: number

    @Index_()
    @DateTimeColumn_({nullable: false})
    timestamp!: Date

    @Index_()
    @StringColumn_({nullable: true})
    extrinsicHash!: string | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    coldkey!: Account

    @Index_()
    @StringColumn_({nullable: false})
    hotkey!: string

    @Index_()
    @IntColumn_({nullable: false})
    netuid!: number

    @BigIntColumn_({nullable: false})
    amountUnstaked!: bigint
}
