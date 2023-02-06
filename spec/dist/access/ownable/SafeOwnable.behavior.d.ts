import { OwnableBehaviorArgs } from './Ownable.behavior';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ISafeOwnable } from '@solidstate/typechain-types';

export interface SafeOwnableBehaviorArgs extends OwnableBehaviorArgs {
  getNomineeOwner: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfSafeOwnable(
  deploy: () => Promise<ISafeOwnable>,
  { getOwner, getNomineeOwner, getNonOwner }: SafeOwnableBehaviorArgs,
  skips?: string[],
): void;
