/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose:
//   - Provide GoogleAuth mongoose model
//   - Provide GoogleAuthSchema
//   - Provide GoogleAuthOAuth2Schema
//   - Provide GoogleAuthOAuth2TokensSchema


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

  let GoogleAuth, GoogleAuthSchema, GoogleAuthOAuth2Schema, GoogleAuthOAuth2TokensSchema

  if (mongoose.modelNames().includes(modelName)) {
    GoogleAuth = mongoose.model(modelName)
    GoogleAuthSchema = GoogleAuth.schema
    GoogleAuthOAuth2Schema = GoogleAuthSchema.path('oAuth2')
    GoogleAuthOAuth2TokensSchema = GoogleAuthOAuth2Schema.path('tokens')
  } else {
    const Schema = mongoose.Schema
    GoogleAuthOAuth2TokensSchema = new Schema({
      access_token: String,
      refresh_token: String,
      scope: String,
      token_type: String,
      id_token: String,
      expiry_date: Number
    }, { _id: false })
    GoogleAuthOAuth2Schema = new Schema ({
      sub: { type: String, require: true, unique: true },
      tokens: { type: GoogleAuthOAuth2TokensSchema, require: true }
    }, { _id: false })
    GoogleAuthSchema = new Schema({
      identity: { type: mongoose.ObjectId, ref: Identity, require: true, unique: true },
      oAuth2: { type: GoogleAuthOAuth2Schema, require: true }
    })
    GoogleAuth = mongoose.model(modelName, GoogleAuthSchema)
  }

  return {
    GoogleAuth,
    GoogleAuthSchema,
    GoogleAuthOAuth2Schema,
    GoogleAuthOAuth2TokensSchema
  }
}
