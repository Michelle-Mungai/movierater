// src/utils/response.js

exports.ok = (res, data) =>
  res.status(200).json(data);

exports.created = (res, data) =>
  res.status(201).json(data);

exports.noContent = (res) =>
  res.sendStatus(204);