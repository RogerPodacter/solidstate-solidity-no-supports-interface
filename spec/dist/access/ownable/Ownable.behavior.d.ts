import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IOwnable } from '@solidstate/typechain-types';

export interface OwnableBehaviorArgs {
  getOwner: () => Promise<SignerWithAddress>;
  getNonOwner: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfOwnable(
  deploy: () => Promise<IOwnable>,
  { getOwner, getNonOwner }: OwnableBehaviorArgs,
  skips?: string[],
): void;
