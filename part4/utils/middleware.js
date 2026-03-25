const logger = require('./logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method ', request.method)
  logger.info('Path ', request.path)
  logger.info('Body ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorizationHeader = request.headers.authorization

  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    request.token = authorizationHeader.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  const token = request.token
  if (!token) {
    response
      .status(401)
      .json({ error: 'token missing' })
  }

  const decodedToken = jwt.verify(token, config.SECRET)
  if (!(decodedToken && decodedToken.id)) {
    response
      .status(401)
      .json({ error: 'token invalid' })
  }

  const user = await User.findOne({ username: `${decodedToken.username}` })
  if (!user) {
    response
      .status(404)
      .json({ error: 'user missing' })
  } else {
    request.user = user
  }
  next()
}

const unknownEndpoint = (request, response) => {
  response
    .status(404)
    .send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    response
      .status(400)
      .send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    response
      .status(400)
      .send({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    response
      .status(400)
      .send({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    response
      .status(401)
      .send({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    response
      .status(401)
      .send({ error: 'token expired' })
  }
  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
