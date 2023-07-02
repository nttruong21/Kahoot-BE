import multer from 'multer'
import path from 'path'

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/images/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
})

// Filter
const imageFilter = function (req: any, file: any, cb: any) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|webp|WEBP|jfif|JFIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!'
    return cb(new Error('Only image files are allowed!'), false)
  }
  cb(null, true)
}

// Error response
// const returnMulterErrorResponse = (req, res, err, multiple = false) => {
//     if (req.fileValidationError) {
//         return res.status(200).json({
//             code: 500,
//             success: false,
//             message: "Upload file validation error",
//         });
//     }

//     // if (multiple) {
//     //     if (req.files.length === 0) {
//     //         return res.status(200).json({
//     //             code: 500,
//     //             success: false,
//     //             message: "Please select images to upload",
//     //         });
//     //     }
//     // } else {
//     //     if (!req.file) {
//     //         return res.status(200).json({
//     //             code: 500,
//     //             success: false,
//     //             message: "Please select an image to upload",
//     //         });
//     //     }
//     // }

//     if (err instanceof multer.MulterError) {
//         return res.status(200).json({
//             code: 500,
//             success: false,
//             message: "Multer error",
//         });
//     }

//     if (err) {
//         return res.status(200).json({
//             code: 500,
//             success: false,
//             message: "Server error",
//         });
//     }
// };

const multerUploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
    files: 5
  }
}).array('images', 5)

// Export
export { multerUploadImages }
