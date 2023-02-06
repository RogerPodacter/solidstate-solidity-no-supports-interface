import { FactoryBehaviorArgs } from './Factory.behavior';
import { MetamorphicFactory } from '@solidstate/typechain-types';

export interface MetaphoricFactoryBehaviorArgs extends FactoryBehaviorArgs {}
export declare function describeBehaviorOfMetamorphicFactory(
  deploy: () => Promise<MetamorphicFactory>,
  {}: MetaphoricFactoryBehaviorArgs,
  skips?: string[],
): void;
