import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {Transfer} from "./transfer.model"
import {StakeEvent} from "./stakeEvent.model"
import {UnstakeEvent} from "./unstakeEvent.model"

@Entity_()
export class Account {
    constructor(props?: Partial<Account>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @OneToMany_(() => Transfer, e => e.from)
    transfersOut!: Transfer[]

    @OneToMany_(() => Transfer, e => e.to)
    transfersIn!: Transfer[]

    @OneToMany_(() => StakeEvent, e => e.coldkey)
    stakesAdded!: StakeEvent[]

    @OneToMany_(() => UnstakeEvent, e => e.coldkey)
    stakesRemoved!: UnstakeEvent[]
}
