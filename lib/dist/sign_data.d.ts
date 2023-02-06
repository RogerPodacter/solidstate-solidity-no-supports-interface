import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

export interface SignDataArgs {
  types: string[];
  values: any[];
  nonce: any;
  address: any;
}
export declare function hashData({
  types,
  values,
  nonce,
  address,
}: SignDataArgs): Uint8Array;
export declare function signData(
  signer: SignerWithAddress,
  data: SignDataArgs,
): Promise<Uint8Array>;
