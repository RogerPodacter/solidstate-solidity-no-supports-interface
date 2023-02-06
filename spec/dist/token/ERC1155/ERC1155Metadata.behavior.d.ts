import { IERC1155Metadata } from '@solidstate/typechain-types';

export interface ERC1155MetadataBehaviorArgs {
  tokenURI: string;
}
export declare function describeBehaviorOfERC1155Metadata(
  deploy: () => Promise<IERC1155Metadata>,
  { tokenURI }: ERC1155MetadataBehaviorArgs,
  skips?: string[],
): void;
