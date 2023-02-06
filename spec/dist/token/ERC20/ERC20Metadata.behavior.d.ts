import { IERC20Metadata } from '@solidstate/typechain-types';
import { BigNumberish } from 'ethers';

export interface ERC20MetadataBehaviorArgs {
  name: string;
  symbol: string;
  decimals: BigNumberish;
}
export declare function describeBehaviorOfERC20Metadata(
  deploy: () => Promise<IERC20Metadata>,
  { name, symbol, decimals }: ERC20MetadataBehaviorArgs,
  skips?: string[],
): void;
