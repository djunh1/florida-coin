const cryptoHash = require('./crypto-hash');

describe('CryptoHash()', () => {


  it('Generates a SHA-256 hashed output', () => {
    expect(cryptoHash('unassistedHatTricks'))
      .toEqual('87442fd1c78dd71a04eece8b3c90190430fce7d554cd3b06b7584f32fd2b83e7')
  });

  it('Produces same hash with same input args in any order', () => {
    expect(cryptoHash('first', 'second', 'third'))
    .toEqual(cryptoHash('third', 'first', 'second'))
  });

});
