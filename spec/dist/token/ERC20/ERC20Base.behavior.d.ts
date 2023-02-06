import { IERC20Base } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC20BaseBehaviorArgs {
  supply: BigNumber;
  mint: (address: string, amount: BigNumber) => Promise<ContractTransaction>;
  burn: (address: string, amount: BigNumber) => Promise<ContractTransaction>;
}
export declare function describeBehaviorOfERC20Base(
  deploy: () => Promise<IERC20Base>,
  { supply, mint, burn }: ERC20BaseBehaviorArgs,
  skips?: string[],
): void;
