import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IERC1155Enumerable } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC1155EnumerableBehaviorArgs {
  transfer: (
    from: SignerWithAddress,
    to: SignerWithAddress,
    id: BigNumber,
    amount: BigNumber,
  ) => Promise<ContractTransaction>;
  mint: (
    address: string,
    id: BigNumber,
    amount: BigNumber,
  ) => Promise<ContractTransaction>;
  burn: (
    address: string,
    id: BigNumber,
    amount: BigNumber,
  ) => Promise<ContractTransaction>;
  tokenId?: BigNumber;
}
export declare function describeBehaviorOfERC1155Enumerable(
  deploy: () => Promise<IERC1155Enumerable>,
  { transfer, mint, burn, tokenId }: ERC1155EnumerableBehaviorArgs,
  skips?: string[],
): void;
