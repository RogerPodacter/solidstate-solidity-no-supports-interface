import { IERC721Metadata } from '@solidstate/typechain-types';

export interface ERC721MetadataBehaviorArgs {
  name: string;
  symbol: string;
  tokenURI: string;
}
export declare function describeBehaviorOfERC721Metadata(
  deploy: () => Promise<IERC721Metadata>,
  { name, symbol, tokenURI }: ERC721MetadataBehaviorArgs,
  skips?: string[],
): void;
