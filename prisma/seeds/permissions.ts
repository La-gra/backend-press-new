import prisma from '../../src/config/prisma'

import { PERMISSIONS } from '../../src/constants/permissions'

async function main() {
  const values = Object.values(PERMISSIONS)

  for (const permission of values) {
    const exists = await prisma.permission.findUnique({
      where: {
        name: permission
      }
    })

    if (!exists) {
      await prisma.permission.create({
        data: {
          name: permission
        }
      })
    }
  }

  console.log('Permissions seeded')
}

main()