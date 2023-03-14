import { normalizePassword, KDFFunctions, runCipherBuffer } from './utils';
import { pbkdf2Sync, createDecipheriv } from 'crypto';
import { sha256 } from 'ethereumjs-util';
import { scrypt } from 'scrypt-js';

const getDerivedKey = async (keystore, password) => {
    password = normalizePassword(password);
    let derivedKey;
    if (keystore.crypto.kdf.function === KDFFunctions.Scrypt) {
        const kdfparams = keystore.crypto.kdf.params;
        derivedKey = await scrypt(
            Buffer.from(password),
            Buffer.from(kdfparams.salt, 'hex'),
            kdfparams.n,
            kdfparams.r,
            kdfparams.p,
            kdfparams.dklen
        );
        derivedKey = Buffer.from(derivedKey);
    } else if (keystore.crypto.kdf.function === KDFFunctions.PBKDF) {
        const kdfparams = keystore.crypto.kdf.params;
        derivedKey = pbkdf2Sync(
            Buffer.from(password),
            Buffer.from(kdfparams.salt, 'hex'),
            kdfparams.c,
            kdfparams.dklen,
            'sha256'
        );
    }
    return derivedKey;
};

const verify = async (keystore, password) => {
    const derivedKey = await getDerivedKey(keystore, password);
    const checksum = sha256(
        Buffer.concat([
            derivedKey.slice(16),
            Buffer.from(keystore.crypto.cipher.message, 'hex')
        ])
    ).toString('hex');
    return checksum === keystore.crypto.checksum.message;
};

const getSecretKeyFromKeystore = async (keystore, password) => {
    const derivedKey = await getDerivedKey(keystore, password);
    const checksum = sha256(
        Buffer.concat([
            derivedKey.slice(16),
            Buffer.from(keystore.crypto.cipher.message, 'hex')
        ])
    ).toString('hex');
    if (checksum !== keystore.crypto.checksum.message)
        return Promise.reject('invalid password');
    const ciphertext = createDecipheriv(
        keystore.crypto.cipher.function,
        derivedKey.slice(0, 16),
        Buffer.from(keystore.crypto.cipher.params.iv, 'hex')
    );
    const key = runCipherBuffer(
        ciphertext,
        Buffer.from(keystore.crypto.cipher.message, 'hex')
    );
    return key;
};

export { getSecretKeyFromKeystore, verify };
