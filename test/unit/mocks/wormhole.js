/*
  Contains mock of Wormhole SDK, which extends the BITBOX SDK mock.
*/

'use strict'

const sinon = require('sinon')
const { bitboxMock } = require('./bitbox')

// Inspect JS Objects.
const util = require('util')
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true
}

const wormholeMock = bitboxMock

const mockTransaction = {
  'txid': '3b2e9747767cf3d0070ceaffbd60ae40f1cd46f04c8dac3617659073f324f19d',
  'fee': '500',
  'sendingaddress': 'bchtest:qzjtnzcvzxx7s0na88yrg3zl28wwvfp97538sgrrmr',
  'ismine': false,
  'version': 0,
  'type_int': 50,
  'type': 'Create Property - Fixed',
  'propertyid': 353,
  'precision': '8',
  'ecosystem': 'main',
  'category': 'Companies',
  'subcategory': 'End-to-End Testing',
  'propertyname': 'TST',
  'data': 'Fixed Token E2E Test',
  'url': 'developer.bitcoin.com',
  'amount': '4567.00000000',
  'valid': true,
  'blockhash': '000000000048160818ccadc15a4f428b83bd3cf7223fedc8f56f7c7e4b55f58c',
  'blocktime': 1539281904,
  'positioninblock': 7,
  'block': 1262077,
  'confirmations': 11126
}

wormholeMock.DataRetrieval = {
  balancesForAddress: sinon.stub().returns([
    {
      propertyid: 1,
      balance: '7.00473524',
      reserved: '0.00000000'
    },
    {
      propertyid: 556,
      balance: '100000.00000000',
      reserved: '0.00000000'
    }
  ]),
  transaction: sinon.stub().returns(mockTransaction)
}

module.exports = {
  wormholeMock
}
