import { sha256, isValidAddress } from 'ethereumjs-util';
import { SecretKey, init } from '@chainsafe/bls';
import { ContainerType, ByteVectorType, UintNumberType } from '@chainsafe/ssz';
import { CHAIN_CONFIGS, CHAIN_NAMES } from './chainConfigs';
import { getSecretKeyFromKeystore } from './verifyKeystore';
import Keystore from '.';

const DOMAIN_BLS_TO_EXECUTION_CHANGE = '0A000000';

const getBLSToExecution = async (
    secretKey,
    executionAddress,
    validatorIndex,
    withdrawalCredentials,
    chainName = CHAIN_NAMES.mainnet
) => {
    if (!isValidAddress(executionAddress))
        return Promise.reject('Invalid execution address');
    const chainConfig = CHAIN_CONFIGS[chainName];
    if (!chainConfig) return Promise.reject('Invalid chain name');

    const ForkDataType = new ContainerType({
        current_version: new ByteVectorType(4),
        genesis_validators_root: new ByteVectorType(32)
    });

    const BLSToExecutionChange = new ContainerType({
        validator_index: new UintNumberType(8),
        from_bls_pubkey: new ByteVectorType(48),
        to_execution_address: new ByteVectorType(20)
    });

    const SigningData = new ContainerType({
        object_root: new ByteVectorType(32),
        domain: new ByteVectorType(32)
    });
    await init('herumi');
    const blsSK = SecretKey.fromBytes(secretKey);
    const publicKey = blsSK.toPublicKey();
    const derivedCredentials = `0x00${sha256(Buffer.from(publicKey.toBytes()))
        .subarray(1)
        .toString('hex')}`;
    if (derivedCredentials !== withdrawalCredentials)
        return Promise.reject('Withdrawal credentials do not match');

    const messageRoot = BLSToExecutionChange.hashTreeRoot({
        validator_index: validatorIndex,
        from_bls_pubkey: Buffer.from(publicKey.toBytes()),
        to_execution_address: Buffer.from(
            executionAddress.replace('0x', ''),
            'hex'
        )
    });

    const forkDataHash = ForkDataType.hashTreeRoot({
        current_version: Buffer.from(chainConfig.GENESIS_FORK_VERSION, 'hex'),
        genesis_validators_root: Buffer.from(
            chainConfig.GENESIS_VALIDATORS_ROOT,
            'hex'
        )
    });

    const executionChangeDomain = Buffer.concat([
        Buffer.from(DOMAIN_BLS_TO_EXECUTION_CHANGE, 'hex'),
        Buffer.from(forkDataHash).subarray(0, 28)
    ]);

    const signingRoot = SigningData.hashTreeRoot({
        object_root: messageRoot,
        domain: executionChangeDomain
    });

    const sig = blsSK.sign(signingRoot);
    return {
        message: {
            validator_index: validatorIndex.toString(),
            from_bls_pubkey: publicKey.toHex(),
            to_execution_address: executionAddress
        },
        signature: sig.toHex(),
        metadata: {
            network_name: chainName,
            genesis_validators_root: `0x${chainConfig.GENESIS_VALIDATORS_ROOT}`,
            deposit_cli_version: '2.5.0'
        }
    };
};

const pubKeyToWithdrawalCredential = pubkey => {
    const derivedCredentials = `0x00${sha256(
        Buffer.from(pubkey.replace('0x', ''), 'hex')
    )
        .subarray(1)
        .toString('hex')}`;
    return derivedCredentials;
};

const keystoreToBLSExecution = async (
    ksJSON,
    password,
    executionAddress,
    validatorIndex,
    withdrawalCredentials,
    chainName = CHAIN_NAMES.mainnet
) => {
    const secretKeyBuf = await getSecretKeyFromKeystore(ksJSON, password);
    return getBLSToExecution(
        secretKeyBuf,
        executionAddress,
        validatorIndex,
        withdrawalCredentials,
        chainName
    );
};

const mnemonicToBLSExecution = async (
    mnemonicOptions,
    executionAddress,
    validatorIndex,
    withdrawalCredentials,
    chainName = CHAIN_NAMES.mainnet,
    validatorIdx = 0
) => {
    if (!mnemonicOptions.mnemonic) return Promise.reject('mnemonic missing');
    const ks = new Keystore(mnemonicOptions);
    const secretKeyBuf = await ks.getWithdrawalSecretKey(validatorIdx);
    return getBLSToExecution(
        secretKeyBuf,
        executionAddress,
        validatorIndex,
        withdrawalCredentials,
        chainName
    );
};

export {
    pubKeyToWithdrawalCredential,
    getBLSToExecution,
    keystoreToBLSExecution,
    mnemonicToBLSExecution
};

// mnemonicToBLSExecution(
//     {
//         mnemonic:
//             'sister protect peanut hill ready work profit fit wish want small inflict flip member tail between sick setup bright duck morning sell paper worry'
//     },
//     '0x3434343434343434343434343434343434343434',
//     50000,
//     '0x00bd0b5a34de5fb17df08410b5e615dda87caf4fb72d0aac91ce5e52fc6aa8de',
//     CHAIN_NAMES.mainnet
// ).then(console.log);

// const ks = {
//     crypto: {
//         kdf: {
//             function: 'scrypt',
//             params: {
//                 dklen: 32,
//                 n: 262144,
//                 r: 8,
//                 p: 1,
//                 salt:
//                     '210445c05711f8f38ac6d74c2987e5486cc20f52bf5bdfa9dca5301a4dcdafad'
//             },
//             message: ''
//         },
//         checksum: {
//             function: 'sha256',
//             params: {},
//             message:
//                 '42843e646e228d5a515f17e32d983d3b95ba005a0e5af3495a8e87aa781af520'
//         },
//         cipher: {
//             function: 'aes-128-ctr',
//             params: { iv: '03da4cfd36f6189542754bc47d6338c4' },
//             message:
//                 '7fc22f527e47cf8d35df870447e973f310134e3525576f96d9d1c6689007d7fa'
//         }
//     },
//     description: '',
//     pubkey:
//         '88657de16886a86202bfc718f6684b829b09e28f3e9a51fffb1233032419ab3944330755e14310d41e0ecce948d1077a',
//     path: 'm/12381/3600/3/0/0',
//     uuid: 'ad4b5e65-f80d-4291-8154-43d91b32a382',
//     version: 4
// };
// const withdrawalCredentials = pubKeyToWithdrawalCredential(ks.pubkey);
// keystoreToBLSExecution(
//     ks,
//     'testwallet',
//     '0x3434343434343434343434343434343434343434',
//     50000,
//     withdrawalCredentials,
//     CHAIN_NAMES.mainnet
// ).then(console.log);
// getBLSToExecution(
//     Buffer.from(
//         '0437a236e55298dfb754f6132c641e282668066635b3efcae7b9487b52a2cb01',
//         'hex'
//     ),
//     '0x3434343434343434343434343434343434343434',
//     50000,
//     '0x00bd0b5a34de5fb17df08410b5e615dda87caf4fb72d0aac91ce5e52fc6aa8de',
//     CHAIN_NAMES.mainnet
// ).then(console.log);

// console.log(
//     pubKeyToWithdrawalCredential(
//         '86248e64705987236ec3c41f6a81d96f98e7b85e842a1d71405b216fa75a9917512f3c94c85779a9729c927ea2aa9ed1'
//     )
// );
