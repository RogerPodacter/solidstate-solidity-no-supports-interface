import { IERC1155Base } from '@solidstate/typechain-types';
import { BigNumber, ContractTransaction } from 'ethers';

export interface ERC1155BaseBehaviorArgs {
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
export declare function describeBehaviorOfERC1155Base(
  deploy: () => Promise<IERC1155Base>,
  { mint, burn, tokenId }: ERC1155BaseBehaviorArgs,
  skips?: string[],
): void;
