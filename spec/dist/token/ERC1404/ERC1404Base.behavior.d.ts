import { ERC20BaseBehaviorArgs } from '../ERC20';
import { IERC1404Base } from '@solidstate/typechain-types';

export interface ERC1404BaseBehaviorArgs extends ERC20BaseBehaviorArgs {
  restrictions: any;
}
export declare function describeBehaviorOfERC1404Base(
  deploy: () => Promise<IERC1404Base>,
  { restrictions, mint, burn, supply }: ERC1404BaseBehaviorArgs,
  skips?: string[],
): void;
