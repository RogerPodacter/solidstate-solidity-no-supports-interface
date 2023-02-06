import { IERC20Extended } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC20ExtendedBehaviorArgs {
  mint: (address: string, amount: BigNumber) => Promise<ContractTransaction>;
  burn: (address: string, amount: BigNumber) => Promise<ContractTransaction>;
  allowance: (holder: string, spender: string) => Promise<BigNumber>;
  supply: BigNumber;
}
export declare function describeBehaviorOfERC20Extended(
  deploy: () => Promise<IERC20Extended>,
  { mint, burn, allowance, supply }: ERC20ExtendedBehaviorArgs,
  skips?: string[],
): void;
