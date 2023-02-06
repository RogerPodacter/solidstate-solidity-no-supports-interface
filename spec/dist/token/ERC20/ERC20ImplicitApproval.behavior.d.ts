import { ERC20BaseBehaviorArgs } from './ERC20Base.behavior';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20ImplicitApproval } from '@solidstate/typechain-types';

export interface ERC20ImplicitApprovalBehaviorArgs
  extends ERC20BaseBehaviorArgs {
  getHolder: () => Promise<SignerWithAddress>;
  getImplicitlyApprovedSpender: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfERC20ImplicitApproval(
  deploy: () => Promise<ERC20ImplicitApproval>,
  {
    supply,
    getHolder,
    getImplicitlyApprovedSpender,
    burn,
    mint,
  }: ERC20ImplicitApprovalBehaviorArgs,
  skips?: string[],
): void;
