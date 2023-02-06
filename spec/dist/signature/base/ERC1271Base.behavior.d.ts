import { IERC1271Base } from '@solidstate/typechain-types';

export interface ERC1271BaseBehaviorArgs {
  getValidParams: () => Promise<[Uint8Array, Uint8Array]>;
  getInvalidParams: () => Promise<[Uint8Array, Uint8Array]>;
}
export declare function describeBehaviorOfERC1271Base(
  deploy: () => Promise<IERC1271Base>,
  { getValidParams, getInvalidParams }: ERC1271BaseBehaviorArgs,
  skips?: string[],
): void;
