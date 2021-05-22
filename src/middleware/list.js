const util = require("util");
const multer = require("multer");
let listUploads = multer().none();

let listUploadsMiddleware = util.promisify(listUploads);
module.exports = listUploadsMiddleware;
