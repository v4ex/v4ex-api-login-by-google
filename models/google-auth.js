/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose:
//   - Provide GoogleAuth mongoose model
//   - Provide GoogleAuthSchema
//   - Provide GoogleAuthOAuth2Schema


/**
 * @param {Object} {}
 *   - @param {mongoose} mongoose (optional)
 *   - @param {String} modelName (optional)
 *   - @param {Object} env (optional)
 * @param {Object} IdentitySettings (optional)
 */
module.exports = ({ mongoose, modelName, env }, IdentitySettings) => {
  const { Identity } = require('v4ex-api-identity/models/all-identity')(IdentitySettings || {})

  mongoose = mongoose || require('../mongoose')({ env })
  modelName = modelName || 'GoogleAuth'

  let GoogleAuth, GoogleAuthSchema, GoogleAuthOAuth2Schema

  if (mongoose.modelNames().includes(modelName)) {
    GoogleAuth = mongoose.model(modelName)
    GoogleAuthSchema = GoogleAuth.schema
    GoogleAuthOAuth2Schema = GoogleAuthSchema.path('oAuth2')
  } else {
    const Schema = mongoose.Schema
    GoogleAuthOAuth2Schema = new Schema ({
      access_token: String,
      id_token: String,
      token_type: String,
      expiry_date: Date,
      scope: String,
      refresh_token: String
    }, { _id: false })
    GoogleAuthSchema = new Schema({
      identity: { type: mongoose.ObjectId, ref: Identity },
      oAuth2: GoogleAuthOAuth2Schema
    })
    GoogleAuth = mongoose.model(modelName, GoogleAuthSchema)
  }

  return {
    GoogleAuth,
    GoogleAuthSchema,
    GoogleAuthOAuth2Schema
  }
}
