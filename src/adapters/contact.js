/*
  Business logic for the /contact endpoint.
*/

/* eslint-disable no-useless-escape */
import config from '../../config/index.js'
import NodeMailer from './nodemailer.js'
import wlogger from './wlogger.js'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const nodemailer = new NodeMailer()
let _this

class ContactLib {
  constructor () {
    _this = this
    _this.config = config
    _this.nodemailer = nodemailer
  }

  async sendEmail (emailObj) {
    try {
      // Validate input
      if (!emailObj.email || typeof emailObj.email !== 'string') {
        throw new Error("Property 'email' must be a string!")
      }

      if (!emailObj.formMessage || typeof emailObj.formMessage !== 'string') {
        throw new Error("Property 'formMessage' must be a string!")
      }

      // If an email list exists, the email will be sent to that list
      // otherwhise will be sended by default to the variable "_this.config.emailUser"
      let _to = [_this.config.emailUser]

      // Email list is optional
      if (emailObj.emailList) {
        if (
          !Array.isArray(emailObj.emailList) ||
          !emailObj.emailList.length > 0
        ) {
          throw new Error("Property 'emailList' must be a array of emails!")
        } else {
          _to = emailObj.emailList
        }
      }

      console.log(`Trying send message to : ${_to}`)

      emailObj.to = _to

      const result = await _this.nodemailer.sendEmail(emailObj)
      return result
    } catch (err) {
      wlogger.error('Error in lib/contact.js/sendEmail()')
      throw err
    }
  }

  // Send an email alert about an error that can't be handled by the Token
  // Liquidity app.
  async sendTLEmailAlert (emailObj) {
    try {
      // Exit if the server is not set up to send email alerts.
      if (!this.config.useEmailAlerts) return false

      const now = new Date()

      // Generate html message.
      const htmlMsg = `
      <body>
        <p>
          <b>Date: </b>${now.toLocaleString()} (UTC: ${now.toISOString()})
        </p>
        <p>
          <b>Message from calling function:</b> ${emailObj.callerMsg}
        </p>
        <p>
          <b>Error object:</b> ${emailObj.errorObj.toString()}
        </p>
      </body>
      `

      // Hydrate the email object.
      emailObj.email = this.config.emailUser
      emailObj.formMessage = htmlMsg
      emailObj.emailList = this.config.emailRecievers
      emailObj.subject = this.config.emailMachineName

      const result = await this.sendEmail(emailObj)

      return result
    } catch (err) {
      wlogger.error('Error in lib/contact.js/sendTLEmailAlert()')
      throw err
    }
  }
}

export default ContactLib
