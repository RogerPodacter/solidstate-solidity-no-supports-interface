import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IERC1271Ownable } from '@solidstate/typechain-types';

export interface ERC1271OwnableBehaviorArgs {
  getOwner: () => Promise<SignerWithAddress>;
  getNonOwner: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfERC1271Ownable(
  deploy: () => Promise<IERC1271Ownable>,
  { getOwner, getNonOwner }: ERC1271OwnableBehaviorArgs,
  skips?: string[],
): void;
