import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ]

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Format image non autorisé.'))
  }

  cb(null, true)
}

export const uploadConcoursAffiche = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
})
