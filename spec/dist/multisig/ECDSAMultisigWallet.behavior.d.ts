import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { IECDSAMultisigWallet } from '@solidstate/typechain-types';
import { BigNumber } from 'ethers';

export interface ECDSAMultisigWalletBehaviorArgs {
  getSigners: () => Promise<SignerWithAddress[]>;
  getNonSigner: () => Promise<SignerWithAddress>;
  quorum: BigNumber;
  getVerificationAddress: () => Promise<string>;
}
export declare function describeBehaviorOfECDSAMultisigWallet(
  deploy: () => Promise<IECDSAMultisigWallet>,
  {
    getSigners,
    getNonSigner,
    quorum,
    getVerificationAddress,
  }: ECDSAMultisigWalletBehaviorArgs,
  skips?: string[],
): void;
