/*
  Contains unit test mocking data for testing the bch.js library.
*/

const balance = {
  page: 1,
  totalPages: 1,
  itemsOnPage: 1000,
  address: 'bchtest:qz4qnxcxwvmacgye8wlakhz0835x0w3vtvaga95c09',
  balance: '1169995970',
  totalReceived: '1219987524',
  totalSent: '49991554',
  unconfirmedBalance: '0',
  unconfirmedTxs: 0,
  txs: 7,
  txids: ['9ee0226fe0162f3361fc9c549520157297daf902d986840d19bd3f90e6ae4698']
}

const fulcrumBalance = {
  success: true,
  balance: {
    confirmed: 160000,
    unconfirmed: 0
  }
}

const utxos = [
  {
    txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
    tx_hash: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
    vout: 2,
    tx_pos: 2,
    value: 546,
    confirmations: 0,
    satoshis: 546
  },
  {
    txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
    tx_hash: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
    vout: 3,
    tx_pos: 3,
    value: 33779,
    confirmations: 0,
    satoshis: 33779
  }
]

const fulcrumUtxos = {
  success: true,
  utxos: [
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 2,
      tx_pos: 2,
      value: 546,
      confirmations: 0,
      satoshis: 546
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 3,
      tx_pos: 3,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    }
  ]
}

const txDetails = {
  txid: 'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958',
  hash: 'e2f2467b0cbbb9eae2fd409342e2657ba1ab58d3ac2d256522596adb946cd958',
  version: 2,
  size: 408,
  locktime: 0,
  vin: [
    {
      txid: 'dff9dc54b1adab239dc4c16ca8683142c85718989e2163f80cd4c9f4f8c10f4f',
      vout: 4,
      scriptSig: {
        asm:
          '3045022100e48427d28dec37251a4f928e56f926a5e16018e3b73c256d8f7552e26d38aabf022064f01eb5a3920647058b9bc537f433b69c5bf4a0964c84570b7d84b738ef1e85[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex:
          '483045022100e48427d28dec37251a4f928e56f926a5e16018e3b73c256d8f7552e26d38aabf022064f01eb5a3920647058b9bc537f433b69c5bf4a0964c84570b7d84b738ef1e854121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
      },
      sequence: 4294967295
    },
    {
      txid: 'abb659ecf11ec8c2ebe3f2351d8b4c0b9c44c308cace36286c8dc5e7357f1eba',
      vout: 0,
      scriptSig: {
        asm:
          '304502210096db676c88728e661b59cca27d80b386a6fdb73e3b407c4692d6db394fe1e96202206592712ed870f038887886030cb7ed5e8d4cabc9cf44dd53a09c6d3a39808065[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex:
          '48304502210096db676c88728e661b59cca27d80b386a6fdb73e3b407c4692d6db394fe1e96202206592712ed870f038887886030cb7ed5e8d4cabc9cf44dd53a09c6d3a398080654121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
      },
      sequence: 4294967295
    }
  ],
  vout: [
    {
      value: 0.0001,
      n: 0,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 9a0d484c20ae4e4b512ffca1ec091722c6fb3c35 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9149a0d484c20ae4e4b512ffca1ec091722c6fb3c3588ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qzdq6jzvyzhyuj639l72rmqfzu3vd7eux5nhdzndwm']
      }
    },
    {
      value: 0.00002,
      n: 1,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 203b64bfbaa9e58333295b621159ddebc591ecb1 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914203b64bfbaa9e58333295b621159ddebc591ecb188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqsrke9lh257tqen99dkyy2emh4uty0vky9y0z0lsr']
      }
    },
    {
      value: 0.00019144,
      n: 2,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 3e31055173cf58d56edb075499daf29d7b488f09 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9143e31055173cf58d56edb075499daf29d7b488f0988ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d']
      }
    }
  ],
  hex:
    '02000000024f0fc1f8f4c9d40cf863219e981857c8423168a86cc1c49d23abadb154dcf9df040000006b483045022100e48427d28dec37251a4f928e56f926a5e16018e3b73c256d8f7552e26d38aabf022064f01eb5a3920647058b9bc537f433b69c5bf4a0964c84570b7d84b738ef1e854121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffffba1e7f35e7c58d6c2836ceca08c3449c0b4c8b1d35f2e3ebc2c81ef1ec59b6ab000000006b48304502210096db676c88728e661b59cca27d80b386a6fdb73e3b407c4692d6db394fe1e96202206592712ed870f038887886030cb7ed5e8d4cabc9cf44dd53a09c6d3a398080654121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff0310270000000000001976a9149a0d484c20ae4e4b512ffca1ec091722c6fb3c3588acd0070000000000001976a914203b64bfbaa9e58333295b621159ddebc591ecb188acc84a0000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988ac00000000',
  blockhash: '000000000000000001e23bd019aff1781d2321b4406560e172e31430b2f73b53',
  confirmations: 40,
  time: 1606146411,
  blocktime: 1606146411
}

