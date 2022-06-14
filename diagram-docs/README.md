# Developer Documentation
The token-liquidity app is based on [this Koa boilerplate](https://github.com/christroutner/koa-api-boilerplate), and the code follows the [Clean Architecture](https://bafybeia6bmmobrl2mrracakx6uzohjwdnymzzgvw6d4voesri5ghfh2nju.ipfs.dweb.link/blog/clean-architecture) design pattern. That boilerplate is a web server for building REST APIs in node.js JavaScript. Developers who wish to modify this code base for their own token should familiarize themselves with that boilerplate first. The rest of this document will address the code specific to the token-liquidity app.

To provide context to the mechanics described above, be sure to read the [this section of the PSF business plan](https://psfoundation.cash/biz-plan/business-plan#pseudoStableToken).

## Startup
The app is started by the files in the `/bin` directory.

- `server.js` starts the REST API web server.
- `token-liquidity.js` starts the token-liquidity specific part of the app.

There are libraries in the `/src/lib` folder which contain the business logic and utilities for working with the blockchain:

- `bch.js` - library containing utilities for sending and receiving BCH.
- `slp.js` - library containing utilities for sending and receiving SLP tokens.
- `token-liquidity.js` - contains the business logic for the token liquidity app.
- `transactions.js` - library containing utilities for working with BCH transactions.
- `util.js` - a general utilities library.

The app starts by opening its wallet and retrieving its balance of BCH and SLP tokens from the blockchain. It also retrieves a list of previous transactions associated with the wallet's address. It stores these previous transactions in the `seenTxs` object.

The BCH balance determines the exchange rate of BCH to tokens, based on the curve described [in the business plan](https://psfoundation.cash/biz-plan/business-plan#pseudoStableToken). It retrieves the current USD market price for BCH and calculates the spot price of the token. This information is then available via the GET `/price` endpoint.

## Running
After startup, the app runs the `processingLoop` which loops every two minutes. It will poll the blockchain to see if it has received any BCH or SLP tokens.

The loop calls `detectNewTxs()` which returns an array of any new TXIDs associated with the apps address. This function will filter out 0-conf transactions, so will only process transactions that have at least 1 confirmation. This greatly reduces the risk of a double spend attack.

If no new transactions are found, the loop retrieves its balances from an indexer, updates its state, and then exits.

If a new transaction is found, it is added to the `seenTxs` object, and then the TX is added to a processing queue. The processing queue will try to process the transaction several times until it succeeds.

The `token-liquidity.js/processTx()` function processes the transaction. At a high level, the purpose of this function is to send tokens if it recieves BCH, or to send BCH if it recieves tokens. The exchange rate is determined by a mathematical function.

### Token Handling
The handling of tokens within the app is a little different than most SLP token-aware wallets.
This [BIP44 standard](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki) references this [SLP44 document](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) which shows the standard derivation paths that cryptocurrencies use. 145 is the official derivation path for BCH, and 245 is the official derivation path for SLP tokens.

To give context, here are several common wallets implementations that comply (or fail to do so) with these standards and derivations:

- [Badger Wallet](https://badger.bitcoin.com) uses a two-address system where it tries to keep BCH on the 145 address and tokens on the 245 address.

- The [slp-cli-wallet](https://www.npmjs.com/package/slp-cli-wallet), as well as [Electron Cash SLP](https://simpleledger.cash/project/electron-cash-slp-edition/) wallet, simply puts all BCH and tokens on the 245 path. This is simpler as the 245 derivation path is new. There are no legacy wallets using it. There is no reason for a wallet to use it unless it **is** 'token aware'. There is no danger of burning SLP tokens if everything stays on the 245 path. Putting everything on one path greatly simplifies the burdens on developers and reduces bugs.

- The [Bitcoin.com wallet](https://wallet.bitcoin.com) does not follow the standard, instead using the BTC derivation of 0 instead of the 145 derivation for Bitcoin Cash. They claim that it's easier to help people recover BTC funds sent to a BCH address, which is a common issue when trying to support both currencies.

Since the token-liquidity apps has a custom wallet that is only used by the app, we can bend the rules a little bit to make the design easier to debug.

All transactions, both BCH and tokens, should be sent to the wallets primary address on the 145 path. After processing newly received transactions, when tokens are received, the app moves the tokens to an address on its 245 path. This keeps tokens and BCH on separate addresses.

When sending tokens however, the app needs a little of BCH to send transactions. For now, the app expects a little BCH to be present on the 245 path to pay for transactions. This is a short cut. **TODO** What the app should do, is use BCH on the 145 path to pay for the transaction, while spending the SLP UTXOs on the 245 path.
