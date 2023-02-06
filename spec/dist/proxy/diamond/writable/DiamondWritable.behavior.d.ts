import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IDiamondWritable } from '@solidstate/typechain-types';

export interface DiamondWritableBehaviorArgs {
  getOwner: () => Promise<SignerWithAddress>;
  getNonOwner: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfDiamondWritable(
  deploy: () => Promise<IDiamondWritable>,
  { getOwner, getNonOwner }: DiamondWritableBehaviorArgs,
  skips?: string[],
): void;
