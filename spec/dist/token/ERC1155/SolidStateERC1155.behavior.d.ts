import { ERC1155BaseBehaviorArgs } from './ERC1155Base.behavior';
import { ERC1155EnumerableBehaviorArgs } from './ERC1155Enumerable.behavior';
import { ERC1155MetadataBehaviorArgs } from './ERC1155Metadata.behavior';
import { ISolidStateERC1155 } from '@solidstate/typechain-types';

export interface SolidStateERC1155BehaviorArgs
  extends ERC1155BaseBehaviorArgs,
    ERC1155EnumerableBehaviorArgs,
    ERC1155MetadataBehaviorArgs {}
export declare function describeBehaviorOfSolidStateERC1155(
  deploy: () => Promise<ISolidStateERC1155>,
  { transfer, mint, burn, tokenId, tokenURI }: SolidStateERC1155BehaviorArgs,
  skips?: string[],
): void;
