import { Pausable } from '@solidstate/typechain-types';

export interface PausableBehaviorArgs {}
export declare function describeBehaviorOfPausable(
  deploy: () => Promise<Pausable>,
  args: PausableBehaviorArgs,
  skips?: string[],
): void;
