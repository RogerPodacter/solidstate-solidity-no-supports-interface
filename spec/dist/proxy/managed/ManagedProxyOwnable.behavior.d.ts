import { ManagedProxyBehaviorArgs } from './ManagedProxy.behavior';
import { IManagedProxyOwnable } from '@solidstate/typechain-types';

export interface ManagedProxyOwnableBehaviorArgs
  extends ManagedProxyBehaviorArgs {}
export declare function describeBehaviorOfManagedProxyOwnable(
  deploy: () => Promise<IManagedProxyOwnable>,
  {
    implementationFunction,
    implementationFunctionArgs,
  }: ManagedProxyOwnableBehaviorArgs,
  skips?: string[],
): void;
