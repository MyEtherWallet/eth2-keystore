import { expect } from 'chai';
import { CHAIN_NAMES } from '../src/chainConfigs';
import { keystoreToBLSExecution } from '../src/index';
import KeyVectors from './vectors/keystores/hd-keystore-withdrawal.json';

const PASSWORD = 'testwallet';

const VALIDATOR_INDEX = 5000;
const EXECUTION_ADDRESS = '0x3434343434343434343434343434343434343434';
const CHAIN_NAME = CHAIN_NAMES.mainnet;
const blsSigs = [
    {
        withdrawalCredential:
            '0x00b96bc5b6657846e3e735349e1de52daaea3c3a30877899f8e00124fc0dde1e',
        signature:
            '0x846762fd0c1c63695002ea7056a1f0d8f8aaa8c865cf53e10ff606fd96f4078415e1a57f53c6d318b014f8690c0988e40fd4f0da8073fc2df12baf5dd8358702983cac4b487275134dde498c36cae10aeec9d352579abdaf745d2d0495924fe8'
    },
    {
        withdrawalCredential:
            '0x00cc7891e111f635b43326cbb552281ac0185c152ae146420f524190ea349325',
        signature:
            '0xacce55a66ee5cf7e172782064b8ecbb7b281eddbeb82e14d11ffd4b462cd57d8f2342094db6160045b5483d574f471c5182bb90fce29b8e545f53a0b60253817f0b11e842fc0584ee161081ef484f52fdc9a3ba4bbfa653ec7f09776fe0af63b'
    },
    {
        withdrawalCredential:
            '0x00a369b4ebc685c7b23bc37a653e673bd7fab280df2e5ec07637d596c6e828b4',
        signature:
            '0x9963f8dd3082fcfa6548f5485863a506fbef87fb2dc6563d2bdda941b06ccc11a0a636323cfc2c1cc11c667910649b7b0b970494bcac552f08eb7b256f48ab08bea3fa6ce303cb4ee9b3d501305cbaa7e4a8845ff0dfdb13cefad5acb3e88d49'
    },
    {
        withdrawalCredential:
            '0x009639adef25d9dab5011e44fc77280cd7ec78be0898b4b8d5428b5bc4eac478',
        signature:
            '0x961bfd23f7d1a80501dce0b0013b51d4ba6e3efa4f8f78cc585de9944f69a79ffe235de17d8716aff2898edfce31e76d0af93733b0bb3959939b7f35be1e1a5bad73a9f234a0391a3b272c3df93e8af30aaa85a7947f47a01b80441423b5aecd'
    },
    {
        withdrawalCredential:
            '0x004b5dc380171bbc35fc31696c63e40f9bcdaf1581b83ac0f8a0576d7848c299',
        signature:
            '0x98113bee552f9eece3369ea407dc39b70d2f6f6d6044498690cb467854d9531a591c4f107e2b79fdf0a68615a19a6b2b06625d98df810c1749274ec3b4f6a6159127235ebd02333ee7ab75121473b12d77485dfbc378ac1db62529506f4a9742'
    }
];
describe('BLS Execution: Keystore', function () {
    this.timeout(30000);
    Object.keys(KeyVectors).forEach((vIdx, idx) => {
        const _key = KeyVectors[vIdx];
        it('should pass path ' + _key.path, async () => {
            const sig = await keystoreToBLSExecution(
                _key,
                PASSWORD,
                EXECUTION_ADDRESS,
                VALIDATOR_INDEX,
                blsSigs[idx].withdrawalCredential,
                CHAIN_NAME
            );
            expect(sig.signature).to.equal(blsSigs[idx].signature);
        });
    });
});
