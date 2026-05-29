const requiredEnv = [
  'DATABASE_URL',

  'JWT_ACCESS_SECRET',

  'JWT_REFRESH_SECRET',

  'FRONTEND_URL'
]

requiredEnv.forEach(env => {
  if (!process.env[env]) {
    throw new Error(
      `Missing env variable: ${env}`
    )
  }
})