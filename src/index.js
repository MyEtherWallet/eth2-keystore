import * as bip39 from 'bip39';
import {
    deriveMasterSK,
    pathToIndices,
    deriveChildSKMultiple
} from '@chainsafe/bls-hd-key';
import { generatePublicKey, initBLS } from '@chainsafe/bls';
import generateKeystore from './generateKeystore';
import verifyKeystore from './verifyKeystore';
class Keystore {
    constructor(mnemonic = '', password = '', bits = 256, lang = 'english') {
        bip39.setDefaultWordlist(lang);
        if (mnemonic === '') {
            mnemonic = bip39.generateMnemonic(bits);
        }
        this.mnemonic = mnemonic;
        this.bits = bits;
        this.seed = bip39.mnemonicToSeedSync(mnemonic, password);
        this.masterKey = deriveMasterSK(this.seed);
    }
    async getEntropy() {
        return bip39.mnemonicToEntropy(this.mnemonic);
    }
    async getSeed() {
        return this.seed;
    }
    async getMnemonic() {
        return this.mnemonic;
    }
    async getPath(idx = 0) {
        return `m/12381/3600/${idx}/0/0`;
    }
    async getChildKey(idx = 0) {
        const path = await this.getPath(idx);
        return deriveChildSKMultiple(this.masterKey, pathToIndices(path));
    }
    async getPublicKey(idx = 0) {
        await initBLS();
        return generatePublicKey(this.getChildKey(idx));
    }
    async toKeystore(password, idx = 0, params = {}) {
        const childKey = await this.getChildKey(idx);
        const path = await this.getPath(idx);
        return generateKeystore(childKey, password, params, path);
    }
}
export { generateKeystore, verifyKeystore };
export default Keystore;
