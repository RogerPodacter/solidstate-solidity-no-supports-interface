import { IDiamondReadable } from '@solidstate/typechain-types';

export interface DiamondReadableBehaviorArgs {
  facetCuts: any[];
}
export declare function describeBehaviorOfDiamondReadable(
  deploy: () => Promise<IDiamondReadable>,
  { facetCuts }: DiamondReadableBehaviorArgs,
  skips?: string[],
): void;
