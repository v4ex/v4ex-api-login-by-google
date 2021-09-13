/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

const googleAuth = require('../models/google-auth')


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

  const loginByGoogle = (GoogleAuth, Registry, Session, identity, registry, authCode, publicKey, callback) => {
    


    oAuth2Client.getToken(authCode, (err, tokens, response) => {
      if (err) {
        console.error(err)
        callback(err)
      } else {
        // console.log(tokens) // DEBUG
        oAuth2Client.getTokenInfo(tokens.access_token)
                    .then(accessTokenInfo => {
                      // console.log(accessTokenInfo) // DEBUG
                      GoogleAuth.findOne({ identity })
                                .then(async googleAuth => {
                                  if (!googleAuth) {
                                    try {
                                      googleAuth = await GoogleAuth.create({
                                        identity,
                                        oAuth2: {
                                          sub: accessTokenInfo.sub,
                                          tokens
                                        }
                                      })
                                    } catch (err) {
                                      console.error(err)
                                      callback(err)
                                    }
                                  } else {
                                    googleAuth.set('oAuth2', {
                                      sub: accessTokenInfo.sub,
                                      tokens 
                                    })
                                    await googleAuth.save()
                                  }
                                  if (!registry) { // Not yet registered
                                    try {
                                      registry = await Registry.create({
                                        identity,
                                        googleAuth
                                      })
                                    } catch (err) {
                                      console.error(err)
                                      callback(err)
                                    }
                                  } else {
                                    registry.set('googleAuth', googleAuth)
                                    await registry.save()
                                  }
                                  // console.log(`googleAuth`, googleAuth) // DEBUG
                                  // console.log(`registry`, registry) // DEBUG
                                  Session.create({ identity, registry, publicKey })
                                         .then(session => {
                                           callback(null, session)
                                         })
                                         .catch(err => {
                                           console.error(err)
                                           callback(err)
                                         })
                                })
                                .catch(err => {
                                  console.error(err)
                                  callback(err)
                                })
                    })
                    .catch(err => {
                      console.error(err)
                      callback(err)
                    })

      }
      
    })
  }


  return {
    loginByGoogleOffline,
    loginByGoogle
  }
}
