/*
  Contains mock data for testing the slp.js library.
*/

'use strict'

import util from 'util'

import config from '../../../config/index.js'
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true
}

const tokenTx = {
  txid: '3f027a0006e28db49cfa24820d1cab67c3591e975791e46af689c319819bf8d0',
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: '0289aa657b65ce5cd91f0a4fc0519809b14a25452e761fe9222304b0c361ae5d',
      vout: 0,
      sequence: 4294967295,
      n: 0,
      scriptSig: {
        hex:
          '473044022066046b860e2f7380c0e06d7af04d889e885b639f62e370a69bcb3ed800caee1b022062e252d889c8e09d3cd559ef58e42548e9ac1ecbffd9728296aa18c71bc50bdc41210242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd',
        asm:
          '3044022066046b860e2f7380c0e06d7af04d889e885b639f62e370a69bcb3ed800caee1b022062e252d889c8e09d3cd559ef58e42548e9ac1ecbffd9728296aa18c71bc50bdc[ALL|FORKID] 0242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd'
      },
      value: 25756,
      legacyAddress: '1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL',
      cashAddress: 'bitcoincash:qz50nvfs07jp9kn2jz0s3ycwtfgz6fa8fgmc5skpja'
    },
    {
      txid: '8952079ec66e66fafa7042f665ceb97ef55d7d9ffc0f756b50e3e22373e6cffc',
      vout: 3,
      sequence: 4294967295,
      n: 1,
      scriptSig: {
        hex:
          '483045022100ba3dc8ce2f9541161191077d85af5610f3f717dcdb008432e2d4d6773c19cbd602201e9e6c410a45767812c7dca77b245beb982b4d9a51dab181f88e9f65d57035fc41210242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd',
        asm:
          '3045022100ba3dc8ce2f9541161191077d85af5610f3f717dcdb008432e2d4d6773c19cbd602201e9e6c410a45767812c7dca77b245beb982b4d9a51dab181f88e9f65d57035fc[ALL|FORKID] 0242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd'
      },
      value: 33720594,
      legacyAddress: '1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL',
      cashAddress: 'bitcoincash:qz50nvfs07jp9kn2jz0s3ycwtfgz6fa8fgmc5skpja'
    },
    {
      txid: '8952079ec66e66fafa7042f665ceb97ef55d7d9ffc0f756b50e3e22373e6cffc',
      vout: 2,
      sequence: 4294967295,
      n: 2,
      scriptSig: {
        hex:
          '47304402203e6ef3cd33e5084b3716d67995f4c31c72901bc09e63d0e55f774ec51ae89403022001bb3097910cd820eea4a435ce047c129e41068262e6e86789e4653d0540cddf41210242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd',
        asm:
          '304402203e6ef3cd33e5084b3716d67995f4c31c72901bc09e63d0e55f774ec51ae89403022001bb3097910cd820eea4a435ce047c129e41068262e6e86789e4653d0540cddf[ALL|FORKID] 0242faa7cc02f9e6c3a0aec97a946b9d3793fa6ab76362e02dd239bc56393671cd'
      },
      value: 546,
      legacyAddress: '1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL',
      cashAddress: 'bitcoincash:qz50nvfs07jp9kn2jz0s3ycwtfgz6fa8fgmc5skpja'
    }
  ],
  vout: [
    {
      value: '0.00000000',
      n: 0,
      scriptPubKey: {
        hex:
          '6a04534c500001010453454e442038e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0080000000005f5e1000800000000c67f476c',
        asm:
          'OP_RETURN 5262419 1 1145980243 38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0 0000000005f5e100 00000000c67f476c'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.00000546',
      n: 1,
      scriptPubKey: {
        hex: '76a914bfab3dcc6b696214b7cb9170350992a57c04134888ac',
        asm:
          'OP_DUP OP_HASH160 bfab3dcc6b696214b7cb9170350992a57c041348 OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['1JUTChe9zwdRaKCA2NYpeap7WvrKhpaoru'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.00000546',
      n: 2,
      scriptPubKey: {
        hex: '76a914a8f9b1307fa412da6a909f08930e5a502d27a74a88ac',
        asm:
          'OP_DUP OP_HASH160 a8f9b1307fa412da6a909f08930e5a502d27a74a OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.33745140',
      n: 3,
      scriptPubKey: {
        hex: '76a914a8f9b1307fa412da6a909f08930e5a502d27a74a88ac',
        asm:
          'OP_DUP OP_HASH160 a8f9b1307fa412da6a909f08930e5a502d27a74a OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['1GQTe9EdBaF4fCTC2esvPNXewkUZoytADL'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    }
  ],
  blockhash: '00000000000000000432104f41a7710d6e620221b77aa734b37b8c33605fc14c',
  blockheight: 575386,
  confirmations: 1,
  time: 1553552734,
  blocktime: 1553552734,
  valueOut: 0.33746232,
  size: 627,
  valueIn: 0.33746896,
  fees: 0.00000664,
  tokenInfo: {
    versionType: 1,
    transactionType: 'SEND',
    tokenIdHex:
      '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    sendOutputs: ['0', '100000000', '3330230124']
  },
  tokenIsValid: true
}

const nonTokenTx = {
  txid: 'c5834f0f29810a6bfa6325ebc5606f043875e5e0454b68b16e5fa343e6f8e8de',
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: '51a2362613468fd9fd2acc2b3e517517af0271f905c0da43d0d2aed91ce4a20e',
      vout: 1,
      sequence: 4294967295,
      n: 0,
      scriptSig: {
        hex:
          '47304402201a25caa655813c52796f80832d74a7f14dd915abf0bf3fbdcc0d7dc81c18680502206a858bbca81d58feebb55c04b9d05e3676818e9c02d71234d545c6facb8648d6412102fcddceee3cdd3e71aa2b87c2a56f6d0238c2740d15f0ccb4ebd29d96cb7d9c72',
        asm:
          '304402201a25caa655813c52796f80832d74a7f14dd915abf0bf3fbdcc0d7dc81c18680502206a858bbca81d58feebb55c04b9d05e3676818e9c02d71234d545c6facb8648d6[ALL|FORKID] 02fcddceee3cdd3e71aa2b87c2a56f6d0238c2740d15f0ccb4ebd29d96cb7d9c72'
      },
      value: 20003057,
      legacyAddress: 'mkrUSxSXPsskrjibBdWwQbvnJHJBFzpxak',
      cashAddress: 'bchtest:qqagnvlmugyxcc8dyz4q4ddtlzx7l6ktzqv2j4jkpy'
    }
  ],
  vout: [
    {
      value: '0.20002845',
      n: 0,
      scriptPubKey: {
        hex: '76a9140b0038e549e2057d8c8b03b2342807f4767ce5cc88ac',
        asm:
          'OP_DUP OP_HASH160 0b0038e549e2057d8c8b03b2342807f4767ce5cc OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['bchtest:qq9sqw89f83q2lvv3vpmydpgql68vl89esfthq0hp9'],
        type: 'pubkeyhash'
      },
      spentTxId:
        '06a6cd845cdd698b027d5c06659ef753d3330f010481a149aef3fd7b51603497',
      spentIndex: 0,
      spentHeight: 1294960
    }
  ],
  blockhash: '00000000620398a0b58971cd64bff9aba9c7912d0eb1248a44af851cd97421fe',
  blockheight: 1292573,
  confirmations: 2941,
  time: 1552533771,
  blocktime: 1552533771,
  valueOut: 0.20002845,
  size: 191,
  valueIn: 0.20003057,
  fees: 0.00000212,
  tokenInfo: null,
  tokenIsValid: false
}

const otherTokenTx = {
  txid: '37279c7dc81ceb34d12f03344b601c582e931e05d0e552c29c428bfa39d39af3',
  version: 2,
  locktime: 0,
  vin: [
    {
      txid: '06a6cd845cdd698b027d5c06659ef753d3330f010481a149aef3fd7b51603497',
      vout: 0,
      sequence: 4294967295,
      n: 0,
      scriptSig: {
        hex:
          '483045022100a931ef52ba396c067e7b5f9558ea177f53dfc46cd7207e6b0c4f0af28ec2f1c1022014f6c93c5ee119c2706dd0b5448ebe7a7b8110a6ec27dcfedc8291ec0fe9f42841210382609a74eac74d5e026dbbf7b9aab339ba6c068184e0364b4eb49ad2cb9cced6',
        asm:
          '3045022100a931ef52ba396c067e7b5f9558ea177f53dfc46cd7207e6b0c4f0af28ec2f1c1022014f6c93c5ee119c2706dd0b5448ebe7a7b8110a6ec27dcfedc8291ec0fe9f428[ALL|FORKID] 0382609a74eac74d5e026dbbf7b9aab339ba6c068184e0364b4eb49ad2cb9cced6'
      },
      value: 10000,
      legacyAddress: 'mzQ4FDMh8YsU5hew3w4Z3DxpLw9jHc7nPH',
      cashAddress: 'bchtest:qr83cu3p7yg9yac7qthwm0nul2ev2kukvsm07ttmdj'
    }
  ],
  vout: [
    {
      value: '0.00000000',
      n: 0,
      scriptPubKey: {
        hex:
          '6a04534c500001010747454e4553495306534c5053444b1c534c502053444b206578616d706c65207573696e6720424954424f5815646576656c6f7065722e626974636f696e2e636f6d4c0001080102080000001cbb369200',
        asm:
          'OP_RETURN 5262419 1 47454e45534953 534c5053444b 534c502053444b206578616d706c65207573696e6720424954424f58 646576656c6f7065722e626974636f696e2e636f6d 0 8 2 0000001cbb369200'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.00000546',
      n: 1,
      scriptPubKey: {
        hex: '76a914cf1c7221f11052771e02eeedbe7cfab2c55b966488ac',
        asm:
          'OP_DUP OP_HASH160 cf1c7221f11052771e02eeedbe7cfab2c55b9664 OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['bchtest:qr83cu3p7yg9yac7qthwm0nul2ev2kukvsm07ttmdj'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.00000546',
      n: 2,
      scriptPubKey: {
        hex: '76a914cf1c7221f11052771e02eeedbe7cfab2c55b966488ac',
        asm:
          'OP_DUP OP_HASH160 cf1c7221f11052771e02eeedbe7cfab2c55b9664 OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['bchtest:qr83cu3p7yg9yac7qthwm0nul2ev2kukvsm07ttmdj'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    },
    {
      value: '0.00008549',
      n: 3,
      scriptPubKey: {
        hex: '76a914cf1c7221f11052771e02eeedbe7cfab2c55b966488ac',
        asm:
          'OP_DUP OP_HASH160 cf1c7221f11052771e02eeedbe7cfab2c55b9664 OP_EQUALVERIFY OP_CHECKSIG',
        addresses: ['bchtest:qr83cu3p7yg9yac7qthwm0nul2ev2kukvsm07ttmdj'],
        type: 'pubkeyhash'
      },
      spentTxId: null,
      spentIndex: null,
      spentHeight: null
    }
  ],
  blockhash: '00000000000002c17af44d85a94755a4f13ad50cc6b13de797760d4c8b215cc0',
  blockheight: 1294960,
  confirmations: 555,
  time: 1553351742,
  blocktime: 1553351742,
  valueOut: 0.00009641,
  size: 358,
  valueIn: 0.0001,
  fees: 0.00000359,
  tokenInfo: {
    versionType: 1,
    transactionType: 'GENESIS',
    symbol: 'SLPSDK',
    name: 'SLP SDK example using BITBOX',
    documentUri: 'developer.bitcoin.com',
    documentSha256: null,
    decimals: 8,
    batonVout: 2,
    containsBaton: true,
    genesisOrMintQuantity: '123400000000'
  },
  tokenIsValid: true
}

const utxos = [
  {
    txid: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
    tx_hash: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
    vout: 3,
    tx_pos: 3,
    value: '9998658',
    height: 1332421,
    confirmations: 5
  },
  {
    txid: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
    tx_hash: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
    vout: 2,
    tx_pos: 2,
    value: '546',
    height: 1332421,
    confirmations: 5
  }
]

const fulcrumUtxos = {
  success: true,
  utxos: [
    {
      tx_hash: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
      tx_pos: 3,
      value: '9998658',
      height: 1332421,
      confirmations: 5
    },
    {
      tx_hash: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
      tx_pos: 2,
      value: '546',
      height: 1332421,
      confirmations: 5
    }
  ]
}

const tokenUtxos = [
  false,
  {
    txid: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
    tx_hash: '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
    vout: 2,
    tx_pos: 2,
    value: 546,
    height: 1332421,
    confirmations: 5,
    satoshis: 546,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: config.SLP_TOKEN_ID,
    tokenTicker: 'SLPSDK',
    tokenName: 'SLP SDK example using BITBOX',
    tokenDocumentUrl: 'developer.bitcoin.com',
    tokenDocumentHash: '',
    decimals: 8,
    tokenQty: 1220.69457267,
    isValid: true
  }
]

const validUtxo = {
  bestblock: '00000000000389b2ea2eb04db7468374bc943fb3e4bcc55719d954b26e38b815',
  confirmations: 5,
  value: 0.00000546,
  scriptPubKey: {
    asm:
      'OP_DUP OP_HASH160 57eae7d54fa8ed43d869c650d13cdb1b7024a5a2 OP_EQUALVERIFY OP_CHECKSIG',
    hex: '76a91457eae7d54fa8ed43d869c650d13cdb1b7024a5a288ac',
    reqSigs: 1,
    type: 'pubkeyhash',
    addresses: ['bchtest:qpt74e74f75w6s7cd8r9p5fumvdhqf995gp3mkk6xw']
  },
  coinbase: false
}

const fulcrumEmtpyUtxos = {
  success: true,
  utxos: []
}

const slpMockData = {
  tokenTx,
  nonTokenTx,
  otherTokenTx,
  utxos,
  fulcrumUtxos,
  tokenUtxos,
  validUtxo,
  fulcrumEmtpyUtxos
}

export default slpMockData
