/*
  Mock data for the slp2.js unit tests.
*/

const tokenBalance01 = [
  {
    tokenId: 'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',
    ticker: 'TLT',
    name: 'Token Liquidity Test',
    decimals: 8,
    tokenType: 1,
    url: 'https://FullStack.cash',
    qty: 644918.46932634
  }
]

const tokenTx01 = {
  txid: '8bc18ff56797ce6153b6d5351eb075038bbd4739c9e8d2ea83a494da4801b78d',
  hash: '8bc18ff56797ce6153b6d5351eb075038bbd4739c9e8d2ea83a494da4801b78d',
  version: 2,
  size: 514,
  locktime: 0,
  vin: [
    {
      txid: 'e4c1ba6323a17fcc3ae0043660f2c2e409992abcb10a8cfc74ef2e2f92236219',
      vout: 2,
      scriptSig: {
        asm: '304402204e3ae7471c1e69b0c76c801d1efe00dfe6658767edd4f17cf9f917ce2cd3bab402201e63db7c59dd9895cb423fb71538abfb303b19728311345e095528684adec641[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex: '47304402204e3ae7471c1e69b0c76c801d1efe00dfe6658767edd4f17cf9f917ce2cd3bab402201e63db7c59dd9895cb423fb71538abfb303b19728311345e095528684adec6414121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
      },
      sequence: 4294967295,
      address: 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d',
      value: 0.00000546,
      tokenQtyStr: '99949999',
      tokenQty: 99949999,
      tokenId:
        'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469'
    },
    {
      txid: 'e4c1ba6323a17fcc3ae0043660f2c2e409992abcb10a8cfc74ef2e2f92236219',
      vout: 4,
      scriptSig: {
        asm: '3045022100e46d3b81a6e0727f37f049abf81aa91e85b001cd905b65177788a55a3c5827730220707b4070bfc6b244f199d4fc8ac43f880ec07d0c025433b40c5a334c527b3b17[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex: '483045022100e46d3b81a6e0727f37f049abf81aa91e85b001cd905b65177788a55a3c5827730220707b4070bfc6b244f199d4fc8ac43f880ec07d0c025433b40c5a334c527b3b174121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
      },
      sequence: 4294967295,
      address: 'bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d',
      value: 0.00024237,
      tokenQtyStr: 'NaN',
      tokenQty: null,
      tokenId:
        'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469'
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        asm: 'OP_RETURN 5262419 1 1145980243 c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469 000000003b9aca00 0023826606f70500',
        hex: '6a04534c500001010453454e4420c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a46908000000003b9aca00080023826606f70500',
        type: 'nulldata'
      },
      tokenQty: null,
      tokenQtyStr: null
    },
    {
      value: 0.00000546,
      n: 1,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 a04bf4e0583728ad99279aea240953e245cbdb08 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914a04bf4e0583728ad99279aea240953e245cbdb0888ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qzsyha8qtqmj3tvey7dw5fqf203ytj7mpqqkw6cc65']
      },
      tokenQtyStr: '10',
      tokenQty: 10
    },
    {
      value: 0.00000546,
      n: 2,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 3e31055173cf58d56edb075499daf29d7b488f09 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9143e31055173cf58d56edb075499daf29d7b488f0988ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d']
      },
      tokenQtyStr: '99949989',
      tokenQty: 99949989
    },
    {
      value: 0.00002,
      n: 3,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 203b64bfbaa9e58333295b621159ddebc591ecb1 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914203b64bfbaa9e58333295b621159ddebc591ecb188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqsrke9lh257tqen99dkyy2emh4uty0vky9y0z0lsr']
      },
      tokenQty: null,
      tokenQtyStr: null
    },
    {
      value: 0.00020779,
      n: 4,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 3e31055173cf58d56edb075499daf29d7b488f09 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9143e31055173cf58d56edb075499daf29d7b488f0988ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d']
      },
      tokenQty: null,
      tokenQtyStr: null
    }
  ],
  hex: '0200000002196223922f2eef74fc8c0ab1bc2a9909e4c2f2603604e03acc7fa12363bac1e4020000006a47304402204e3ae7471c1e69b0c76c801d1efe00dfe6658767edd4f17cf9f917ce2cd3bab402201e63db7c59dd9895cb423fb71538abfb303b19728311345e095528684adec6414121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff196223922f2eef74fc8c0ab1bc2a9909e4c2f2603604e03acc7fa12363bac1e4040000006b483045022100e46d3b81a6e0727f37f049abf81aa91e85b001cd905b65177788a55a3c5827730220707b4070bfc6b244f199d4fc8ac43f880ec07d0c025433b40c5a334c527b3b174121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff050000000000000000406a04534c500001010453454e4420c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a46908000000003b9aca00080023826606f7050022020000000000001976a914a04bf4e0583728ad99279aea240953e245cbdb0888ac22020000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988acd0070000000000001976a914203b64bfbaa9e58333295b621159ddebc591ecb188ac2b510000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988ac00000000',
  blockhash: '000000000000000001bd2b7ab460ec92277bcc4d2b7c4dde330f9bf76bab4c1e',
  confirmations: 33373,
  time: 1621732642,
  blocktime: 1621732642,
  blockheight: 689003,
  isSlpTx: true,
  tokenTxType: 'SEND',
  tokenId: 'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',
  tokenType: 1,
  tokenTicker: 'TLT',
  tokenName: 'Token Liquidity Test',
  tokenDecimals: 8,
  tokenUri: 'https://FullStack.cash',
  tokenDocHash: '',
  isValidSlp: true
}

