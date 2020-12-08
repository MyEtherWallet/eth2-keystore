import { expect } from 'chai';
import {
    deriveChildSK,
    deriveMasterSK,
    deriveChildSKMultiple,
    pathToIndices
} from '@chainsafe/bls-hd-key';
import { init, SecretKey } from '@chainsafe/bls';
import testVectorsJson from './vectors/seeds.json';

describe('seed derivation', function () {
    const testVectors = testVectorsJson;
    describe('child key derivation', function () {
        testVectors.forEach((testVector, index) => {
            it(`test vector #${index}`, async function () {
                const seed = Buffer.from(
                    testVector.seed.replace('0x', ''),
                    'hex'
                );
                const masterSK = deriveMasterSK(seed);
                let childSK;
                if (!testVector.path) childSK = deriveChildSK(masterSK, 0);
                else
                    childSK = deriveChildSKMultiple(
                        masterSK,
                        pathToIndices(testVector.path)
                    );
                await init('herumi');
                expect(
                    SecretKey.fromBytes(childSK).toPublicKey().toHex()
                ).to.be.deep.equal('0x' + testVector.publicKey);
            });
        });
    });
});
