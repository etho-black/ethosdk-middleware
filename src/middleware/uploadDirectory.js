const util = require("util");
const multer = require("multer");
const maxSize = 500000 * 1024 * 1024;

let uploadDir = multer({
  dest: __basedir + "/resources/static/assets/uploads/",
  limits: { fileSize: maxSize },
  preservePath: true,
}).array("files", 1000000000)

let uploadDirMiddleware = util.promisify(uploadDir);
module.exports = uploadDirMiddleware;
