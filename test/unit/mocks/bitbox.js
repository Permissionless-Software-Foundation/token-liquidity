/*
  Contains mocks of BITBOX library calls.
*/

'use strict'

const sinon = require('sinon')

// Inspect JS Objects.
const util = require('util')
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true
}

const addressDetails = [
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: [],
    legacyAddress: 'mv9wPCHx2iCdbXBkJ1UTAZCAq57PCL2YQ9',
    cashAddress: 'bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt'
  },
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0.1,
    totalReceivedSat: 10000000,
    totalSent: 0.1,
    totalSentSat: 10000000,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 2,
    transactions: [
      '26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b',
      '85ddb8215fc3701a493cf1c450644c5ef32c55aaa2f48ae2d008944394f3e4d3'
    ],
    legacyAddress: 'n3A9BmjrEG3ubJeoAJGwjkymhmqZhGbZR2',
    cashAddress: 'bchtest:qrkkx8au5lxsu2hka2c4ecn3juxjpcuz05wh08hhl2',
    addressIndex: 1
  },
  {
    balance: 0.03,
    balanceSat: 3000000,
    totalReceived: 0.03,
    totalReceivedSat: 3000000,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 1,
    transactions: [
      '26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b'
    ],
    legacyAddress: 'msnHMfK2pwaBWdE7a7y4f7atdzYahRM7t8',
    cashAddress: 'bchtest:qzrg022p8ykc90c27gy808pmz3lzlwk6lg77y3h8fm',
    addressIndex: 2
  },
  {
    balance: 0.06999752,
    balanceSat: 6999752,
    totalReceived: 0.06999752,
    totalReceivedSat: 6999752,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 1,
    transactions: [
      '26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b'
    ],
    legacyAddress: 'mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz',
    cashAddress: 'bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3',
    addressIndex: 3
  }
]

const utxos = [
  [
    {
      txid: '26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b',
      vout: 1,
      scriptPubKey: '76a9142b0379444f2e01905b2dd511644af4f53556edeb88ac',
      amount: 0.06999752,
      satoshis: 6999752,
      height: 1265272,
      confirmations: 644,
      legacyAddress: 'mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz',
      cashAddress: 'bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3',
      hdIndex: 3
    },
    {
      txid: '26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b',
      vout: 0,
      scriptPubKey: '76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac',
      amount: 0.03,
      satoshis: 3000000,
      height: 1265272,
      confirmations: 733,
      legacyAddress: 'mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz',
      cashAddress: 'bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3',
      hdIndex: 2
    }
  ]
]

class mockTransactionBuilder {
  constructor () {
    this.hashTypes = {
      SIGHASH_ALL: 0x01,
      SIGHASH_NONE: 0x02,
      SIGHASH_SINGLE: 0x03,
      SIGHASH_ANYONECANPAY: 0x80,
      SIGHASH_BITCOINCASH_BIP143: 0x40,
      ADVANCED_TRANSACTION_MARKER: 0x00,
      ADVANCED_TRANSACTION_FLAG: 0x01
    }

    this.transaction = new MockTxBuilder()
  }
  addInput () {
    sinon.stub().returns({})
  }
  addOutput () {
    sinon.stub().returns({})
  }
  sign () {
    sinon.stub().returns({})
  }
  build () {
    return new MockTxBuilder()
  }
}

class MockTxBuilder {
  constructor () {}
  toHex () {
    return 'mockTXHex'
  }
  build () {
    return this.toHex
  }
}

