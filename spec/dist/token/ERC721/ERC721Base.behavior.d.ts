import { ERC721Base } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC721BaseBehaviorArgs {
  supply: BigNumber;
  mint: (address: string, tokenId: BigNumber) => Promise<ContractTransaction>;
  burn: (tokenId: BigNumber) => Promise<ContractTransaction>;
}
export declare function describeBehaviorOfERC721Base(
  deploy: () => Promise<ERC721Base>,
  { mint, burn }: ERC721BaseBehaviorArgs,
  skips?: string[],
): void;
