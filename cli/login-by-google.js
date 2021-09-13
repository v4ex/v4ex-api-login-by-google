/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Provide CLI command loginByGoogle to login by Google.


/**
 * @param {Object} {}
 *   - @param {mongoose.Model()} GoogleAuth (optional)
 *   - @param {mongoose.Model()} Identity (optional)
 *   - @param {mongoose.Model()} Registry (optional)
 *   - @param {mongoose.Model()} Session (optional)
 *   - @param {mongoose} mongoose (optional)
 *   - @param {String} modelName (optional)
 *   - @param {Object} env (optional)
 * @param {String} appName (optional)
 * @param {Object} IdentitySettings (optional)
 * @param {Object} RegistrySettings (optional)
 * @param {Object} SessionSettings (optional)
 */
 module.exports = ({ GoogleAuth, Identity, Registry, Session, mongoose, modelName, env }, appName = 'this app', IdentitySettings, RegistrySettings, SessionSettings) => {
  GoogleAuth = GoogleAuth || require('../models/google-auth')({ mongoose, modelName, env }).GoogleAuth
  const { loginByGoogleOffline, loginByGoogle } = require('../lib/login-by-google')({ env })


  const { Identity } = require('v4ex-api-identity/models/all-identity')(IdentitySettings || {})
  const { Registry } = require('v4ex-api-register/models/registry')(RegistrySettings || {})
  const { Session } = require('v4ex-api-login/models/session')(SessionSettings || {})

  const chalk = require('chalk')
  const { program } = require('commander')

  const handleError = (err) => {
    console.error(err)
    done()
  }

  const done = () => {
    GoogleAuth.base.connection.close()
  }

  program.command('loginByGoogle')
         .description('login by Google')
         .argument('[publicKey]', 'public key in key pair')
         .option('--username <username>', 'username for identity')
         .option('--email <email>', 'email for identity')
         .action(function(publicKey, options) {
           let id
           const findIdentity = {}
           if (options.username) {
             findIdentity.username = options.username
             id = options.username
           } else if (options.email) {
             findIdentity.email = options.email
             id = options.email
           }

           Identity.findOne(findIdentity)
             .then(identity => {
               if (!identity) {
                 console.log(chalk.red(`Identity ${id} not found.`))
                 done()
               } else {
                 Registry.findOne({ identity })
                         .then(registry => {
                           const callback = (err, session) => {
                             if (err) {
                               handleError(err)
                             } else {
                               console.log(session)
                               done()
                             }
                           }

                           const authUrl = loginByGoogleOffline()
                           console.log(`Authorize ${appName} by visiting this url:`, authUrl)

                           const readline = require('readline')
                           const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
                           rl.question('Enter the code from that page here: ', (authCode) => {
                             rl.close()
                             loginByGoogle(GoogleAuth, Session, identity, registry, authCode, publicKey, callback)
                           })

                         })
                         .catch(err => handleError(err))
               }

           })
           .catch(err => handleError(err))

           
         })

}
