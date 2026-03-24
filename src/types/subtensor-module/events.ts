import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v101 from '../v101'
import * as v233 from '../v233'
import * as v257 from '../v257'

export const stakeAdded =  {
    name: 'SubtensorModule.StakeAdded',
    v101: new EventType(
        'SubtensorModule.StakeAdded',
        sts.tuple([v101.AccountId32, sts.bigint()])
    ),
    /**
     * stake has been transferred from the a coldkey account onto the hotkey staking account.
     */
    v233: new EventType(
        'SubtensorModule.StakeAdded',
        sts.tuple([v233.AccountId32, v233.AccountId32, sts.bigint(), sts.bigint(), sts.number()])
    ),
    /**
     * stake has been transferred from the a coldkey account onto the hotkey staking account.
     */
    v257: new EventType(
        'SubtensorModule.StakeAdded',
        sts.tuple([v257.AccountId32, v257.AccountId32, sts.bigint(), sts.bigint(), sts.number(), sts.bigint()])
    ),
}

export const stakeRemoved =  {
    name: 'SubtensorModule.StakeRemoved',
    v101: new EventType(
        'SubtensorModule.StakeRemoved',
        sts.tuple([v101.AccountId32, sts.bigint()])
    ),
    /**
     * stake has been removed from the hotkey staking account onto the coldkey account.
     */
    v233: new EventType(
        'SubtensorModule.StakeRemoved',
        sts.tuple([v233.AccountId32, v233.AccountId32, sts.bigint(), sts.bigint(), sts.number()])
    ),
    /**
     * stake has been removed from the hotkey staking account onto the coldkey account.
     */
    v257: new EventType(
        'SubtensorModule.StakeRemoved',
        sts.tuple([v257.AccountId32, v257.AccountId32, sts.bigint(), sts.bigint(), sts.number(), sts.bigint()])
    ),
}