const getTxOutValid = {
  bestblock: '000000000012d5d3818d15496b177d7cf94704c40e9f5419186b00864d0b573c',
  confirmations: 3,
  value: 12.04311016,
  scriptPubKey: {
    asm:
      'OP_DUP OP_HASH160 454be45106c439c84d4f1f15a7c90eb1d78ff0e8 OP_EQUALVERIFY OP_CHECKSIG',
    hex: '76a914454be45106c439c84d4f1f15a7c90eb1d78ff0e888ac',
    reqSigs: 1,
    type: 'pubkeyhash',
    addresses: ['bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd']
  },
  coinbase: false
}

const burnOpReturnTx = {
  txid: '73e0b24ab94413c8bf003168c533653b91c9409218cf4ed601b77734856770d1',
  hash: '73e0b24ab94413c8bf003168c533653b91c9409218cf4ed601b77734856770d1',
  version: 2,
  size: 212,
  locktime: 0,
  vin: [
    {
      txid: '78fe08930a33fb5b7c7ab6dd9c7698d28c8c8773332713d987ee87cdbb817af8',
      vout: 0,
      scriptSig: {
        asm:
          '304402204c866925f05a788e2feafe2ccce4dc0509380e5c8c89f75fb7341b0d08917ed502200e16378c21231db0be7b0e0510f3fd8d1e57e40bedf82be51c8b97dfd96d6ff1[ALL|FORKID] 033467a695b2712127c2fad51a92d892b8698a58ae09a16cf37bbff0becbbc4f50',
        hex:
          '47304402204c866925f05a788e2feafe2ccce4dc0509380e5c8c89f75fb7341b0d08917ed502200e16378c21231db0be7b0e0510f3fd8d1e57e40bedf82be51c8b97dfd96d6ff14121033467a695b2712127c2fad51a92d892b8698a58ae09a16cf37bbff0becbbc4f50'
      },
      sequence: 4294967295
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        asm: 'OP_RETURN 621 4255524e203130',
        hex: '6a026d02074255524e203130',
        type: 'nulldata'
      }
    },
    {
      value: 0.000095,
      n: 1,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 caf35e1619cba2f477041f2455e68a96cb98ef82 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914caf35e1619cba2f477041f2455e68a96cb98ef8288ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bchtest:qr90xhskr8969arhqs0jg40x32tvhx80sgwk63hwq3']
      }
    }
  ],
  hex:
    '0200000001f87a81bbcd87ee87d913273373878c8cd298769cddb67a7c5bfb330a9308fe78000000006a47304402204c866925f05a788e2feafe2ccce4dc0509380e5c8c89f75fb7341b0d08917ed502200e16378c21231db0be7b0e0510f3fd8d1e57e40bedf82be51c8b97dfd96d6ff14121033467a695b2712127c2fad51a92d892b8698a58ae09a16cf37bbff0becbbc4f50ffffffff0200000000000000000c6a026d02074255524e2031301c250000000000001976a914caf35e1619cba2f477041f2455e68a96cb98ef8288ac00000000',
  blockhash: '0000000012ae7df177800a2fbf6256c1946729f7d98cbb97a322094e9cc3d995',
  confirmations: 2,
  time: 1577234056,
  blocktime: 1577234056
}

