const multer = require('multer');
const {v4: uuidv4} = require('uuid'); //Step 12: write code for uuid and file destination
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
        const unique = uuidv4();
        cb(null, unique + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;