const mockTransactions = {
  pagesTotal: 1,
  txs: [
    {
      txid: '9f56ba221d862e41f33b564e49ddffc66ec9b5bcaf4669d40e1d890ade4817bc',
      version: 2,
      locktime: 0,
      vin: [
        {
          txid:
            '017d01acd7e0f7c3a94d37718a2a213a32fba946c57692126706a4d28a3fece2',
          vout: 1,
          sequence: 4294967295,
          n: 0,
          scriptSig: {
            hex:
              '47304402204f1d01719118e2c4ef65d511932df230b5d2561a8ca142d3906edae893e93cf902206c077b5ce075ef76c3d7d1f8d4ea6d17dd483bba0aa74414c0dd879161bc8c1c4121024d4e7f522f67105b7bf5f9dbe557e7b2244613fdfcd6fe09304f93877328f6be',
            asm:
              '304402204f1d01719118e2c4ef65d511932df230b5d2561a8ca142d3906edae893e93cf902206c077b5ce075ef76c3d7d1f8d4ea6d17dd483bba0aa74414c0dd879161bc8c1c[ALL|FORKID] 024d4e7f522f67105b7bf5f9dbe557e7b2244613fdfcd6fe09304f93877328f6be'
          },
          addr: 'mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1',
          valueSat: 10000000,
          value: 0.1,
          doubleSpentTxID: null
        }
      ],
      vout: [
        {
          value: '0.00010000',
          n: 0,
          scriptPubKey: {
            hex: '76a9140ee020c07f39526ac5505c54fa1ab98490979b8388ac',
            asm:
              'OP_DUP OP_HASH160 0ee020c07f39526ac5505c54fa1ab98490979b83 OP_EQUALVERIFY OP_CHECKSIG',
            addresses: ['mgscFRQyQAFpmxDjp1FGX7ALhGa11iqMbU'],
            type: 'pubkeyhash'
          },
          spentTxId: null,
          spentIndex: null,
          spentHeight: null
        },
        {
          value: '0.09989752',
          n: 1,
          scriptPubKey: {
            hex: '76a9143a9b2b0c12fe722fcf653b6ef5dcc38732d6ff5188ac',
            asm:
              'OP_DUP OP_HASH160 3a9b2b0c12fe722fcf653b6ef5dcc38732d6ff51 OP_EQUALVERIFY OP_CHECKSIG',
            addresses: ['mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1'],
            type: 'pubkeyhash'
          },
          spentTxId:
            '3c17c8e82ff8c5b1eb7109b0c554dfbda4dd7a9b69cc67f7917c77f6eab580c0',
          spentIndex: 0,
          spentHeight: 1273032
        }
      ],
      blockhash:
        '000000007d37624796e2d1d41ab29b0ebab1006728415a5c3213f1fff2854ca2',
      blockheight: 1273032,
      confirmations: 30,
      time: 1544288661,
      blocktime: 1544288661,
      valueOut: 0.09999752,
      size: 225,
      valueIn: 0.1,
      fees: 0.00000248
    },
    {
      txid: '3c17c8e82ff8c5b1eb7109b0c554dfbda4dd7a9b69cc67f7917c77f6eab580c0',
      version: 2,
      locktime: 0,
      vin: [
        {
          txid:
            '9f56ba221d862e41f33b564e49ddffc66ec9b5bcaf4669d40e1d890ade4817bc',
          vout: 1,
          sequence: 4294967295,
          n: 0,
          scriptSig: {
            hex:
              '4730440220525253f55de18e9759e15c2ef6d3f1394484c6083384ae4136881d00496615f002205639c7d521be48e1c5dea91601d580a3c4fb480e86be6190921e2f09c00c3a604121024d4e7f522f67105b7bf5f9dbe557e7b2244613fdfcd6fe09304f93877328f6be',
            asm:
              '30440220525253f55de18e9759e15c2ef6d3f1394484c6083384ae4136881d00496615f002205639c7d521be48e1c5dea91601d580a3c4fb480e86be6190921e2f09c00c3a60[ALL|FORKID] 024d4e7f522f67105b7bf5f9dbe557e7b2244613fdfcd6fe09304f93877328f6be'
          },
          addr: 'mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1',
          valueSat: 9989752,
          value: 0.09989752,
          doubleSpentTxID: null
        }
      ],
      vout: [
        {
          value: '0.00010000',
          n: 0,
          scriptPubKey: {
            hex: '76a9140ee020c07f39526ac5505c54fa1ab98490979b8388ac',
            asm:
              'OP_DUP OP_HASH160 0ee020c07f39526ac5505c54fa1ab98490979b83 OP_EQUALVERIFY OP_CHECKSIG',
            addresses: ['mgscFRQyQAFpmxDjp1FGX7ALhGa11iqMbU'],
            type: 'pubkeyhash'
          },
          spentTxId: null,
          spentIndex: null,
          spentHeight: null
        },
        {
          value: '0.09979504',
          n: 1,
          scriptPubKey: {
            hex: '76a9143a9b2b0c12fe722fcf653b6ef5dcc38732d6ff5188ac',
            asm:
              'OP_DUP OP_HASH160 3a9b2b0c12fe722fcf653b6ef5dcc38732d6ff51 OP_EQUALVERIFY OP_CHECKSIG',
            addresses: ['mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1'],
            type: 'pubkeyhash'
          },
          spentTxId: null,
          spentIndex: null,
          spentHeight: null
        }
      ],
      blockhash:
        '000000007d37624796e2d1d41ab29b0ebab1006728415a5c3213f1fff2854ca2',
      blockheight: 1273032,
      confirmations: 30,
      time: 1544288661,
      blocktime: 1544288661,
      valueOut: 0.09989504,
      size: 225,
      valueIn: 0.09989752,
      fees: 0.00000248
    },
    {
      txid: '017d01acd7e0f7c3a94d37718a2a213a32fba946c57692126706a4d28a3fece2',
      version: 2,
      locktime: 0,
      vin: [
        {
          txid:
            '2e94535046bcc49c8d4b5399014d4a788acc35f7c9feea23e8957c819243cdad',
          vout: 0,
          sequence: 4294967295,
          n: 0,
          scriptSig: {
            hex:
              '47304402205318e78e64dae1efa8f976a4ac196d6338f76cb1ab2bf05c5294e575920d0a6802207735f1366d4313e24734fa15fbc11fd668e8a3478579b0f4179ca927adf535a4412103c346eee77a77a8d3e073dacc0532ca7a5b9747bc06d88bf091cac9f4bc8bb792',
            asm:
              '304402205318e78e64dae1efa8f976a4ac196d6338f76cb1ab2bf05c5294e575920d0a6802207735f1366d4313e24734fa15fbc11fd668e8a3478579b0f4179ca927adf535a4[ALL|FORKID] 03c346eee77a77a8d3e073dacc0532ca7a5b9747bc06d88bf091cac9f4bc8bb792'
          },
          addr: 'mkWqVHGbfpznuu3JpPoXfCnHrhoekJLUGu',
          valueSat: 44378849263,
          value: 443.78849263,
          doubleSpentTxID: null
        }
      ],
      vout: [
        {
          value: '443.68849037',
          n: 0,
          scriptPubKey: {
            hex: '76a91436d2f27bbd826a86db1e93618ce3de89ef33169388ac',
            asm:
              'OP_DUP OP_HASH160 36d2f27bbd826a86db1e93618ce3de89ef331693 OP_EQUALVERIFY OP_CHECKSIG',
            addresses: ['mkWqVHGbfpznuu3JpPoXfCnHrhoekJLUGu'],
            type: 'pubkeyhash'
          },
          spentTxId: null,
          spentIndex: null,
          spentHeight: null
        },
        {
          value: '0.10000000',
          n: 1,
          scriptPubKey: {
            hex: '76a9143a9b2b0c12fe722fcf653b6ef5dcc38732d6ff5188ac',
            asm:
              'OP_DUP OP_HASH160 3a9b2b0c12fe722fcf653b6ef5dcc38732d6ff51 OP_EQUALVERIFY OP_CHECKSIG',
            addresses: ['mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1'],
            type: 'pubkeyhash'
          },
          spentTxId:
            '9f56ba221d862e41f33b564e49ddffc66ec9b5bcaf4669d40e1d890ade4817bc',
          spentIndex: 0,
          spentHeight: 1273032
        }
      ],
      blockhash:
        '00000000000070b82c60c20c9927a4a1c13c42d571819b91faf3f0d8006120f8',
      blockheight: 1273026,
      confirmations: 36,
      time: 1544284169,
      blocktime: 1544284169,
      valueOut: 443.78849037,
      size: 225,
      valueIn: 443.78849263,
      fees: 0.00000226
    }
  ]
}