const tokenTx02 = {
  txid: '2b3404ba9bf3efd8c11f1c96d484318b436ec757d381fbd623a2314e85a072a5',
  hash: '2b3404ba9bf3efd8c11f1c96d484318b436ec757d381fbd623a2314e85a072a5',
  version: 2,
  size: 343,
  locktime: 0,
  vin: [
    {
      txid: 'd338b5d9ed4759dfe263287a226f759dcc1aed9c8cd7eef929e2eef698c5a90f',
      vout: 0,
      scriptSig: {
        asm: '304402202701510a03c85f851370b0f1fc3c0c08c98c2f811b6426da2ba1e4b31208420f022011c08cc464480989ac6d96e803d4269bbc718d4d619edb10bb5a2173dad76f24[ALL|FORKID] 027ed5f4797cb7d04bb3e26503045f65a135d2348dc2ef19954836a608932adc95',
        hex: '47304402202701510a03c85f851370b0f1fc3c0c08c98c2f811b6426da2ba1e4b31208420f022011c08cc464480989ac6d96e803d4269bbc718d4d619edb10bb5a2173dad76f244121027ed5f4797cb7d04bb3e26503045f65a135d2348dc2ef19954836a608932adc95'
      },
      sequence: 4294967295,
      address: 'bitcoincash:qq3pnj4md2xng0llvyuvdqspkrjvu0d8yy7hhh4799',
      value: 0.00078434,
      tokenQty: 0,
      tokenQtyStr: '0',
      tokenId: null
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        asm: 'OP_RETURN 5262419 1 47454e45534953 4412500 5472696e69747920436f696e 687474703a2f2f7777772e7472696e697479636f696e2e6e6574 0 9 2 06f05b59d3b20000',
        hex: '6a04534c500001010747454e45534953035454430c5472696e69747920436f696e1a687474703a2f2f7777772e7472696e697479636f696e2e6e65744c00010901020806f05b59d3b20000',
        type: 'nulldata'
      },
      tokenQtyStr: '0',
      tokenQty: 0
    },
    {
      value: 0.00000546,
      n: 1,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 d8371ed34a3aec7048dedef4523a57a813abc5b1 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914d8371ed34a3aec7048dedef4523a57a813abc5b188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qrvrw8knfgawcuzgmm00g536275p8279ky2vmfcq5z']
      },
      tokenQtyStr: '500000000',
      tokenQty: 500000000
    },
    {
      value: 0.00000546,
      n: 2,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 d8371ed34a3aec7048dedef4523a57a813abc5b1 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914d8371ed34a3aec7048dedef4523a57a813abc5b188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qrvrw8knfgawcuzgmm00g536275p8279ky2vmfcq5z']
      },
      tokenQtyStr: '0',
      tokenQty: 0,
      isMintBaton: true
    },
    {
      value: 0.00076997,
      n: 3,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 2219cabb6a8d343fff6138c68201b0e4ce3da721 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9142219cabb6a8d343fff6138c68201b0e4ce3da72188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qq3pnj4md2xng0llvyuvdqspkrjvu0d8yy7hhh4799']
      },
      tokenQtyStr: '0',
      tokenQty: 0
    }
  ],
  hex: '02000000010fa9c598f6eee229f9eed78c9ced1acc9d756f227a2863e2df5947edd9b538d3000000006a47304402202701510a03c85f851370b0f1fc3c0c08c98c2f811b6426da2ba1e4b31208420f022011c08cc464480989ac6d96e803d4269bbc718d4d619edb10bb5a2173dad76f244121027ed5f4797cb7d04bb3e26503045f65a135d2348dc2ef19954836a608932adc95ffffffff0400000000000000004b6a04534c500001010747454e45534953035454430c5472696e69747920436f696e1a687474703a2f2f7777772e7472696e697479636f696e2e6e65744c00010901020806f05b59d3b2000022020000000000001976a914d8371ed34a3aec7048dedef4523a57a813abc5b188ac22020000000000001976a914d8371ed34a3aec7048dedef4523a57a813abc5b188acc52c0100000000001976a9142219cabb6a8d343fff6138c68201b0e4ce3da72188ac00000000',
  blockhash: '00000000000000000067af496e6ed6a61aaf648c1d5e37cd1d75b2d949df8fec',
  confirmations: 33377,
  time: 1621730381,
  blocktime: 1621730381,
  blockheight: 688999,
  isSlpTx: true,
  tokenTxType: 'GENESIS',
  tokenId: '2b3404ba9bf3efd8c11f1c96d484318b436ec757d381fbd623a2314e85a072a5',
  tokenType: 1,
  tokenTicker: 'TTC',
  tokenName: 'Trinity Coin',
  tokenDecimals: 9,
  tokenUri: 'http://www.trinitycoin.net',
  tokenDocHash: '',
  isValidSlp: true
}

