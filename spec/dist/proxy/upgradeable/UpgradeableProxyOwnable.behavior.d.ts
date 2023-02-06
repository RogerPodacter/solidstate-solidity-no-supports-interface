import { UpgradeableProxyBehaviorArgs } from './UpgradeableProxy.behavior';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IUpgradeableProxyOwnable } from '@solidstate/typechain-types';

interface UpgradeableProxyOwnableArgs extends UpgradeableProxyBehaviorArgs {
  getOwner: () => Promise<SignerWithAddress>;
  getNonOwner: () => Promise<SignerWithAddress>;
}
export declare function describeBehaviorOfUpgradeableProxyOwnable(
  deploy: () => Promise<IUpgradeableProxyOwnable>,
  {
    getOwner,
    getNonOwner,
    implementationFunction,
    implementationFunctionArgs,
  }: UpgradeableProxyOwnableArgs,
  skips?: string[],
): void;
export {};
