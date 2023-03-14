const CHAIN_NAMES = {
    mainnet: 'mainnet',
    goerli: 'goerli',
    sepholia: 'sepholia',
    zhejiang: 'zhejiang'
};

const CHAIN_CONFIGS = {
    [CHAIN_NAMES.mainnet]: {
        GENESIS_FORK_VERSION: '00000000',
        GENESIS_VALIDATORS_ROOT:
            '4b363db94e286120d76eb905340fdd4e54bfe9f06bf33ff6cf5ad27f511bfe95'
    },
    [CHAIN_NAMES.goerli]: {
        GENESIS_FORK_VERSION: '00001020',
        GENESIS_VALIDATORS_ROOT:
            '043db0d9a83813551ee2f33450d23797757d430911a9320530ad8a0eabc43efb'
    },
    [CHAIN_NAMES.sepholia]: {
        GENESIS_FORK_VERSION: '90000069',
        GENESIS_VALIDATORS_ROOT:
            'd8ea171f3c94aea21ebc42a1ed61052acf3f9209c00e4efbaaddac09ed9b8078'
    },
    [CHAIN_NAMES.zhejiang]: {
        GENESIS_FORK_VERSION: '00000069',
        GENESIS_VALIDATORS_ROOT:
            '53a92d8f2bb1d85f62d16a156e6ebcd1bcaba652d0900b2c2f387826f3481f6f'
    }
};

export { CHAIN_CONFIGS, CHAIN_NAMES };
