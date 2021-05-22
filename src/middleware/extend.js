const util = require("util");
const multer = require("multer");

let extendContract = multer().none();

let extendContractMiddleware = util.promisify(extendContract);
module.exports = extendContractMiddleware;
