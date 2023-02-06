import { SafeOwnableBehaviorArgs } from '../../access';
import { DiamondBaseBehaviorArgs } from './base/DiamondBase.behavior';
import { DiamondFallbackBehaviorArgs } from './fallback/DiamondFallback.behavior';
import { DiamondReadableBehaviorArgs } from './readable/DiamondReadable.behavior';
import { DiamondWritableBehaviorArgs } from './writable/DiamondWritable.behavior';
import { ISolidStateDiamond } from '@solidstate/typechain-types';

export interface SolidStateDiamondBehaviorArgs
  extends DiamondBaseBehaviorArgs,
    DiamondFallbackBehaviorArgs,
    DiamondReadableBehaviorArgs,
    DiamondWritableBehaviorArgs,
    SafeOwnableBehaviorArgs {}
export declare function describeBehaviorOfSolidStateDiamond(
  deploy: () => Promise<ISolidStateDiamond>,
  args: SolidStateDiamondBehaviorArgs,
  skips?: string[],
): void;
