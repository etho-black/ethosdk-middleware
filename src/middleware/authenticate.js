const util = require("util");
const multer = require("multer");

let authenticateAccount = multer().none();

let authenticateAccountMiddleware = util.promisify(authenticateAccount);
module.exports = authenticateAccountMiddleware;
