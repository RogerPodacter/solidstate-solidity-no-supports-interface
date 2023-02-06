import { ERC165Base } from '@solidstate/typechain-types';

export interface ERC165BaseBehaviorArgs {
  interfaceIds: string[];
}
export declare function describeBehaviorOfERC165Base(
  deploy: () => Promise<ERC165Base>,
  { interfaceIds }: ERC165BaseBehaviorArgs,
  skips?: string[],
): void;
