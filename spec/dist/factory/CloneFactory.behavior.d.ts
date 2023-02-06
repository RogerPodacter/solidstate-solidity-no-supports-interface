import { FactoryBehaviorArgs } from './Factory.behavior';
import { BaseContract } from 'ethers';

export interface CloneFactoryBehaviorArgs extends FactoryBehaviorArgs {}
export declare function describeBehaviorOfCloneFactory(
  deploy: () => Promise<BaseContract>,
  {}: CloneFactoryBehaviorArgs,
  skips?: string[],
): void;
