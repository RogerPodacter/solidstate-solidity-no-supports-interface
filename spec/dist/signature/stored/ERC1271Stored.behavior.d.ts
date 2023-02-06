import { IERC1271Stored } from '@solidstate/typechain-types';

export interface ERC1271StoredBehaviorArgs {
  getValidParams: () => Promise<[Uint8Array, Uint8Array]>;
}
export declare function describeBehaviorOfERC1271Stored(
  deploy: () => Promise<IERC1271Stored>,
  { getValidParams }: ERC1271StoredBehaviorArgs,
  skips?: string[],
): void;
