import { ERC721Enumerable } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC721EnumerableBehaviorArgs {
  mint: (address: string, tokenId: BigNumber) => Promise<ContractTransaction>;
  burn: (tokenId: BigNumber) => Promise<ContractTransaction>;
  supply: BigNumber;
}
export declare function describeBehaviorOfERC721Enumerable(
  deploy: () => Promise<ERC721Enumerable>,
  { mint, burn, supply }: ERC721EnumerableBehaviorArgs,
  skips?: string[],
): void;
