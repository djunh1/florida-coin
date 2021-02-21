const DougBlock = require('./dougblock');
const BlockChain = require('./blockchain');

describe('Blockchain', () => {
  let blockChain, newChain, originalChain;

  // Resets blockchain to new instance before each test
  beforeEach(() => {
    blockChain = new BlockChain();
    newChain = new BlockChain();
    originalChain = blockChain.chain;
  });

  it('Contains a `chain` array instance', () => {
    expect(blockChain.chain instanceof Array).toBe(true);
  });

  it('starts with genesis block', () => {
    expect(blockChain.chain[0]).toEqual(DougBlock.genesis());
  });

  it('can add a new block to the chain', () => {
    const newData = 'unassisted';
    blockChain.addBlock({ data: newData});

    expect(blockChain.chain[blockChain.chain.length-1].data).toEqual(newData);
  });

  describe('isValidChain()', () => {
    describe('when chain does not start with genesis block', () => {
      it('will return false', () => {
        blockChain.chain[0] = { data: 'bad-genesis-block'}
        expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
      });

    });

    describe('when chain starts with genesis block and has multiple blocks', () => {
      beforeEach( () => {
        blockChain.addBlock({ data: 'Bruins' });
        blockChain.addBlock({ data: 'Red-Sox' });
        blockChain.addBlock({ data: 'Patriots' });
      });
      describe('and the last hash reference has changed', () => {
        it('returns false', () => {
          blockChain.chain[2].lastHash = 'busted-lastHash';
          expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
        });
      });

      describe('and the chain contains a block with invalid field', () => {
        it('returns false', () => {
          blockChain.chain[2].data = 'Monetreal-Canadians';
          expect(BlockChain.isValidChain(blockChain.chain)).toBe(false);
        });
      });

      describe('and the chain does not contain invalid blocks', () => {
        it('returns true', () => {
          expect(BlockChain.isValidChain(blockChain.chain)).toBe(true);
        });
      });
    });
  });

  describe('replaceChain()', () => {
    let errorMock, logMock;

    beforeEach(() => {
      logMock = jest.fn();
      errorMock = jest.fn();

      global.console.error = errorMock;
      global.console.log = logMock;

    });

    describe('when a new chain is shorter', () => {
      beforeEach(() => {
        newChain.chain[0] = {new: 'chain'}
        blockChain.replaceChain(newChain.chain);
      });
      it('does not replace original chain', () => {
        expect(blockChain.chain).toEqual(originalChain);
      });
      it('logs an error message', () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe('when a new chain is longer', () => {
      beforeEach(() => {
        newChain.addBlock({ data: 'Bruins' });
        newChain.addBlock({ data: 'Red-Sox' });
        newChain.addBlock({ data: 'Patriots' });
      });

      describe('and chain is invalid', () => {
        beforeEach(() => {
          newChain.chain[2].hash = 'bad-hash';
          blockChain.replaceChain(newChain.chain);
        });
        it('does not replace original chain', () => {
          expect(blockChain.chain).toEqual(originalChain);
        });
        it('logs an error message', () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe('and chain is valid', () => {
        beforeEach(() => {
          blockChain.replaceChain(newChain.chain);
        });
        it('replaces original chain', () => {
          blockChain.replaceChain(newChain.chain);
          expect(blockChain.chain).toEqual(newChain.chain);
        });
        it('logs message for chain replacement', () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });


  });
});
