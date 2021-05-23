# token-liquidity

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is an application for providing token liquidity, inspired by the pricing algorithm in the [Bancor Whitepaper](docs/bancor-formulas/bancor-protocol-whitepaper.pdf). While Bancor uses ERC20 tokens, this application focuses on the [Simple Leger Protocol](https://simpleledger.cash/) for creating tokens on the Bitcoin Cash (BCH) network.

The idea is simple: This program has its own BCH public address. If you send BCH to the address, the program will send you tokens. If you send tokens to that address, the program will send you BCH. The app functions as an automated market-maker, providing perfect liquidity for the token. The exchange rate is determined by the price formula.

The price formula used in this program was inspired by the Bancor whitepaper, but those equations were ultimately thrown out and similar equations created. Experiments are preserved here in [the spreadsheet](docs/bancor-formulas/bancor-cals.xlsx), and the graphs and values used for the PSF token can be viewed in the [PSF Business Plan](https://psfoundation.cash/biz-plan/business-plan#pseudoStableToken).

- [Developer Documentation](./docs)

## Installation

```bash
git clone https://github.com/Permissionless-Software-Foundation/token-liquidity
cd token-liquidity
npm install
cp env .env
npm test
```

## Setup

- Customize the `env` file and rename it to `.env`. This file will set the environment variables needed to customize the app to your own wallet and token.
- Create a wallet-main.json file. You can generate one with [this example script](https://github.com/Permissionless-Software-Foundation/bch-js-examples/blob/master/applications/slp/create-wallet/create-wallet.js). It should look like this:

```json
{
  "mnemonic": "staff gentle brain electric blouse rigid boring manage hunt skull pride shy",
  "cashAddress": "bitcoincash:qraaz6nft8nged5kwxh6rd0d9d3n7ngezgvckq3pt8",
  "WIF": "KwKZ99vEszXDRsTdfRds81fCrrVvekjvNhtYFjpAhpsMZRBtnYG2",
  "slpAddress": "simpleledger:qraaz6nft8nged5kwxh6rd0d9d3n7ngezgqramyp4e",
  "legacyAddress": "1PxVUc79ZQTCoanNRWKRwU8koFwHfHHAKn"
}
```

## License

[MIT](./LICENSE.md)