const nonTokenTx01 = {
  txid: '09973ed87744e81516e60718883c46892fec8c7bf825ddb5f4075fb677c631b9',
  hash: '09973ed87744e81516e60718883c46892fec8c7bf825ddb5f4075fb677c631b9',
  version: 1,
  size: 271,
  locktime: 0,
  vin: [
    {
      txid: '2df4b39981070fad8e08f88a594ecedff0d5d69036dec64ef8f392a01adb854c',
      vout: 1,
      scriptSig: {
        asm: '3044022041dfabd9a9d39f3da5b49da1d6bfd6c395553104d27a99a8d54656e2fcea7600022012a3993946cb34b75aeded8e8f9a106692e1a0bcaa17a4bca3a7b5974052f0b8[ALL|FORKID] 0467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3',
        hex: '473044022041dfabd9a9d39f3da5b49da1d6bfd6c395553104d27a99a8d54656e2fcea7600022012a3993946cb34b75aeded8e8f9a106692e1a0bcaa17a4bca3a7b5974052f0b841410467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3'
      },
      sequence: 4294967295,
      address: 'bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq',
      value: 0.00001806
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        asm: 'OP_RETURN -563533405 45f5e80036a6c3fa3cf41f2139c4dec23cae924f3bd79d0a3603888b38017a69',
        hex: '6a045dd696a12045f5e80036a6c3fa3cf41f2139c4dec23cae924f3bd79d0a3603888b38017a69',
        type: 'nulldata'
      }
    },
    {
      value: 0.00001532,
      n: 1,
      scriptPubKey: {
        asm: 'OP_DUP OP_HASH160 066ebee590278f32aedc8a4865700c49e717f1d7 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914066ebee590278f32aedc8a4865700c49e717f1d788ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqrxa0h9jqnc7v4wmj9ysetsp3y7w9l36u8gnnjulq']
      }
    }
  ],
  hex: '01000000014c85db1aa092f3f84ec6de3690d6d5f0dfce4e598af8088ead0f078199b3f42d010000008a473044022041dfabd9a9d39f3da5b49da1d6bfd6c395553104d27a99a8d54656e2fcea7600022012a3993946cb34b75aeded8e8f9a106692e1a0bcaa17a4bca3a7b5974052f0b841410467ff2df20f28bc62ad188525868f41d461f7dab3c1e500314cdb5218e5637bfd0f9c02eb5b3f383f698d28ff13547eaf05dd9216130861dd0216824e9d7337e3ffffffff020000000000000000276a045dd696a12045f5e80036a6c3fa3cf41f2139c4dec23cae924f3bd79d0a3603888b38017a69fc050000000000001976a914066ebee590278f32aedc8a4865700c49e717f1d788ac00000000',
  blockhash: '000000000000000001aa062711b1f6dea83ea725807dabf1a5ebf3f841353791',
  confirmations: 115838,
  time: 1574344540,
  blocktime: 1574344540,
  isValidSlp: false
}

const fulcrumEmtpyUtxos = {
  success: true,
  utxos: []
}

const tokenUtxos01 = [
  {
    txid: '49aef65f7387ab97ad4a106c2ec618553f1e497aa1b93db0aeb99f7026fceff9',
    vout: 1,
    type: 'token',
    tokenType: 1,
    qty: '64491846932634',
    tokenId: 'c71a2e41683c3a5d4683b705f85da09e70ddc2ce77f3abeda6106399a660a469',
    address: 'bitcoincash:qptsevau6xjfem2sx4ef3vk575ucdud7wq0pekwn3a',
    decimals: 8,
    effectiveQty: '644918.46932634',
    value: 0.00000546
  }
]

const fulcrumUtxos = {
  success: true,
  utxos: [
    {
      tx_hash:
        '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
      tx_pos: 3,
      value: '9998658',
      height: 1332421,
      confirmations: 5
    },
    {
      tx_hash:
        '4bd6d50b6a197e6789d76fd63f6e00ecb655ca3e918d1a39b5ce9637a0cdbbb2',
      tx_pos: 2,
      value: '546',
      height: 1332421,
      confirmations: 5
    }
  ]
}

const bchUtxos01 = [
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

module.exports = {
  tokenBalance01,
  tokenTx01,
  tokenTx02,
  nonTokenTx01,
  fulcrumEmtpyUtxos,
  tokenUtxos01,
  fulcrumUtxos,
  bchUtxos01
}
