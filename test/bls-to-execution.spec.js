import { mnemonicToBLSExecution } from '../src/index';
import { expect } from 'chai';
describe('BLS Execution: Mnemonic', function () {
    this.timeout(5000);
    const testVectors = [
        {
            mnemonic:
                'sister protect peanut hill ready work profit fit wish want small inflict flip member tail between sick setup bright duck morning sell paper worry',
            withdrawalCredential:
                '0x00bd0b5a34de5fb17df08410b5e615dda87caf4fb72d0aac91ce5e52fc6aa8de',
            executionAddress: '0x3434343434343434343434343434343434343434',
            validator_indices: 1,
            validator_start_index: 0,
            chainName: 'mainnet',
            signature:
                '0x8cf4219884b326a04f6664b680cd9a99ad70b5280745af1147477aa9f8b4a2b2b38b8688c6a74a06f275ad4e14c5c0c70e2ed37a15ece5bf7c0724a376ad4c03c79e14dd9f633a3d54abc1ce4e73bec3524a789ab9a69d4d06686a8a67c9e4dc'
        },
        {
            mnemonic:
                'sister protect peanut hill ready work profit fit wish want small inflict flip member tail between sick setup bright duck morning sell paper worry',
            withdrawalCredential:
                '0x00bd0b5a34de5fb17df08410b5e615dda87caf4fb72d0aac91ce5e52fc6aa8de',
            executionAddress: '0x3434343434343434343434343434343434343434',
            validator_indices: 50000,
            validator_start_index: 0,
            chainName: 'mainnet',
            signature:
                '0x95e5ceccbaa2e3983c7fbaf693cbe6f5033f73850ace3b0fbbccb9f652198b17d895e339c0a5462cda6c093754e04a0902da3525fac66312ce00c3af19235d722ffe9541a145e2c60a440196f343447ff55bcb62a0f35a4dddaccbaab5025bf6'
        }
    ];
    testVectors.forEach((tv, idx) => {
        it('should pass ' + idx, async function () {
            const blsSig = await mnemonicToBLSExecution(
                {
                    mnemonic: tv.mnemonic
                },
                tv.executionAddress,
                tv.validator_indices,
                tv.withdrawalCredential,
                tv.chainName
            );
            expect(blsSig.signature).to.equal(tv.signature);
        });
    });
});
