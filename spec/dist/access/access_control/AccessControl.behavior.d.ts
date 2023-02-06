import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { AccessControl } from '@solidstate/typechain-types';

interface AccessControlBehaviorArgs {
  deploy: () => Promise<AccessControl>;
  getAdmin: () => Promise<SignerWithAddress>;
  getNonAdmin: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfAccessControl(
  { deploy, getAdmin, getNonAdmin }: AccessControlBehaviorArgs,
  skips?: string[],
): void;
export {};
