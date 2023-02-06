import { BaseContract } from 'ethers';

export interface ReentrancyGuardBehaviorArgs {}
export declare function describeBehaviorOfReentrancyGuard(
  deploy: () => Promise<BaseContract>,
  {}: ReentrancyGuardBehaviorArgs,
  skips?: string[],
): void;
