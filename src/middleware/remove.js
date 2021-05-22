const util = require("util");
const multer = require("multer");

let removeContract = multer().none();

let removeContractMiddleware = util.promisify(removeContract);
module.exports = removeContractMiddleware;
