import { SolidStateERC20BehaviorArgs } from '../ERC20';
import { ERC4626BaseBehaviorArgs } from './ERC4626Base.behavior';
import { ISolidStateERC4626 } from '@solidstate/typechain-types';

export interface SolidStateERC4626BehaviorArgs
  extends SolidStateERC20BehaviorArgs,
    ERC4626BaseBehaviorArgs {}
export declare function describeBehaviorOfSolidStateERC4626(
  deploy: () => Promise<ISolidStateERC4626>,
  args: SolidStateERC4626BehaviorArgs,
  skips?: string[],
): void;
