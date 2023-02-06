import { ProxyBehaviorArgs } from '../Proxy.behavior';
import { IManagedProxy } from '@solidstate/typechain-types';

export interface ManagedProxyBehaviorArgs extends ProxyBehaviorArgs {}
export declare function describeBehaviorOfManagedProxy(
  deploy: () => Promise<IManagedProxy>,
  {
    implementationFunction,
    implementationFunctionArgs,
  }: ManagedProxyBehaviorArgs,
  skips?: string[],
): void;
