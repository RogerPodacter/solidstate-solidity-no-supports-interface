import { ERC20Permit } from '@solidstate/typechain-types';
import { BigNumber } from 'ethers';

export interface ERC20PermitBehaviorArgs {
  allowance: (holder: string, spender: string) => Promise<BigNumber>;
}
export declare function describeBehaviorOfERC20Permit(
  deploy: () => Promise<ERC20Permit>,
  args: ERC20PermitBehaviorArgs,
  skips?: string[],
): void;
