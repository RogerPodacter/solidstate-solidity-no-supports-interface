import { ERC20BaseBehaviorArgs } from './ERC20Base.behavior';
import { ERC20ExtendedBehaviorArgs } from './ERC20Extended.behavior';
import { ERC20MetadataBehaviorArgs } from './ERC20Metadata.behavior';
import { ERC20PermitBehaviorArgs } from './ERC20Permit.behavior';
import { ISolidStateERC20 } from '@solidstate/typechain-types';

export interface SolidStateERC20BehaviorArgs
  extends ERC20BaseBehaviorArgs,
    ERC20ExtendedBehaviorArgs,
    ERC20MetadataBehaviorArgs,
    ERC20PermitBehaviorArgs {}
export declare function describeBehaviorOfSolidStateERC20(
  deploy: () => Promise<ISolidStateERC20>,
  args: SolidStateERC20BehaviorArgs,
  skips?: string[],
): void;
