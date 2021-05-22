const util = require("util");
const multer = require("multer");

let registerAccount = multer().none();

let registerAccountMiddleware = util.promisify(registerAccount);
module.exports = registerAccountMiddleware;
