import { ProxyBehaviorArgs } from '../Proxy.behavior';
import { IUpgradeableProxy } from '@solidstate/typechain-types';

export interface UpgradeableProxyBehaviorArgs extends ProxyBehaviorArgs {}
export declare function describeBehaviorOfUpgradeableProxy(
  deploy: () => Promise<IUpgradeableProxy>,
  {
    implementationFunction,
    implementationFunctionArgs,
  }: UpgradeableProxyBehaviorArgs,
  skips?: string[],
): void;
