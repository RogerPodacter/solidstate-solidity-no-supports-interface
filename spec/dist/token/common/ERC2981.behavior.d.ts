import { ERC2981Mock } from '@solidstate/typechain-types';

export declare function describeBehaviorOfERC2981(
  deploy: () => Promise<ERC2981Mock>,
  skips?: string[],
): void;
