import { BaseContract } from 'ethers';

export interface FactoryBehaviorArgs {}
export declare function describeBehaviorOfFactory(
  deploy: () => Promise<BaseContract>,
  {}: FactoryBehaviorArgs,
  skips?: string[],
): void;
