/*
  Constains mock data for unit tests of the transactions.js library.
*/

'use strict'

const mockTransactions = {
  txid: 'af30cc46356378cb5f139fb9da301d3b06a50416eb5030e3d397d6c3c027a26d',
  version: 2,
  vin: [
    {
      txid: '2829d3de54358bd0b9c6c84762c2614c3e9c3cb8955465f6eee2c0adf4fe5d2c',
      sequence: 4294967295,
      n: 0,
      addresses: ['bchtest:qpyrwjq5c8euxyuwyqqdt40qf00dkfw02q6aqhm2wt'],
      value: '459621029',
      hex:
        '483045022100c7ece8aad3e663f1fe17ed59749729bcd30caf0b9ef6e9f4a286be637f256d970220090ba000bf01ccb26eaa8a6397a5c19a507184aae50f4a0ebcb7c9847cf9f0154121020d01a18f138e0461e14fa3bac7913be2ad9e26b9a9fc4cfded431344ca2a0dcb'
    }
  ],
  vout: [
    {
      value: '459601773',
      n: 0,
      spent: true,
      hex: '76a91448374814c1f3c3138e2000d5d5e04bdedb25cf5088ac',
      addresses: ['bchtest:qpyrwjq5c8euxyuwyqqdt40qf00dkfw02q6aqhm2wt']
    },
    {
      value: '10000',
      n: 1,
      hex: '76a91428e1f3653ca13dc8d2b8a1fe81046ba730e4666f88ac',
      addresses: ['bchtest:qq5wrum98jsnmjxjhzslaqgydwnnperxduufpzceyh']
    }
  ],
  blockHash: '00000000810872d327576bcd09ad36a4be113155cf20ab2d3d05481b83b519c7',
  blockHeight: 1332233,
  confirmations: 41,
  blockTime: 1570211403,
  value: '459611773',
  valueIn: '459621029',
  fees: '9256',
  hex:
    '02000000012c5dfef4adc0e2eef6655495b83c9c3e4c61c26247c8c6b9d08b3554ded32928000000006b483045022100c7ece8aad3e663f1fe17ed59749729bcd30caf0b9ef6e9f4a286be637f256d970220090ba000bf01ccb26eaa8a6397a5c19a507184aae50f4a0ebcb7c9847cf9f0154121020d01a18f138e0461e14fa3bac7913be2ad9e26b9a9fc4cfded431344ca2a0dcbffffffff026df7641b000000001976a91448374814c1f3c3138e2000d5d5e04bdedb25cf5088ac10270000000000001976a91428e1f3653ca13dc8d2b8a1fe81046ba730e4666f88ac00000000'
}

