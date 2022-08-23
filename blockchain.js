const Block = require('./floridablock');
const cryptoHash = require('./crypto-hash');

class BlockChain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain) {
        if (chain.length <= this.chain.length) {
            console.error('The incoming chain must be longer');
            return;
        }

        if (!BlockChain.isValidChain(chain)) {
            console.error('The incoming chain must be valid');
            return;
        }

        console.log('Chain is replaced with', chain);
        this.chain = chain;
    }

    //chain array arguement, implied in constructor
    static isValidChain(chain) {
        //Genesis block check
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false;
        }

        //Check to see if last hash was tampered with
        for (let i = 1; i < chain.length; i++) {
            //block has each param, so we can use a shortcut to access fields
            const { timestamp, lastHash, hash, data, nonce, difficulty } = chain[i];
            const actualLastHash = chain[i - 1].hash;

            if (lastHash !== actualLastHash) return false;

            const validatedHash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

            if (hash !== validatedHash) return false;

        }
        return true;
    }

}

module.exports = BlockChain;
