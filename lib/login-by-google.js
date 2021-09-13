/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */


// Purpose:
//   - Provide loginByGoogleOffline() to generate the Google OAuth 2.0 URL.
//   - Provide loginByGoogle() to handle GoogleAuth, Registry and Session models.


/**
 * @param {Object} {}
 *   - @param {Object} env (optional)
 */
module.exports = ({ env }) => {
  if (env === undefined) {
    require('dotenv').config()
    env = process.env
  }

  const { OAuth2Client } = require('google-auth-library')

  const oAuth2Client = new OAuth2Client(
    env.LOGIN_BY_GOOGLE_DESKTOP_CLIENT_ID,
    env.LOGIN_BY_GOOGLE_DESKTOP_CLIENT_SECRET,
    env.LOGIN_BY_GOOGLE_DESKTOP_CLIENT_REDIRECT_URI
  )

  const loginByGoogleOffline = () => {
    return oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: env.LOGIN_BY_GOOGLE_CLIENT_SCOPE
    })
  }

  const loginByGoogle = (GoogleAuth, Session, identity, registry, authCode, callback) => {
    oAuth2Client.getToken(authCode, (err, tokens, response) => {
      if (!registry) { // Not yet register
        
      } else {

      }

      GoogleAuth.create({

      })


      console.log(tokens)
      
    })
  }


  return {
    loginByGoogleOffline,
    loginByGoogle
  }
}
