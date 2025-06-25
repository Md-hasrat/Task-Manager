import multer from "multer"
import fs from "fs"
import path from "path"


// 1. Define the Disk Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/'

        // Ensure the upload directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }

        cb(null, uploadDir)
    },
    // Define the File Name
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }

})


// 2. Define the File Filter Function
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // Accept the file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false); // Reject the file
    }
}


// 3. Create the Multer Middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB file size limit (adjust as needed)
    }
});


export default upload
