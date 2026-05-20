import multer from 'multer'

import path from 'path'

import crypto from 'crypto'

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    cb
  ) => {
    cb(null, 'uploads/articles')
  },

  filename: (
    req,
    file,
    cb
  ) => {
    const unique =
      crypto.randomUUID()

    const extension =
      path.extname(file.originalname)

    cb(
      null,
      `${unique}${extension}`
    )
  }
})

const fileFilter: multer.Options['fileFilter'] = (
  req,
  file,
  cb
) => {
  const allowed = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  if (!allowed.includes(file.mimetype)) {
    return cb(
      new Error('Invalid file type')
    )
  }

  cb(null, true)
}

const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024
  }
})

export default upload