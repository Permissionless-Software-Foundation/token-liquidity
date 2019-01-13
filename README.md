# token-liquidity
This is an application for providing token liquidity, inspired by the pricing algorithm in the [Bancor Whitepaper](docs/bancor-protocol-whitepaper.pdf). While Bancor uses ERC20 tokens, this application focuses on the Wormhole protocol for creating tokens on the BCH network.

The idea is simple. This program has its own BCH public address. If you send BCH to the address, the program will send you tokens. If you send tokens to that address, the program will send you BCH. The exchange rate is determined by the price formula.

The price formula used in this program was inspired by the Bancor whitepaper, but those equations were ultimately thrown out and similar equations created. Experiments are preserved here in [the spreadsheet](docs/bancor-cals.xlsx), and a whitepaper will be created to explain the new equations in detail. Skip to the log-price-test sheet to see the final curve and breakdown that I settled on.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

[![Build Status](https://travis-ci.org/Permissionless-Software-Foundation/token-liquidity.svg?branch=master)](https://travis-ci.org/Permissionless-Software-Foundation/token-liquidity)

[![Coverage Status](https://coveralls.io/repos/github/Permissionless-Software-Foundation/token-liquidity/badge.svg?branch=unstable)](https://coveralls.io/github/Permissionless-Software-Foundation/token-liquidity?branch=unstable)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

[![Greenkeeper badge](https://badges.greenkeeper.io/christroutner/babel-free-koa2-api-boilerplate.svg)](https://greenkeeper.io/)

## License
MIT
