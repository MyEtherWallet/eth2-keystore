import { expect } from 'chai';
import KeyStore, { verifyKeystore } from '../src/index';
import KeyVectors from './vectors/keystores/hd-keystore.json';

const MNEMONIC =
    'tenant glimpse solve letter chest ankle jealous movie subway exhibit cream garden scene grunt below patrol hurt fatigue escape trap phrase mandate feature one';
const PASSWORD = 'testwallet';
describe('HD keystore Test', function () {
    this.timeout(10000);
    Object.keys(KeyVectors).forEach(vIdx => {
        const _key = KeyVectors[vIdx];
        it('should pass path ' + _key.path, async () => {
            delete _key['uuid'];
            const params = {
                salt: Buffer.from(_key.crypto.kdf.params.salt, 'hex'),
                iv: Buffer.from(_key.crypto.cipher.params.iv, 'hex'),
                kdf: _key.crypto.kdf.function
            };
            const ks = new KeyStore(MNEMONIC);
            const idx = parseInt(_key.path.split('/')[3]);
            const genKeystore = await ks.toKeystore(PASSWORD, idx, params);
            delete genKeystore['uuid'];
            expect(genKeystore).to.deep.equal(_key);
            const res = await verifyKeystore(genKeystore, PASSWORD);
            expect(res).to.equal(true);
        });
    });
});
