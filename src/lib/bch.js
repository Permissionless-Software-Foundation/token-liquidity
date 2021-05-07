/*
  Library for working with BCH.
*/

"use strict";

const TLUtils = require("./util");
const tlUtils = new TLUtils();

// Winston logger
const wlogger = require("./wlogger");

// Mainnet by default
// const bchjs = new this.config.BCHLIB({ restURL: this.config.MAINNET_REST })

// const SATS_PER_BCH = 100000000

// let _this

class BCH {
  constructor(config) {
    this.config = config;

    // Determine if this is a testnet wallet or a mainnet wallet.
    if (this.config.NETWORK === "testnet") {
      this.bchjs = new this.config.BCHLIB({
        restURL: this.config.TESTNET_REST
      });
    } else {
      this.bchjs = new this.config.BCHLIB({
        restURL: this.config.MAINNET_REST
      });
    }

    this.tlUtils = tlUtils;

    // _this = this
  }

  // Get the balance in BCH of a BCH address.
  // Returns an object containing balance information.
  // The verbose flag determins if the results are written to the console or not.
  async getBCHBalance(addr, verbose = false) {
    try {
      const fulcrumBalance = await this.bchjs.Electrumx.balance(addr);
      // console.log(`fulcrumBalance: ${JSON.stringify(fulcrumBalance, null, 2)}`)

      const confirmedBalance = this.bchjs.BitcoinCash.toBitcoinCash(
        fulcrumBalance.balance.confirmed
      );

      if (verbose) {
        // const resultToDisplay = confirmedBalance
        // resultToDisplay.txids = []
        console.log(fulcrumBalance);
      }

      const bchBalance = confirmedBalance;

      return bchBalance;
    } catch (err) {
      wlogger.error(`Error in bch.js/getBCHBalance(): ${err.message}`, err);
      throw err;
    }
  }

  // Returns the utxo with the biggest balance from an array of utxos.
  async findBiggestUtxo(utxos) {
    try {
      wlogger.silly("Entering findBiggestUtxo().");

      if (!Array.isArray(utxos)) throw new Error("utxos needs to be an array");

      let largestAmount = 0;
      let largestIndex = 0;

      for (let i = 0; i < utxos.length; i++) {
        const thisUtxo = utxos[i];

        // Ensure the value property is a number and not a string.
        thisUtxo.value = Number(thisUtxo.value);

        if (thisUtxo.value > largestAmount) {
          // Verify the UTXO is valid. Skip if not.
          const isValid = await this.bchjs.Blockchain.getTxOut(
            thisUtxo.tx_hash,
            thisUtxo.tx_pos
          );
          // console.log(`isValid: ${JSON.stringify(isValid, null, 2)}`)

          if (isValid === null) {
            wlogger.info(
              `Invalid (stale) UTXO found: ${JSON.stringify(thisUtxo, null, 2)}`
            );
            continue;
          }

          largestAmount = thisUtxo.value;
          largestIndex = i;
        }
      }

      return utxos[largestIndex];
    } catch (err) {
      wlogger.error("Error in bch.js/findBiggestUtxo().");
      throw err;
    }
  }

  // Calculates the amount of BCH that was sent to this app from a TX.
  // Returns a floating point number of BCH recieved. 0 if no match found.
  async recievedBch(txid, addr) {
    try {
      wlogger.silly("Entering receivedBch().");
      // console.log(`addr: ${addr}`)
      // console.log(`this.bchjs.restURL: ${this.bchjs.restURL}`)

      // const txDetails = await this.bchjs.Transaction.details(txid)
      // const txDetails = await this.bchjs.Blockbook.tx(txid)
      const txDetails = await this.bchjs.RawTransactions.getRawTransaction(
        txid,
        true
      );
      // console.log(`txDetails: ${JSON.stringify(txDetails, null, 2)}`)

      const vout = txDetails.vout;
      // console.log(`vout: ${JSON.stringify(vout, null, 2)}`)

      // Loop through each vout in the TX.
      for (let i = 0; i < vout.length; i++) {
        const thisVout = vout[i];
        // console.log(`thisVout: ${JSON.stringify(thisVout, null, 2)}`);
        const value = Number(thisVout.value);
        // console.log(`value: ${value}`)

        // Skip if value is zero.
        if (thisVout.value === 0.0) continue;

        // Skip if address array is empty.
        if (thisVout.scriptPubKey.addresses.length === 0) continue;

        // Skip if vout has no addresses field.
        if (thisVout.scriptPubKey.addresses) {
          const addresses = thisVout.scriptPubKey.addresses;
          // console.log(`addresses: ${JSON.stringify(addresses, null, 2)}`)

          // Note: Assuming addresses[] only has 1 element.
          // Not sure how there can be multiple addresses if the value is not an array.
          let address = addresses[0]; // Legacy address
          // wlogger.debug('address: ', address)
          address = this.bchjs.Address.toCashAddress(address);

          // if (address === addr) return this.tlUtils.round8(value / SATS_PER_BCH)
          if (address === addr) return value;
        }
      }

      // Address not found. Return zero.
      return 0;
    } catch (err) {
      wlogger.error("Error in recievedBch: ", err);
      throw err;
    }
  }

