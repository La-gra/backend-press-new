import prisma from '../../src/config/prisma'

import bcrypt from 'bcrypt'

async function main() {
  const existing = await prisma.admin.findUnique({
    where: {
      email: 'superadmin@prn.com'
    }
  })

  if (existing) {
    console.log('SUPER_ADMIN already exists')

    return
  }

  const password = await bcrypt.hash(
    'ADMIN@123',
    12
  )

  await prisma.admin.create({
    data: {
      fullname: 'Super Admin',
      email: 'superadmin@prn.com',
      password,
      role: 'SUPER_ADMIN'
    }
  })

  console.log('SUPER_ADMIN created')
}

main()