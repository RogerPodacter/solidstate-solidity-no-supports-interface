import { SolidStateERC20BehaviorArgs } from '../ERC20';
import { ERC1404BaseBehaviorArgs } from './ERC1404Base.behavior';
import { ISolidStateERC1404 } from '@solidstate/typechain-types';

export interface SolidStateERC1404BehaviorArgs
  extends SolidStateERC20BehaviorArgs,
    ERC1404BaseBehaviorArgs {}
export declare function describeBehaviorOfSolidStateERC1404(
  deploy: () => Promise<ISolidStateERC1404>,
  {
    mint,
    burn,
    allowance,
    restrictions,
    name,
    symbol,
    decimals,
    supply,
  }: SolidStateERC1404BehaviorArgs,
  skips?: string[],
): void;
