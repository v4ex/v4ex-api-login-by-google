/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Add "googleAuth" field to mongoose model schema.


/**
 * @param {mongoose.Model()} Model
 * @param {mongoose.Model()} GoogleAuth
 */
 module.exports = (Model, GoogleAuth) => {

  const ModelSchema = Model.schema
  const mongoose = Model.base
  
  ModelSchema.plugin(schema => {
    schema.path('googleAuth', { type: mongoose.ObjectId, ref: GoogleAuth, unique: true, sparse: true })
  })
}
