/*
  Mocks for unit tests in the token-liquidity unit tests.
*/

'use strict'

const knownTxids = [
  '5c945acebc3f8476e7f1dd17f8066be00f21f83c1591641aac1357bddfa5ceab',
  'cf7bf96acaf325cea9bf3016e299726183ee68f85b581f341dd0d574e21f1450',
  '588b47b79ab5c1caefd3d945aa9ca19dabb230fe7f32e3ad501a7893f9545474',
  '1aabeaae25b511214a40529f75641b50b809ce8f6a546652b9f80eb125445768',
  '2b34ace7bf61f93f1f68c92da40a121871c9cfe7c7539b1a54d51101afaf24f8'
]

const mockGetTxs = [
  {
    height: 662964,
    tx_hash: '5c945acebc3f8476e7f1dd17f8066be00f21f83c1591641aac1357bddfa5ceab'
  },
  {
    height: 662964,
    tx_hash: 'cf7bf96acaf325cea9bf3016e299726183ee68f85b581f341dd0d574e21f1450'
  },
  {
    height: 662963,
    tx_hash: '588b47b79ab5c1caefd3d945aa9ca19dabb230fe7f32e3ad501a7893f9545474'
  },
  {
    height: 662941,
    tx_hash: '1aabeaae25b511214a40529f75641b50b809ce8f6a546652b9f80eb125445768'
  },
  {
    height: 662941,
    tx_hash: '2b34ace7bf61f93f1f68c92da40a121871c9cfe7c7539b1a54d51101afaf24f8'
  }
]

const addrInfo = {
  page: 1,
  totalPages: 1,
  itemsOnPage: 1000,
  address: 'bchtest:qz4qnxcxwvmacgye8wlakhz0835x0w3vtvaga95c09',
  balance: 11.7000397,
  totalReceived: '1219995524',
  totalSent: '49991554',
  unconfirmedBalance: '0',
  unconfirmedTxs: 0,
  txs: 15,
  txids: [
    'd3100cd1f1280933d23b02d62348365e32250c5ecab2e17f11506b8ac1c70035',
    '58d68ffc5a80c5215c43113ea68ea09f30b8b98e72624e8cb93ff12d027f010d',
    '40740f21cc212febf84a1d85efb4209b2c3d34d05dffd51cdebba9db27b7ae6f',
    '9246bd824f4a45543cd6337321f868c19cf1973b47e6f1781734437482015006',
    '011172dd0a4e697949fdf416dec1e0f39ea92c29afb79a93530d345913473adc',
    '4755c10e4deb555591a391078adc5e4297ad832d7ad728f34b67645a4b68be97',
    'c7cbd6eff06055ead88f6b3ecf567f05ca0265061691acbac8be925af0ffa3d0',
    '4bed957c6e734b26974d13dbad1adc2258b307789b135dfb4bd9031f10388525',
    '9ee0226fe0162f3361fc9c549520157297daf902d986840d19bd3f90e6ae4698',
    '02ed1b8882eb356f864a21eb59b7f222f13c36efc230329050f569b5580bf6ce',
    '62fff39843860bb3aa1e37ae22a7a99abab16d34c7a0b64bfdc23493ea97f24d',
    '57b3082a2bf269b3d6f40fee7fb9c664e8256a88ca5ee2697c05b9457822d446',
    '61e71554a3dc18158f30d9e8f5c9b6641a789690b32302899f81cbea9fe3bb49',
    '7ac7f4bb50b019fe0f5c81e3fc13fc0720e130282ea460768cafb49785eb2796',
    '9842dc058541d1fd9fa6fa3525a787f03e44d3642263c0a8e4f7a4533502e397'
  ]
}

const confs = [
  {
    txid: '9842dc058541d1fd9fa6fa3525a787f03e44d3642263c0a8e4f7a4533502e397',
    confirmations: 45937
  }
]

const processTx = {
  txid: '14df82e3ec54fa0227531309f7189ed695bafad6f5062407d3a528fbeddc4a09',
  bchBalance: 12,
  tokenBalance: 100
}

const exchangeRatesResponse = {
  body: JSON.stringify({
    data: {
      rates: {
        USD: '278.74'
      }
    }
  })
}

export {
  knownTxids,
  addrInfo,
  confs,
  processTx,
  mockGetTxs,
  exchangeRatesResponse
}
