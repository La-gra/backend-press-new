import rateLimit from 'express-rate-limit'

export const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 100,

  message: {
    message:
      'Too many requests, try again later'
  },

  standardHeaders: true,

  legacyHeaders: false
})