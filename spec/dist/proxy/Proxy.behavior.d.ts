import { IProxy } from '@solidstate/typechain-types';

export interface ProxyBehaviorArgs {
  implementationFunction: string;
  implementationFunctionArgs: any[];
}
export declare function describeBehaviorOfProxy(
  deploy: () => Promise<IProxy>,
  { implementationFunction, implementationFunctionArgs }: ProxyBehaviorArgs,
  skips?: string[],
): void;
