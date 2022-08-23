const FloridaBlock = require('./floridablock');
const { GENESIS_DATA } = require('./config');
const cryptoHash = require('./crypto-hash');

describe('FloridaBlock', () => {
    const timestamp = '01/01/2000';
    const lastHash = 'the-last-hash';
    const hash = 'current-hash';
    const data = ['unassisted', 'hat-tricks'];

    //shortcut to use const name if same as construcor args e.g// data:data
    const block = new FloridaBlock({
        timestamp,
        lastHash,
        hash,
        data
    });

    it('has a timestamp, lastHash, hash, and data properies', () => {
        expect(block.timestamp).toEqual(timestamp);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.hash).toEqual(hash);
        expect(block.data).toEqual(data);
    });

    describe('genesis()', () => {
        const genesisBlock = FloridaBlock.genesis();

        it('returns a genesis Florida Block instance', () => {
            expect(genesisBlock instanceof FloridaBlock).toBe(true);
        });

        it('returns the genesis data', () => {
            expect(genesisBlock).toEqual(GENESIS_DATA);
        });

    });

    describe('mineFloridaBlock()', () => {
        const lastBlock = FloridaBlock.genesis();
        const data = 'mined data';
        const minedBlock = FloridaBlock.mineBlock({
            lastBlock,
            data
        });

        it('returns a genesis Florida Block instance', () => {
            expect(minedBlock instanceof FloridaBlock).toBe(true);
        });

        it('sets the `lastHash` to be `hash` of the lastBlock', () => {
            expect(minedBlock.lastHash).toEqual(lastBlock.hash);
        });

        it('sets the `data` to be', () => {
            expect(minedBlock.data).toEqual(data);
        });

        it('sets the `timestamp` to be', () => {
            expect(minedBlock.timestamp).not.toEqual(undefined);
        });

        it('creates sha-256 `hash` based on propor inputs', () => {
            expect(minedBlock.hash)
                .toEqual(cryptoHash(minedBlock.timestamp, lastBlock.hash, data))
        });
    });

});