const slpOpReturnTx = {
  txid: '4894f89965809733f728e3b3f22d0015c0bf87b6a809db00a82f2841303d9de3',
  hash: '4894f89965809733f728e3b3f22d0015c0bf87b6a809db00a82f2841303d9de3',
  version: 2,
  size: 480,
  locktime: 0,
  vin: [
    {
      txid: '602de6b1c855d6cb0f01769dbc85bef40108052edb1acb2199dfaf6a24d720f7',
      vout: 3,
      scriptSig: {
        asm:
          '3045022100b9878b6ca4b370074389863ef5796676e4a9968f43aee1ce145881b54a6391d50220092be08753ac88ea91975fe7efb49fd558493e2a764e513caef7932dda62e882[ALL|FORKID] 02359e2272ab2b94b4b40250b0dd3fefc9571b542449a282d9f12a8e0675afff2b',
        hex:
          '483045022100b9878b6ca4b370074389863ef5796676e4a9968f43aee1ce145881b54a6391d50220092be08753ac88ea91975fe7efb49fd558493e2a764e513caef7932dda62e882412102359e2272ab2b94b4b40250b0dd3fefc9571b542449a282d9f12a8e0675afff2b'
      },
      sequence: 4294967295
    },
    {
      txid: '602de6b1c855d6cb0f01769dbc85bef40108052edb1acb2199dfaf6a24d720f7',
      vout: 2,
      scriptSig: {
        asm:
          '304402207a861858875f0fa7ba7d65cf39453d774cf70ce091eecbbaeb6b4051ca8defba02201cce2aa13e19c5cac824ae10f2ad2164a70e19438a447fae80e53591784316aa[ALL|FORKID] 02359e2272ab2b94b4b40250b0dd3fefc9571b542449a282d9f12a8e0675afff2b',
        hex:
          '47304402207a861858875f0fa7ba7d65cf39453d774cf70ce091eecbbaeb6b4051ca8defba02201cce2aa13e19c5cac824ae10f2ad2164a70e19438a447fae80e53591784316aa412102359e2272ab2b94b4b40250b0dd3fefc9571b542449a282d9f12a8e0675afff2b'
      },
      sequence: 4294967295
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        asm:
          'OP_RETURN 5262419 1 1145980243 155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce 000000746a528800 000001001d1bf800',
        hex:
          '6a04534c500001010453454e4420155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce08000000746a52880008000001001d1bf800',
        type: 'nulldata'
      }
    },
    {
      value: 0.00000546,
      n: 1,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 454be45106c439c84d4f1f15a7c90eb1d78ff0e8 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914454be45106c439c84d4f1f15a7c90eb1d78ff0e888ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd']
      }
    },
    {
      value: 0.00000546,
      n: 2,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 5abf10197e3d6e1fc4769d3d0eace311432498db OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9145abf10197e3d6e1fc4769d3d0eace311432498db88ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bchtest:qpdt7yqe0c7ku87yw6wn6r4vuvg5xfycmvmhlwzehx']
      }
    },
    {
      value: 0.27812838,
      n: 3,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 5abf10197e3d6e1fc4769d3d0eace311432498db OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9145abf10197e3d6e1fc4769d3d0eace311432498db88ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bchtest:qpdt7yqe0c7ku87yw6wn6r4vuvg5xfycmvmhlwzehx']
      }
    }
  ],
  hex:
    '0200000002f720d7246aafdf9921cb1adb2e050801f4be85bc9d76010fcbd655c8b1e62d60030000006b483045022100b9878b6ca4b370074389863ef5796676e4a9968f43aee1ce145881b54a6391d50220092be08753ac88ea91975fe7efb49fd558493e2a764e513caef7932dda62e882412102359e2272ab2b94b4b40250b0dd3fefc9571b542449a282d9f12a8e0675afff2bfffffffff720d7246aafdf9921cb1adb2e050801f4be85bc9d76010fcbd655c8b1e62d60020000006a47304402207a861858875f0fa7ba7d65cf39453d774cf70ce091eecbbaeb6b4051ca8defba02201cce2aa13e19c5cac824ae10f2ad2164a70e19438a447fae80e53591784316aa412102359e2272ab2b94b4b40250b0dd3fefc9571b542449a282d9f12a8e0675afff2bffffffff040000000000000000406a04534c500001010453454e4420155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce08000000746a52880008000001001d1bf80022020000000000001976a914454be45106c439c84d4f1f15a7c90eb1d78ff0e888ac22020000000000001976a9145abf10197e3d6e1fc4769d3d0eace311432498db88ace663a801000000001976a9145abf10197e3d6e1fc4769d3d0eace311432498db88ac00000000'
}

const transactions = [
  {
    height: 656382,
    tx_hash: 'ca10e610e86f9740e923265d2ef557e56b89e34bbd9888e434e50c45316b6104'
  },
  {
    height: 654722,
    tx_hash: 'e15735666de66210681e4b20649b3b85acfe4560d4e49b7ddbede478248d4ba9'
  },
  {
    height: 654583,
    tx_hash: '26bf2a1fa647dd29a69276d2879e49248205b63c391c7285f2296fe54ce2a611'
  }
]

