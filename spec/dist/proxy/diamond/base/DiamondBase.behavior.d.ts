import { IDiamondBase } from '@solidstate/typechain-types';

export interface DiamondBaseBehaviorArgs {
  facetFunction: string;
  facetFunctionArgs: string[];
}
export declare function describeBehaviorOfDiamondBase(
  deploy: () => Promise<IDiamondBase>,
  { facetFunction, facetFunctionArgs }: DiamondBaseBehaviorArgs,
  skips?: string[],
): void;
