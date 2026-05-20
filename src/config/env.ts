const requiredEnv = [
  'DATABASE_URL',

  'JWT_ACCESS_SECRET'
]

requiredEnv.forEach(env => {
  if (!process.env[env]) {
    throw new Error(
      `Missing env variable: ${env}`
    )
  }
})