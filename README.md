# Eth2 Keystore

![npm (tag)](https://img.shields.io/npm/v/@myetherwallet/eth2-keystore/latest)
![GitHub](https://img.shields.io/github/license/MyEtherWallet/eth2-keystore)
![Node Version](https://img.shields.io/badge/node-12.x-green)

Utility functions for generating BLS secret keys, built for NodeJs and Browser.

-   Create keystore from BIP-39 mnemonic.
-   Create a derived child key from BIP-39 mnemonic.
-   Create Eth2 validator keystore from mnemonic.

Implementation follows EIPS: [EIP-2334](https://github.com/ethereum/EIPs/pull/2334), [EIP-2333](https://github.com/ethereum/EIPs/pull/2333)

For low-level [EIP-2333](https://github.com/ethereum/EIPs/pull/2333) and [EIP-2334](https://github.com/ethereum/EIPs/pull/2334) functionality, see [@chainsafe/bls-hd-key](https://github.com/chainsafe/bls-hd-key).

### Examples

```javascript
//New mnemonic
import KeyStore, { verifyKeystore } from '@myetherwallet/eth2-keystore';
const PASSWORD = 'testwallet';
const ks = new KeyStore();
console.log(await ks.getMnemonic());
const genSigningKeystore = await ks.toSigningKeystore(PASSWORD); //generates the keystore json
const res = await verifyKeystore(genSigningKeystore, PASSWORD); //verify generated keystore
//res === true
const genWithdrawalKeystore = await ks.toWithdrawalKeystore(PASSWORD); //generates the keystore json
const res2 = await verifyKeystore(genWithdrawalKeystore, PASSWORD); //verify generated keystore
//res2 === true

//Existing mnemonic
import KeyStore, { verifyKeystore } from '@myetherwallet/eth2-keystore';
const MNEMONIC =
    'tenant glimpse solve letter chest ankle jealous movie subway exhibit cream garden scene grunt below patrol hurt fatigue escape trap phrase mandate feature one';
const PASSWORD = 'testwallet';
const ks = new KeyStore({
    mnemonic: MNEMONIC
});
console.log(ks.getMnemonic());
//tenant glimpse solve letter chest ankle jealous movie subway exhibit cream garden scene grunt below patrol hurt fatigue escape trap phrase mandate feature one
const genSigningKeystore = await ks.toSigningKeystore(PASSWORD); //generates the keystore json
const res = await verifyKeystore(genSigningKeystore, PASSWORD); //verify generated keystore
//res === true
const genWithdrawalKeystore = await ks.toWithdrawalKeystore(PASSWORD); //generates the keystore json
const res2 = await verifyKeystore(genWithdrawalKeystore, PASSWORD); //verify generated keystore
//res2 === true

//BLS To Execution Change
import KeyStore, {
    verifyKeystore,
    keystoreToBLSExecution,
    mnemonicToBLSExecution
    CHAIN_NAMES
} from '@myetherwallet/eth2-keystore';
const MNEMONIC =
    'sister protect peanut hill ready work profit fit wish want small inflict flip member tail between sick setup bright duck morning sell paper worry';
const PASSWORD = 'testwallet';
const ks = new KeyStore({
    mnemonic: MNEMONIC
});
console.log(ks.getMnemonic());
//tenant glimpse solve letter chest ankle jealous movie subway exhibit cream garden scene grunt below patrol hurt fatigue escape trap phrase mandate feature one
const genWithdrawalKeystore = await ks.toWithdrawalKeystore(PASSWORD); //generates the keystore json
const res2 = await verifyKeystore(genWithdrawalKeystore, PASSWORD); //verify generated keystore
//res2 === true
const VALIDATOR_INDEX = 5000;
const EXECUTION_ADDRESS = '0x3434343434343434343434343434343434343434';
const CHAIN_NAME = CHAIN_NAMES.mainnet;
const currentWithdrawalCredential =
    '0x00bd0b5a34de5fb17df08410b5e615dda87caf4fb72d0aac91ce5e52fc6aa8de'; // you have to get it onchain
const blsExecution = await keystoreToBLSExecution(
    genWithdrawalKeystore,
    PASSWORD,
    EXECUTION_ADDRESS,
    VALIDATOR_INDEX,
    currentWithdrawalCredential,
    CHAIN_NAME
); //generate blstoExecution
console.log(blsExecution);
// {
//     message: {
//         validator_index: '50000',
//         from_bls_pubkey:
//             '0x86248e64705987236ec3c41f6a81d96f98e7b85e842a1d71405b216fa75a9917512f3c94c85779a9729c927ea2aa9ed1',
//         to_execution_address: '0x3434343434343434343434343434343434343434'
//     },
//     signature:
//         '0x95e5ceccbaa2e3983c7fbaf693cbe6f5033f73850ace3b0fbbccb9f652198b17d895e339c0a5462cda6c093754e04a0902da3525fac66312ce00c3af19235d722ffe9541a145e2c60a440196f343447ff55bcb62a0f35a4dddaccbaab5025bf6',
//     metadata: {
//         network_name: 'mainnet',
//         genesis_validators_root:
//             '0x4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95',
//         deposit_cli_version: '2.5.0'
//     }
// };
//  you have to submit this to curl -X POST -H “Content-type: application/json” -d @<@FILENAME DESTINATION> http://<BEACON_NODE_HTTP_API_URL>/eth/v1/beacon/pool/bls_to_execution_changes

// You can also go directly from mnemonic
const blsSig = await mnemonicToBLSExecution(
                {
                    mnemonic: MNEMONIC
                },
                EXECUTION_ADDRESS,
                VALIDATOR_INDEX,
                currentWithdrawalCredential,
                CHAIN_NAME
            );

//get withdrawal credential from public key
import { pubKeyToWithdrawalCredential } from '@myetherwallet/eth2-keystore';
const PUBKEY =
    '0x86248e64705987236ec3c41f6a81d96f98e7b85e842a1d71405b216fa75a9917512f3c94c85779a9729c927ea2aa9ed1';
console.log(pubKeyToWithdrawalCredential(PUBKEY));
// 0x00bd0b5a34de5fb17df08410b5e615dda87caf4fb72d0aac91ce5e52fc6aa8de
```

### Contribution

Requirements:

-   nodejs
-   npm

```bash
    npm install
    npm run test
```

### Audit

This repo is using the library audited by [this security audit](https://github.com/ChainSafe/lodestar/blob/master/audits/2020-03-23_UTILITY_LIBRARIES.pdf), released 2020-03-23. Commit [`767c998`](https://github.com/ChainSafe/bls-hd-key/commit/767c998) verified in the report.

### Special Thanks

to [@chainsafe](https://github.com/ChainSafe) for providing necessary libraries

### License

MIT
