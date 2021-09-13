/* Copyright (c) V4EX Inc. SPDX-License-Identifier: GPL-3.0-or-later */

// Purpose: Provide Registry, RegistrySchema instances with googleAuth field.


/**
 * @param {Object} {}
 *   - @param {mongoose.Model()} GoogleAuth
 *   - @param {mongoose} mongoose (optional)
 *   - @param {String} modelName (optional)
 *   - @param {Object} env (optional)
 * @param {Object} RegistrySettings (optional)
 */
 module.exports = ({ GoogleAuth, mongoose, modelName, env }, RegistrySettings) => {
  const { Registry, RegistrySchema } = require('v4ex-api-register/models/registry')(RegistrySettings || {})

  GoogleAuth = GoogleAuth || require('./google-auth')({ mongoose, modelName, env })

  require('./plugins/google-auth')(Registry, GoogleAuth)

  return {
    Registry,
    RegistrySchema
  }
}
