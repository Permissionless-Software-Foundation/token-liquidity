# Testnet Example
This document captures an example output of a real-life testnet transaction with this app. It's saved here because the data might be helpful in future testing.

```
Starting development environment
Using network: testnet
Server started on 5100
info: Server started on 5100
info: BCH address bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd has a balance of 12.01841136 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11999.16572854,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
info: SLP token address slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n has a balance of: 11999.16572854
info: USD/BCH exchange rate: $206.58
Market cap of BCH controlled by app: $2482.7634187488
debug: bch1: 12.01841136, bch2: 13.01840866, token1: 3662.1803544261857, token2: 3262.5570914591976, tokensOut: -399.623262966988
debug: -399.623262966988 tokens sent in exchange for -1 BCH
Token spot price: $0.51693687


debug: Blockchain balance: 12.01841136 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11999.16572854,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
12/14/2019, 2:11:56 PM: Checking transactions... ...nothing new. BCH: 12.01841136, SLP: 11999.16572854

12/14/2019, 2:19:56 PM: Checking transactions... ...1 new transactions found!
{ txid:
   'b518a8a221b3fff741c4d10d9c8f773cb76d39e60f5a60546c44c24ac3dfc3e8',
  bchBalance: 12.01841136,
  tokenBalance: 11999.16572854 }
Trying Process Tx
info: Processing new TXID b518a8a221b3fff741c4d10d9c8f773cb76d39e60f5a60546c44c24ac3dfc3e8.
debug: Entering getUserAddr(). txid: b518a8a221b3fff741c4d10d9c8f773cb76d39e60f5a60546c44c24ac3dfc3e8
info: userAddr: 'bchtest:qzl0aaxmdudcnsaemdqdw4t4a5ynd2d24ugwmmrxs9'
debug: isTokenTx: false
debug: address:
info: 0.01 BCH recieved.
debug: bch1: 12.01841136, bch2: 12.00840866, token1: 3662.1803544261857, token2: 3666.343494021669, tokensOut: 4.163139595483244
debug: 4.163139595483244 tokens sent in exchange for 0.01 BCH
info: Ready to send 4.16313959 tokens in exchange for 0.01 BCH
debug: retObj: { tokensOut: 4.16313959,
  bch2: 12.00840866,
  token2: 3666.343494021669 }
info: New BCH balance: 12.02841136
info: New token balance: 11995.00258895
retObj.tokensOut 4.16313959
info: Transaction ID: 5beb1e82dc99211dfe6b770c1aa9f7c4981bfb988da05c5000c33bfe79e2999a
result: {
  "txid": "b518a8a221b3fff741c4d10d9c8f773cb76d39e60f5a60546c44c24ac3dfc3e8",
  "bchBalance": 12.02841136,
  "tokenBalance": 11995.00258895
}
BCH: 12.02841136, SLP: 11995.00258895

debug: Blockchain balance: 12.03841136 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11995.00258895,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
12/14/2019, 2:21:56 PM: Checking transactions... ...nothing new. BCH: 12.03841136, SLP: 11995.00258895

...

debug: Blockchain balance: 12.03841136 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11995.00258895,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
12/14/2019, 3:03:56 PM: Checking transactions... ...nothing new. BCH: 12.03841136, SLP: 11995.00258895

12/14/2019, 3:05:56 PM: Checking transactions... ...1 new transactions found!
{ txid:
   '4411b4e365df0a98f7bab702c85d33b717a814a2a590f60bd32769cb8e764f41',
  bchBalance: 12.03841136,
  tokenBalance: 11995.00258895 }
Trying Process Tx
info: Processing new TXID 4411b4e365df0a98f7bab702c85d33b717a814a2a590f60bd32769cb8e764f41.
debug: Entering getUserAddr(). txid: 4411b4e365df0a98f7bab702c85d33b717a814a2a590f60bd32769cb8e764f41
info: userAddr: 'bchtest:qrn2uafa9drxqa7wvp2vjnp3hta027h5rs8798jpvz'
debug: isTokenTx: 1
info: 1 tokens recieved.
debug: bch1: 6.171088910799543, bch2: 6.1698548164309335, token1: 6995.002588949999, token2: 6996.002588949999, bchOut: -0.0012367943686091066
info: Ready to send 0.0012368 BCH in exchange for 1 tokens
info: New BCH balance: 12.03717456
info: New token balance: 11996.00258895
debug: obj.satoshisToSend: 123679
debug: addrDetails: {
  "page": 1,
  "totalPages": 1,
  "itemsOnPage": 1000,
  "address": "bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd",
  "balance": 12.03841682,
  "totalReceived": "4806799685",
  "totalSent": "3602958003",
  "unconfirmedBalance": "0",
  "unconfirmedTxs": 0,
  "txs": 23,
  "txids": [
    "4411b4e365df0a98f7bab702c85d33b717a814a2a590f60bd32769cb8e764f41",
    "b518a8a221b3fff741c4d10d9c8f773cb76d39e60f5a60546c44c24ac3dfc3e8",
    "2c97b089722e169aeeb145d2219f4beb0508f7530816279a08dc3fc5d6b2170e",
    "e0cc75f047c3b27ffe93c407a4c5e799bc098be84748bbacf623c6160f6a0d9b",
    "ed8ecb0a6436a34d38bff1d203f80c6901cb6398232db1a25e72f6a4001878a5",
    "73767128499dc5a721bf464083a257543f03929514177c193202ba791aebbb80",
    "fe11160e7528ddd1f522aa055f0b35322718c7c9b9276e9dd29ec1eedb04b3b0",
    "ef0d6b1f3370dc09be575ef6b54f05acfa151ca6b5488a9c05d903cc0996663a",
    "8bb1a5a760a82f9327cabac78cbfe7f5eae69019a784989929e347913c4bd5c7",
    "1e529646cc691c6737f25e9fccd1aa515d7ae3c03cb5f8622a38ccf1b69b35c7",
    "992a6b328b29192eb19d1dde35946d9d8fd37d8800251ae09923086a63f77c33",
    "b50abcbe3d6fcca59f1c8271f1604f0e6fa9bb8dacebfef7a9a5b3cf557e65ba",
    "2349ea0fbb0ada3b1ecc10e5edbe835e22f019b9f7da710921721d6b9daae9da",
    "21ebb8d40b6975b335be4b192eb9898b218824e40453b26c8444f1c53a9566eb",
    "b6acd30e921dd03990de999fdb7b8bafc5bd93fd968fe30addaaf67110d39b8f",
    "ece4eb2c33bb05c49fbdf4597e6cfcde67ee515e85579d7e81179e3651a6a082",
    "4b99d45c9c2ac81dd69230d53d5528355f54d606b6ed91136953b00a63739553",
    "0f1460582d256b374d1b11231b7a5ef1a30d2e45061163362c81b92b140affcd",
    "c68a75d98f8771245569c10b07301af44b45ea1fcbb0a5b7a5d79f7aa71585db",
    "5a8ca79c7af9e454444f68756a4768d791b2c76eedab428893131264ab3231c7",
    "00c5240db4b2d7a76394fe19113ddd22d95239396536e81005f1b3efcc303dab",
    "46eac6a2e0e6a6afaf9998f8d900646b7df7fbff27307a135008daa3075b8f6e",
    "1ede0246dbdaabf4f57418a0fc29c74d4324b2cdbd886d3a144b767f2d9dc803"
  ]
}
verbose: Balance of sending address bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd is 12.03841682 BCH.
debug: Sender Legacy Address: mmqMqMDGSeMLfmmCLnZLrDXn5UgKdzVLsQ
debug: Receiver Legacy Address: n2Yghj7ZNjEzWZ9fpjWjoG1ftcdNH2H7L9
verbose: byteCount: 226
verbose: txFee: 226
verbose: remainder: 1200614501
verbose: Transaction ID: bd24e316d343ae1bcbdf07455e92582c9f031a2528a8e333a77f44383a8d5f92
info: BCH sent to user: bd24e316d343ae1bcbdf07455e92582c9f031a2528a8e333a77f44383a8d5f92
info: Transaction ID: b8c86761d44bcad6f477a648c20789941a2c2b482a9b8ef4bcba2b2b7219e53e
info: Newly recieved tokens sent to 245 derivation path: b8c86761d44bcad6f477a648c20789941a2c2b482a9b8ef4bcba2b2b7219e53e
result: {
  "txid": "4411b4e365df0a98f7bab702c85d33b717a814a2a590f60bd32769cb8e764f41",
  "bchBalance": 12.03717456,
  "tokenBalance": 11996.00258895
}
BCH: 12.03717456, SLP: 11996.00258895

debug: Blockchain balance: 12.03841682 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11995.00258895,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
12/14/2019, 3:07:56 PM: Checking transactions... ...nothing new. BCH: 12.03841682, SLP: 11995.00258895

...

debug: Blockchain balance: 12.03841682 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11995.00258895,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
12/14/2019, 3:19:56 PM: Checking transactions... ...nothing new. BCH: 12.03841682, SLP: 11995.00258895

12/14/2019, 3:21:56 PM: Checking transactions... ...1 new transactions found!
{ txid:
   'bd24e316d343ae1bcbdf07455e92582c9f031a2528a8e333a77f44383a8d5f92',
  bchBalance: 12.03841682,
  tokenBalance: 11995.00258895 }
Trying Process Tx
info: Processing new TXID bd24e316d343ae1bcbdf07455e92582c9f031a2528a8e333a77f44383a8d5f92.
debug: Entering getUserAddr(). txid: bd24e316d343ae1bcbdf07455e92582c9f031a2528a8e333a77f44383a8d5f92
info: userAddr: 'bchtest:qpz5hez3qmzrnjzdfu03tf7fp6ca0rlsaqvrxmfpyd'
info: userAddr === app address. Exiting compareLastTransaction()
result: {
  "txid": "bd24e316d343ae1bcbdf07455e92582c9f031a2528a8e333a77f44383a8d5f92",
  "bchBalance": 12.03841682,
  "tokenBalance": 11995.00258895
}
BCH: 12.03841682, SLP: 11995.00258895

debug: Blockchain balance: 12.03717777 BCH
debug: token balance:  {"0":{"tokenId":"155784a206873c98acc09e8dabcccf6abf13c4c14d8662190534138a16bb93ce","balance":11995.00258895,"slpAddress":"slptest:qpt74e74f75w6s7cd8r9p5fumvdhqf995g69udvd5n","decimalCount":8}}
12/14/2019, 3:23:56 PM: Checking transactions... ...nothing new. BCH: 12.03717777, SLP: 11995.00258895
```
