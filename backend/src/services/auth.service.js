// src/services/auth.service.js
//
// FIXED:
//  1. `exports.googleLogin` was previously declared *after* a `return`
//     statement inside findOrCreateGoogleUser, making it unreachable dead
//     code - `authService.googleLogin` was always `undefined`, so every
//     Google OAuth callback crashed with "googleLogin is not a function".
//  2. login() compared the submitted password against `user.password`,
//     but the column (and therefore the field on the returned row) is
//     `password_hash`. Login always failed.

const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/user.repository");
const { createJWT } = require("../utils/jwt");
const ApiError = require("../utils/ApiError");

exports.register = async ({ username, email, password }) => {
  const existing = await userRepository.findByEmail(email);

  if (existing) {
    throw ApiError.conflict("Email already exists");
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userRepository.createUser(username, email, hash);

  const token = createJWT({
    id: user.id,
    email: user.email,
  });

  return {
    user,
    token,
  };
};

exports.login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email);

  if (!user || !user.password_hash) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw ApiError.unauthorized("Invalid credentials");
  }

  delete user.password_hash;

  const token = createJWT({
    id: user.id,
    email: user.email,
  });

  return {
    user,
    token,
  };
};

exports.findByEmail = (email) => userRepository.findByEmail(email);

exports.findById = (id) => userRepository.findById(id);

exports.findOrCreateGoogleUser = async (profile) => {
  let user = await userRepository.findByGoogleId(profile.id);

  if (user) return user;

  user = await userRepository.findByEmail(profile.emails[0].value);

  if (user) return user;

  return await userRepository.createGoogleUser(profile);
};

exports.googleLogin = async (user) => {
  const token = createJWT({
    id: user.id,
    email: user.email,
  });

  delete user.password_hash;

  return {
    token,
    user,
  };
};
