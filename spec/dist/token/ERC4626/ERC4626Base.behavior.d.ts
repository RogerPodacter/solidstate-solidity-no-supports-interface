import { ERC20BaseBehaviorArgs } from '../ERC20';
import { ERC20MetadataBehaviorArgs } from '../ERC20';
import { IERC20, IERC4626Base } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC4626BaseBehaviorArgs
  extends ERC20BaseBehaviorArgs,
    ERC20MetadataBehaviorArgs {
  getAsset: () => Promise<IERC20>;
  mintAsset: (
    address: string,
    amount: BigNumber,
  ) => Promise<ContractTransaction>;
}
export declare function describeBehaviorOfERC4626Base(
  deploy: () => Promise<IERC4626Base>,
  args: ERC4626BaseBehaviorArgs,
  skips?: string[],
): void;
