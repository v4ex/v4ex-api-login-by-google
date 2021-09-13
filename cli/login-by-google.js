/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Provide CLI command loginByGoogle to login by Google.


/**
 * @param {Object} {}
 *   - @param {mongoose.Model()} GoogleAuth (optional)
 *   - @param {mongoose} mongoose (optional)
 *   - @param {String} modelName (optional)
 *   - @param {Object} env (optional)
 * @param {String} appName (optional)
 */
 module.exports = ({ GoogleAuth, mongoose, modelName, env }, appName = 'this app') => {
  GoogleAuth = GoogleAuth || require('../models/google-auth')({ mongoose, modelName, env }).GoogleAuth
  const { loginByGoogleOffline, loginByGoogle } = require('../lib/login-by-google')({ env })

  const { program } = require('commander')

  const done = () => {
    GoogleAuth.base.connection.close()
  }

  program.command('loginByGoogle')
         .description('login by Google')
         .action(function() {
           const authUrl = loginByGoogleOffline()
           console.log(`Authorize ${appName} by visiting this url:`, authUrl)
           const readline = require('readline')
           const rl = readline.createInterface({
             input: process.stdin,
             output: process.stdout,
           })
           rl.question('Enter the code from that page here: ', (authCode) => {
             rl.close()
             loginByGoogle(authCode)
           })
         })

}