const mockTransactionDetails = {
  txid: 'a77762bb47c130e755cc053db51333bbd64596eefd18baffc08a447749863fa9',
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: '3c17c8e82ff8c5b1eb7109b0c554dfbda4dd7a9b69cc67f7917c77f6eab580c0',
      vout: 1,
      sequence: 4294967295,
      n: 0,
      scriptSig: {
        hex:
          '47304402206109655a258103dbd3bc586ce25265499aec2e7145a85f4b582c142fef389e9902201b2b6decd0424fb007da66fb03c32c1babeabbbfa37cdf61c62f79c6287036e24121024d4e7f522f67105b7bf5f9dbe557e7b2244613fdfcd6fe09304f93877328f6be',
        asm:
          '304402206109655a258103dbd3bc586ce25265499aec2e7145a85f4b582c142fef389e9902201b2b6decd0424fb007da66fb03c32c1babeabbbfa37cdf61c62f79c6287036e2[ALL|FORKID] 024d4e7f522f67105b7bf5f9dbe557e7b2244613fdfcd6fe09304f93877328f6be'
      },
      value: 9979504,
      legacyAddress: 'mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1',
      cashAddress: 'bchtest:qqafk2cvztl8yt70v5akaawucwrn94hl2yups7rzfn'
    }
  ],
  vout: [
    {
      value: '0.00010000',
      n: 0,
      scriptPubKey: {
        hex: '76a9140ee020c07f39526ac5505c54fa1ab98490979b8388ac',
        asm:
          'OP_DUP OP_HASH160 0ee020c07f39526ac5505c54fa1ab98490979b83 OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['mgscFRQyQAFpmxDjp1FGX7ALhGa11iqMbU'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.09969256',
      n: 1,
      scriptPubKey: {
        hex: '76a9143a9b2b0c12fe722fcf653b6ef5dcc38732d6ff5188ac',
        asm:
          'OP_DUP OP_HASH160 3a9b2b0c12fe722fcf653b6ef5dcc38732d6ff51 OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['mkrqNTCLguVKLye5Wg6y5Z3rCrK8Urq9a1'],
        type: 'pubkeyhash'
      },
      spentTxId:
        '044eb9debb938c097c9a91e94bfb102c4447a1dc4a85aa1f4a32f28c8241ba61',
      spentIndex: 0,
      spentHeight: 1273102
    }
  ],
  blockhash: '00000000ce6fb45be8b2747e067f30a993ccb4ab9e6b9cebd9ad82ee7c1ef646',
  blockheight: 1273102,
  confirmations: 78,
  time: 1544328309,
  blocktime: 1544328309,
  valueOut: 0.09979256,
  size: 225,
  valueIn: 0.09979504,
  fees: 0.00000248
}

