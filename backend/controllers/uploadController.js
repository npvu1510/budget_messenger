import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').at(-1).toLowerCase();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/gif'
  )
    cb(null, true);
  else cb(new Error('Only accept image/jpeg and image/png or image/gif'));
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