const mockPreTx = {
  txid: '588b47b79ab5c1caefd3d945aa9ca19dabb230fe7f32e3ad501a7893f9545474',
  hash: '588b47b79ab5c1caefd3d945aa9ca19dabb230fe7f32e3ad501a7893f9545474',
  version: 2,
  size: 514,
  locktime: 0,
  vin: [
    {
      txid: '90d560857bc0a71477149cbaeb2b7ce3902901ac0b37827872be557ed86a578f',
      vout: 2,
      scriptSig: {
        asm:
          '304402206212c80cc03063360f51c19c066c307b136f2755ba802aeb346aaa23da58d89102207b5e2d12b9e1419bd408105ee42cc77ae58230f71ecffa409fe0b37d74b2abdf[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex:
          '47304402206212c80cc03063360f51c19c066c307b136f2755ba802aeb346aaa23da58d89102207b5e2d12b9e1419bd408105ee42cc77ae58230f71ecffa409fe0b37d74b2abdf4121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
      },
      sequence: 4294967295
    },
    {
      txid: '90d560857bc0a71477149cbaeb2b7ce3902901ac0b37827872be557ed86a578f',
      vout: 4,
      scriptSig: {
        asm:
          '3045022100bcc269f0d6c1451258f0826d73e3f828d97bfc17fe05c73fa1dcb120c99caa0e022016bbe9a9dad2235c270fa180399ec980fb37e59417875122ce9a567f9fe922dc[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex:
          '483045022100bcc269f0d6c1451258f0826d73e3f828d97bfc17fe05c73fa1dcb120c99caa0e022016bbe9a9dad2235c270fa180399ec980fb37e59417875122ce9a567f9fe922dc4121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
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
          'OP_RETURN 5262419 1 1145980243 d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa0 000000003b9aca00 0000001510bc6561',
        hex:
          '6a04534c500001010453454e4420d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa008000000003b9aca00080000001510bc6561',
        type: 'nulldata'
      }
    },
    {
      value: 0.00000546,
      n: 1,
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
      value: 0.00000546,
      n: 2,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 3e31055173cf58d56edb075499daf29d7b488f09 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9143e31055173cf58d56edb075499daf29d7b488f0988ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d']
      }
    },
    {
      value: 0.00002,
      n: 3,
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
      value: 0.00004085,
      n: 4,
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
    '02000000028f576ad87e55be727882370bac012990e37c2bebba9c147714a7c07b8560d590020000006a47304402206212c80cc03063360f51c19c066c307b136f2755ba802aeb346aaa23da58d89102207b5e2d12b9e1419bd408105ee42cc77ae58230f71ecffa409fe0b37d74b2abdf4121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff8f576ad87e55be727882370bac012990e37c2bebba9c147714a7c07b8560d590040000006b483045022100bcc269f0d6c1451258f0826d73e3f828d97bfc17fe05c73fa1dcb120c99caa0e022016bbe9a9dad2235c270fa180399ec980fb37e59417875122ce9a567f9fe922dc4121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff050000000000000000406a04534c500001010453454e4420d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa008000000003b9aca00080000001510bc656122020000000000001976a9149a0d484c20ae4e4b512ffca1ec091722c6fb3c3588ac22020000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988acd0070000000000001976a914203b64bfbaa9e58333295b621159ddebc591ecb188acf50f0000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988ac00000000',
  blockhash: '000000000000000002a761a8899a391ece2bdbf96541e965a5ca512295d3ab95',
  confirmations: 111,
  time: 1606178716,
  blocktime: 1606178716
}

const mockTxSender = {
  txid: '51c0f12f2e7f40daa97c2441e904cd9f218fbe6a96c625c56368596fff1abe7d',
  hash: '51c0f12f2e7f40daa97c2441e904cd9f218fbe6a96c625c56368596fff1abe7d',
  version: 2,
  size: 513,
  locktime: 0,
  vin: [
    {
      txid: '588b47b79ab5c1caefd3d945aa9ca19dabb230fe7f32e3ad501a7893f9545474',
      vout: 2,
      scriptSig: {
        asm:
          '3044022041af3fb7137a387d07ad3894f13a6bfc587aa27e44a5c288fdbe3de4a8c1d941022009bfa52c2605c6b1458a4270bb605b621268c7faae07dd906fb9ccfa67b08a28[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex:
          '473044022041af3fb7137a387d07ad3894f13a6bfc587aa27e44a5c288fdbe3de4a8c1d941022009bfa52c2605c6b1458a4270bb605b621268c7faae07dd906fb9ccfa67b08a284121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
      },
      sequence: 4294967295
    },
    {
      txid: 'ed00ba1c13dd55d007285b6cd296cf6fc90b86066be4c132c2da55efa7c90561',
      vout: 0,
      scriptSig: {
        asm:
          '304402202910f1645d558c1040bd1a4edecf132dc5c93bc6d1c59bde055a7a16d1202baa02204f5f6049807f7ed2e1270dba4166e18f120b8434ae7b523729426635e63c741f[ALL|FORKID] 033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef',
        hex:
          '47304402202910f1645d558c1040bd1a4edecf132dc5c93bc6d1c59bde055a7a16d1202baa02204f5f6049807f7ed2e1270dba4166e18f120b8434ae7b523729426635e63c741f4121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764ef'
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
          'OP_RETURN 5262419 1 1145980243 d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa0 000000003b9aca00 00000014d5219b61',
        hex:
          '6a04534c500001010453454e4420d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa008000000003b9aca000800000014d5219b61',
        type: 'nulldata'
      }
    },
    {
      value: 0.00000546,
      n: 1,
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
      value: 0.00000546,
      n: 2,
      scriptPubKey: {
        asm:
          'OP_DUP OP_HASH160 3e31055173cf58d56edb075499daf29d7b488f09 OP_EQUALVERIFY OP_CHECKSIG',
        hex: '76a9143e31055173cf58d56edb075499daf29d7b488f0988ac',
        reqSigs: 1,
        type: 'pubkeyhash',
        addresses: ['bitcoincash:qqlrzp23w08434twmvr4fxw672whkjy0py26r63g3d']
      }
    },
    {
      value: 0.00002,
      n: 3,
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
      value: 0.00016913,
      n: 4,
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
    '0200000002745454f993781a50ade3327ffe30b2ab9da19caa45d9d3efcac1b59ab7478b58020000006a473044022041af3fb7137a387d07ad3894f13a6bfc587aa27e44a5c288fdbe3de4a8c1d941022009bfa52c2605c6b1458a4270bb605b621268c7faae07dd906fb9ccfa67b08a284121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff6105c9a7ef55dac232c1e46b06860bc96fcf96d26c5b2807d055dd131cba00ed000000006a47304402202910f1645d558c1040bd1a4edecf132dc5c93bc6d1c59bde055a7a16d1202baa02204f5f6049807f7ed2e1270dba4166e18f120b8434ae7b523729426635e63c741f4121033a24d13b45eaf53bebc7da5b7ee79a39615790b4fb16dab048fdcc5abd3764efffffffff050000000000000000406a04534c500001010453454e4420d0ef4de95b78222bfee2326ab11382f4439aa0855936e2fe6ac129a8d778baa008000000003b9aca000800000014d5219b6122020000000000001976a9149a0d484c20ae4e4b512ffca1ec091722c6fb3c3588ac22020000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988acd0070000000000001976a914203b64bfbaa9e58333295b621159ddebc591ecb188ac11420000000000001976a9143e31055173cf58d56edb075499daf29d7b488f0988ac00000000',
  blockhash: '0000000000000000029be195dff22cfaca16ac3f4c351e85b4e5656b61bb7b59',
  confirmations: 67,
  time: 1606196080,
  blocktime: 1606196080
}

export const txMockData = {
  mockTransactions,
  mockPreTx,
  mockTxSender
}

export default txMockData