const bitboxMock = {
  Mnemonic: {
    generate: sinon.stub().returns({}),
    wordLists: sinon.stub().returns({}),
    toSeed: sinon.stub().returns({})
  },
  HDNode: {
    fromSeed: sinon.stub().returns({}),
    derivePath: sinon.stub().returns({}),
    toCashAddress: sinon.stub().returns({}),
    toLegacyAddress: sinon.stub().returns({}),
    toKeyPair: sinon.stub().returns({})
  },
  Address: {
    details: sinon.stub().returns(addressDetails),
    utxo: sinon.stub().returns(utxos),
    toLegacyAddress: sinon.stub().returns({}),
    transactions: sinon.stub().returns(mockTransactions),
    toCashAddress: sinon.stub().returns(`bchtest:qq8wqgxq0uu4y6k92pw9f7s6hxzfp9umsvtg39pzqf`)
  },
  TransactionBuilder: mockTransactionBuilder,
  Transaction: {
    details: sinon.stub().returns(mockTransactionDetails)
  },
  BitcoinCash: {
    getByteCount: sinon.stub().returns(250)
  },
  RawTransactions: {
    sendRawTransaction: sinon.stub().returns(`mockTXID`)
  }
}

module.exports = {
  bitboxMock,
  mockTransactions
}
