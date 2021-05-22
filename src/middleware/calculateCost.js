const util = require("util");
const multer = require("multer");

let calculateCost = multer().none();

let calculateCostMiddleware = util.promisify(calculateCost);
module.exports = calculateCostMiddleware;
