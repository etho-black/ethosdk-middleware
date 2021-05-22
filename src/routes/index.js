const express = require("express");
const router = express.Router();
const controller = require("../controller/file.controller");

let routes = (app) => {
  router.post("/upload", controller.upload);
  router.post("/uploaddirectory", controller.uploadDirectory);
  router.post("/calculatecost", controller.calculateCost);
  router.post("/extend", controller.extend);
  router.post("/remove", controller.remove);
  router.post("/signup", controller.signup);
  router.post("/authenticate", controller.authenticate);
  router.post("/list", controller.list);
  router.get("/files/:name", controller.download);

  app.use(router);
};

module.exports = routes;
