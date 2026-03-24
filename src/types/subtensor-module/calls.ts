import {sts, Block, Bytes, Option, Result, CallType, RuntimeCtx} from '../support'
import * as v101 from '../v101'
import * as v233 from '../v233'

export const addStake =  {
    name: 'SubtensorModule.add_stake',
    v101: new CallType(
        'SubtensorModule.add_stake',
        sts.struct({
            hotkey: v101.AccountId32,
            amountStaked: sts.bigint(),
        })
    ),
    /**
     * --- Adds stake to a hotkey. The call is made from the
     * coldkey account linked in the hotkey.
     * Only the associated coldkey is allowed to make staking and
     * unstaking requests. This protects the neuron against
     * attacks on its hotkey running in production code.
     * 
     * # Args:
     *  * 'origin': (<T as frame_system::Config>Origin):
     * 	- The signature of the caller's coldkey.
     * 
     *  * 'hotkey' (T::AccountId):
     * 	- The associated hotkey account.
     * 
     *  * 'amount_staked' (u64):
     * 	- The amount of stake to be added to the hotkey staking account.
     * 
     * # Event:
     *  * StakeAdded;
     * 	- On the successfully adding stake to a global account.
     * 
     * # Raises:
     *  * 'NotEnoughBalanceToStake':
     * 	- Not enough balance on the coldkey to add onto the global account.
     * 
     *  * 'NonAssociatedColdKey':
     * 	- The calling coldkey is not associated with this hotkey.
     * 
     *  * 'BalanceWithdrawalError':
     *  	- Errors stemming from transaction pallet.
     * 
     */
    v233: new CallType(
        'SubtensorModule.add_stake',
        sts.struct({
            hotkey: v233.AccountId32,
            netuid: sts.number(),
            amountStaked: sts.bigint(),
        })
    ),
}

export const removeStake =  {
    name: 'SubtensorModule.remove_stake',
    v101: new CallType(
        'SubtensorModule.remove_stake',
        sts.struct({
            hotkey: v101.AccountId32,
            amountUnstaked: sts.bigint(),
        })
    ),
    /**
     * Remove stake from the staking account. The call must be made
     * from the coldkey account attached to the neuron metadata. Only this key
     * has permission to make staking and unstaking requests.
     * 
     * # Args:
     * * 'origin': (<T as frame_system::Config>Origin):
     * 	- The signature of the caller's coldkey.
     * 
     * * 'hotkey' (T::AccountId):
     * 	- The associated hotkey account.
     * 
     * * 'amount_unstaked' (u64):
     * 	- The amount of stake to be added to the hotkey staking account.
     * 
     * # Event:
     * * StakeRemoved;
     * 	- On the successfully removing stake from the hotkey account.
     * 
     * # Raises:
     * * 'NotRegistered':
     * 	- Thrown if the account we are attempting to unstake from is non existent.
     * 
     * * 'NonAssociatedColdKey':
     * 	- Thrown if the coldkey does not own the hotkey we are unstaking from.
     * 
     * * 'NotEnoughStakeToWithdraw':
     * 	- Thrown if there is not enough stake on the hotkey to withdwraw this amount.
     * 
     */
    v233: new CallType(
        'SubtensorModule.remove_stake',
        sts.struct({
            hotkey: v233.AccountId32,
            netuid: sts.number(),
            amountUnstaked: sts.bigint(),
        })
    ),
}
