import { ERC721BaseBehaviorArgs } from './ERC721Base.behavior';
import { ERC721EnumerableBehaviorArgs } from './ERC721Enumerable.behavior';
import { ERC721MetadataBehaviorArgs } from './ERC721Metadata.behavior';
import { SolidStateERC721 } from '@solidstate/typechain-types';

export interface SolidStateERC721BehaviorArgs
  extends ERC721BaseBehaviorArgs,
    ERC721EnumerableBehaviorArgs,
    ERC721MetadataBehaviorArgs {}
export declare function describeBehaviorOfSolidStateERC721(
  deploy: () => Promise<SolidStateERC721>,
  { supply, mint, burn, name, symbol, tokenURI }: SolidStateERC721BehaviorArgs,
  skips?: string[],
): void;
