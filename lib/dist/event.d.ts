import { LogDescription } from '@ethersproject/abi';
import { ContractReceipt } from 'ethers';
import { Interface } from 'ethers/lib/utils';

export declare function getLogs(
  contractInterface: Interface,
  receipt: ContractReceipt,
  only?: string[],
): LogDescription[];
