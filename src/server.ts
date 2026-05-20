import 'dotenv/config'
import 'tsconfig-paths/register'
import './config/env'

import app from './app'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})