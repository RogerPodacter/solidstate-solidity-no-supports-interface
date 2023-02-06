import { FactoryBehaviorArgs } from './Factory.behavior';
import { BaseContract } from 'ethers';

export interface MinimalProxyFactoryBehaviorArgs extends FactoryBehaviorArgs {}
export declare function describeBehaviorOfMinimalProxyFactory(
  deploy: () => Promise<BaseContract>,
  {}: MinimalProxyFactoryBehaviorArgs,
  skips?: string[],
): void;
