import { OwnableBehaviorArgs } from '../../../access/ownable/Ownable.behavior';
import { DiamondBaseBehaviorArgs } from '@solidstate/spec';
import { IDiamondFallback } from '@solidstate/typechain-types';

export interface DiamondFallbackBehaviorArgs
  extends DiamondBaseBehaviorArgs,
    OwnableBehaviorArgs {
  fallbackAddress: string;
}
export declare function describeBehaviorOfDiamondFallback(
  deploy: () => Promise<IDiamondFallback>,
  args: DiamondFallbackBehaviorArgs,
  skips?: string[],
): void;