const mockTxHistory = {
  success: true,
  transactions: [
    {
      height: 657409,
      tx_hash:
        '5bac5e115650ed012144d4c0e6bc0d22c233334266cc563035e5276775b46349'
    },
    {
      height: 657409,
      tx_hash:
        '62037e426ff402f5632a89ba248000e91c7d5c1cf1a5f326d0538ab51d9309fc'
    },
    {
      height: -1,
      tx_hash:
        'd9e728b5ffb79af33cf3d3b8cc7bb85c6bb0817f85af5db64b65d995f90d057c'
    }
  ]
}

const fulcrum11Utxos = {
  success: true,
  utxos: [
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 2,
      tx_pos: 2,
      value: 546,
      confirmations: 0,
      satoshis: 546
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 3,
      tx_pos: 3,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 4,
      tx_pos: 4,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 5,
      tx_pos: 5,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 6,
      tx_pos: 6,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 7,
      tx_pos: 7,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 8,
      tx_pos: 8,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 9,
      tx_pos: 9,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 10,
      tx_pos: 10,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 11,
      tx_pos: 11,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    },
    {
      txid: '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      tx_hash:
        '50f031874a872249ca92a883b2460fabe19367710c05948f8f58f02fa81c0bca',
      vout: 12,
      tx_pos: 12,
      value: 33779,
      confirmations: 0,
      satoshis: 33779
    }
  ]
}

const noOpReturnTx = {
  txid: '07200217e2fd235b96030e3b775678871184084bb27d5d9c15957722c29c8709',
  hash: '07200217e2fd235b96030e3b775678871184084bb27d5d9c15957722c29c8709',
  version: 2,
  size: 226,
  locktime: 0,
  vin: [
    {
      txid: '953223e46e7dbb0270592bfb82d6612a130b60b7fbc3af9d49af2970361a4f57',
      vout: 1,
      scriptSig: {
        asm:
          '30450221008834d425d3b061b4e9e394593b530806d8e2d23d9694dae09d4b13e00dce0da3022010ed02fc7328df7a6621e89b1c0b983bc902af584513abc54a490675afe9b541[ALL|FORKID] 02dd03e5a8da4e99d20b7b67088185994bf11eb51978f696994ebba824174a2724',
        hex:
          '4830450221008834d425d3b061b4e9e394593b530806d8e2d23d9694dae09d4b13e00dce0da3022010ed02fc7328df7a6621e89b1c0b983bc902af584513abc54a490675afe9b541412102dd03e5a8da4e99d20b7b67088185994bf11eb51978f696994ebba824174a2724'
      },
      sequence: 4294967295
    }
  ],
  vout: [
    {
      value: 0.0000979,
      n: 0,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 596a80bc939483f0f35c354f4ce3cbff54dcdc87 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914596a80bc939483f0f35c354f4ce3cbff54dcdc8788ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qpvk4q9ujw2g8u8nts657n8re0l4fhxusuj9jtsddt']
      }
    },
    {
      value: 0.19839368,
      n: 1,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 297422b97f3ac1fd0e02e1cf3caa906d94d34f21 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a914297422b97f3ac1fd0e02e1cf3caa906d94d34f2188ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qq5hgg4e0uavrlgwqtsu7092jpkef560yyedt26jks']
      }
    }
  ],
  hex:
    '0200000001574f1a367029af499dafc3fbb7600b132a61d682fb2b597002bb7d6ee4233295010000006b4830450221008834d425d3b061b4e9e394593b530806d8e2d23d9694dae09d4b13e00dce0da3022010ed02fc7328df7a6621e89b1c0b983bc902af584513abc54a490675afe9b541412102dd03e5a8da4e99d20b7b67088185994bf11eb51978f696994ebba824174a2724ffffffff023e260000000000001976a914596a80bc939483f0f35c354f4ce3cbff54dcdc8788ac88b92e01000000001976a914297422b97f3ac1fd0e02e1cf3caa906d94d34f2188ac00000000',
  blockhash: '000000000000000001aa062711b1f6dea83ea725807dabf1a5ebf3f841353791',
  confirmations: 53198,
  time: 1574344540,
  blocktime: 1574344540
}

const bchMockData = {
  balance,
  fulcrumBalance,
  utxos,
  fulcrumUtxos,
  txDetails,
  getTxOutValid,
  burnOpReturnTx,
  slpOpReturnTx,
  noOpReturnTx,
  transactions,
  mockTxHistory,
  fulcrum11Utxos
}

export default bchMockData