  // Generates a hex-encoded transaction for sending BCH. Returns the hex that
  // is ready to broadcast to the BCH network.
  async createBchTx(obj) {
    try {
      wlogger.silly("Starting sendBch()...");

      const RECV_ADDR = obj.recvAddr;
      const satoshisToSend = obj.satoshisToSend;

      const walletInfo = this.tlUtils.openWallet();

      const addrDetails = await this.getBCHBalance(this.config.BCH_ADDR, false);
      // wlogger.debug(`addrDetails: ${JSON.stringify(addrDetails, null, 2)}`)

      const balance = addrDetails;
      wlogger.verbose(
        `Balance of sending address ${this.config.BCH_ADDR} is ${balance} BCH.`
      );

      if (balance <= 0.0) {
        console.log("Balance of sending address is zero. Exiting.");

        // If this is a test, return 0.
        if (process.env.TL_ENV === "test") return 0;

        // Kill the app if the balance is zero.
        process.exit(0);
      }

      const SEND_ADDR_LEGACY = this.bchjs.Address.toLegacyAddress(
        this.config.BCH_ADDR
      );
      const RECV_ADDR_LEGACY = this.bchjs.Address.toLegacyAddress(RECV_ADDR);
      wlogger.debug(`Sender Legacy Address: ${SEND_ADDR_LEGACY}`);
      wlogger.debug(`Receiver Legacy Address: ${RECV_ADDR_LEGACY}`);

      // const utxos = await this.bchjs.Blockbook.utxo(this.config.BCH_ADDR)
      const fulcrumResult = await this.bchjs.Electrumx.utxo(
        this.config.BCH_ADDR
      );
      const utxos = fulcrumResult.utxos;
      // console.log(`utxos: ${JSON.stringify(utxos, null, 2)}`)

      const utxo = await this.findBiggestUtxo(utxos);
      wlogger.debug("selected utxo: ", utxo);

      // Ensure compatiblity between indexers.
      // utxo.value = utxo.amount

      // instance of transaction builder
      let transactionBuilder;
      if (this.config.NETWORK === "testnet") {
        transactionBuilder = new this.bchjs.TransactionBuilder("testnet");
      } else {
        transactionBuilder = new this.bchjs.TransactionBuilder();
      }

      // const satoshisToSend = 1000;
      const originalAmount = utxo.value;
      const vout = utxo.tx_pos;
      const txid = utxo.tx_hash;

      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout);

      // get byte count to calculate fee. paying 1 sat/byte
      const byteCount = this.bchjs.BitcoinCash.getByteCount(
        { P2PKH: 1 },
        { P2PKH: 2 }
      );
      wlogger.verbose(`byteCount: ${byteCount}`);
      const satoshisPerByte = 3.0;
      const txFee = Math.floor(satoshisPerByte * byteCount);
      wlogger.verbose(`txFee: ${txFee}`);

      // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
      const remainder = originalAmount - satoshisToSend - txFee;
      wlogger.verbose(`remainder: ${remainder}`);

      // Bail out if remainder is less than dust
      if (remainder < 546) {
        throw new Error(`UTXO selected is too small. Remainder: ${remainder}`);
      }

      // add output w/ address and amount to send
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(RECV_ADDR),
        satoshisToSend
      );
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(this.config.BCH_ADDR),
        remainder
      );

      // Generate a change address from a Mnemonic of a private key.
      const change = await this.changeAddrFromMnemonic(walletInfo.mnemonic);

      // Generate a keypair from the change address.
      const keyPair = this.bchjs.HDNode.toKeyPair(change);

      // Sign the transaction with the HD node.
      let redeemScript;
      transactionBuilder.sign(
        0,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount
      );

      // build tx
      const tx = transactionBuilder.build();
      // output rawhex
      const hex = tx.toHex();

      return hex;
      // console.log(`Transaction raw hex: `);
      // console.log(`${hex}`);
    } catch (err) {
      wlogger.error("Error in bch.js/createBchTx().");
      throw err;
    }
  }

  // Broadcasts a hex-encoded transaction to the BCH network. Expects output
  // from createBchTx().
  async broadcastBchTx(hex) {
    try {
      // sendRawTransaction to running BCH node
      const broadcast = await this.bchjs.RawTransactions.sendRawTransaction(
        hex
      );
      wlogger.verbose(`Transaction ID: ${broadcast}`);

      return broadcast;
    } catch (err) {
      wlogger.error("Error in broadcastBchTx");

      // Handle messages from the full node.
      if (err.error) throw new Error(err.error);

      throw err;
    }
  }

  // Generate a change address from a Mnemonic of a private key.
  async changeAddrFromMnemonic(mnemonic) {
    // root seed buffer
    const rootSeed = await this.bchjs.Mnemonic.toSeed(mnemonic);

    // master HDNode
    let masterHDNode;
    if (this.config.NETWORK === "testnet") {
      masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed, "testnet");
    } else {
      masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed);
    }

    // HDNode of BIP44 account
    const account = this.bchjs.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

    // derive the first external change address HDNode which is going to spend utxo
    const change = this.bchjs.HDNode.derivePath(account, "0/0");

    return change;
  }

  // Consolidate UTXOs in the 145 path if there are more than 10. This is a
  // maintenance function that is called periodically to keep the UTXOs
  // small and organized.
  async consolidateUtxos() {
    // Amount utxos required to start consolidation.
    const minUtxos = 10;

    // Instatiate bch-js librarys
    let transactionBuilder;
    if (this.config.NETWORK === "testnet") {
      transactionBuilder = new this.bchjs.TransactionBuilder("testnet");
    } else {
      transactionBuilder = new this.bchjs.TransactionBuilder();
    }

    try {
      const appAddr = this.config.BCH_ADDR;

      // get the UTXO associated with the app address.
      // const utxos = await this.bchjs.Blockbook.utxo(appAddr)
      const fulcrumResult = await this.bchjs.Electrumx.utxo(appAddr);
      const utxos = fulcrumResult.utxos;

      // If the number of UTXOs are less than the minimum, exit this function.
      if (utxos.length < minUtxos) {
        console.log("Not enough UTXOs to consolidate");
        return false;
      }

      // UTXOs number more than 10. So kick-off consolidation.
      console.log("Consolidating UTXOs.");

      // Open the wallet controlling the bch
      const walletInfo = this.tlUtils.openWallet();

      // Get mnemonic from wallet info
      const mnemonic = walletInfo.mnemonic;

      // root seed buffer
      const rootSeed = await this.bchjs.Mnemonic.toSeed(mnemonic);

      // master HDNode
      let masterHDNode;
      if (this.config.NETWORK === "mainnet") {
        masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed);
      } else masterHDNode = this.bchjs.HDNode.fromSeed(rootSeed, "testnet"); // Testnet

      // HDNode of BIP44 account
      const account = this.bchjs.HDNode.derivePath(
        masterHDNode,
        "m/44'/145'/0'"
      );
      const changePath = this.bchjs.HDNode.derivePath(account, "0/0");

      // Generate an EC key pair for signing the transaction.
      // const keyPair = this.bchjs.HDNode.toKeyPair(changePath)

      // get the cash address
      const cashAddress = this.bchjs.HDNode.toCashAddress(changePath);
      console.log(`cashAddress: ${JSON.stringify(cashAddress, null, 2)}`);

      // Add the satoshis quantity of all UTXOs
      let satoshisAmount = 0;
      for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i];
        satoshisAmount = satoshisAmount + utxo.value;
        transactionBuilder.addInput(utxo.tx_hash, utxo.tx_pos);
      }

      // if (satoshisAmount < 546) {
      //   throw new Error('Original amount is zero. No BCH to send.')
      // }

      // Get byte count to calculate fee. paying 1 sat/byte
      const byteCount = this.bchjs.BitcoinCash.getByteCount(
        { P2PKH: utxos.length },
        { P2PKH: 1 }
      );
      const fee = Math.ceil(1.1 * byteCount);

      // amount to send to receiver.
      const sendAmount = satoshisAmount - fee;

      // add output  address and amount to send
      transactionBuilder.addOutput(
        this.bchjs.Address.toLegacyAddress(cashAddress),
        sendAmount
      );

      // Loop through each input and sign
      let redeemScript;
      for (let i = 0; i < utxos.length; i++) {
        const utxo = utxos[i];
        const change = await this.changeAddrFromMnemonic(mnemonic);
        const keyPair = this.bchjs.HDNode.toKeyPair(change);

        transactionBuilder.sign(
          i,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.value
        );
      }

      // Build transaction
      const tx = transactionBuilder.build();

      // output rawhex
      const hex = tx.toHex();

      return hex;

      // Broadcast trasaction
      // const broadcast = await this.broadcastBchTx(hex)
      // return broadcast
    } catch (error) {
      wlogger.error("Error in bch.js/consolidateUtxos()");
      throw error;
    }
  }

  // Checks BCH transactions to see if they have an OP_RETURN. Returns an object.
  // This method primarily targets BURN messages.
  // If no OP_RETURN is present, the isValid property will be false.
  // If OP_RETURN is present, it will attempt to be decoded.
  async readOpReturn(txid) {
    const retObj = {
      isValid: false // Return false by default.
    };

    try {
      // Get the raw transaction data.
      const txData = await this.bchjs.RawTransactions.getRawTransaction(
        txid,
        true
      );
      // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)

      // Decode the hex into normal text.
      const script = this.bchjs.Script.toASM(
        Buffer.from(txData.vout[0].scriptPubKey.hex, "hex")
      ).split(" ");
      // console.log(`script: ${JSON.stringify(script, null, 2)}`)

      // If there is no OP_RETURN present, then
      if (script[0] !== "OP_RETURN") return retObj;

      // Decode the command
      const cmd = Buffer.from(script[2], "hex").toString("ascii");
      // cmd = cmd.split(' ')
      // console.log(`cmd: ${JSON.stringify(cmd, null, 2)}`)

      // if (cmd[0] === 'BURN') {
      if (cmd.indexOf("BURN") > -1) {
        // let qty = Number(cmd[1])
        // console.log(`qty: ${qty}`)
        // qty = Number(qty)

        retObj.isValid = true;
        retObj.type = "burn";
        // retObj.qty = qty
      }

      return retObj;
    } catch (err) {
      wlogger.error("Error in bch.js/readOpReturn(): ", err);
      return retObj;
    }
  }

  // Retrieve the most recent transactions for an address from Electrumx.
  async getTransactions(addr) {
    try {
      // Get transaction history for the address.
      const transactions = await this.bchjs.Electrumx.transactions(addr);
      if (!transactions.success) {
        throw new Error(`No transaction history could be found for ${addr}`);
      }

      // Sort the transactions in descending order (newest first).
      const txsArr = this.sortTxsByHeight(
        transactions.transactions,
        "DESCENDING"
      );

      return txsArr;
    } catch (err) {
      wlogger.error("Error in bch.js/getTransactions(): ", err);
      throw err;
    }
  }

  // Sort the Transactions by the block height
  sortTxsByHeight(txs, sortingOrder = "ASCENDING") {
    if (sortingOrder === "ASCENDING") {
      return txs.sort((a, b) => a.height - b.height);
    }
    return txs.sort((a, b) => b.height - a.height);
  }

  // Extracts just the txids from the array passed back from getTransactions().
  justTxs(txsArr) {
    return txsArr.map(elem => elem.tx_hash);
  }
}

module.exports = BCH;
