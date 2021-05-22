const fs = require('fs');
const ethofsSDK = require('@ethofs/sdk');
const uploadFile = require("../middleware/upload");
const uploadDir = require("../middleware/uploadDirectory");
const calcCost = require("../middleware/calculateCost");
const listUploads = require("../middleware/list");
const extendContract = require("../middleware/extend");
const removeContract = require("../middleware/remove");
const registerAccount = require("../middleware/signup");
const authenticateAccount = require("../middleware/authenticate");
const privateKeyToAddress = require('ethereum-private-key-to-address')
const connections = {
    rpc: 'http://127.0.0.1:8545',
    gateway: 'http://127.0.0.1:5001'
};
const privateKey = '';

function validatePrivateKey(key) {
  try {
    privateKeyToAddress(key);
    if(key.substring(0,2) == "0x") {
      var privateKeyBuffer = EthUtil.toBuffer(key);
      const wallet = Wallet.fromPrivateKey(key);
    } else {
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

const upload = async (req, res) => {
  try {
    await uploadFile(req, res);

    if (req.body == undefined) {
      return res.status(400).send({ message: "Etho Protocol key authentication failed" });
    } else if (req.file == undefined) {
      console.log(req);
      return res.status(400).send({ message: "No upload data found" });
    }

    if(!validatePrivateKey(privateKey)) {
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privateKey, connections);

    ethofs.testAuthentication().then((result) => {
      const readableStreamForFile = fs.createReadStream(req.file.path);
      const options = {
        ethofsData: {
          name: req.body.name
        },
        ethofsOptions: {
          hostingContractDuration: Number(req.body.duration)
        }
      };
      ethofs.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        res.status(200).send({
          message: "Uploaded the file successfully: " + req.file.originalname,
        });

      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    });
  }
};

const uploadDirectory = async (req, res) => {
   try {

    await uploadDir(req, res);

    if (req.body == undefined) {
      return res.status(400).send({ message: "Etho Protocol key authentication failed" });
    } else if (req.files == undefined) {
      console.log(req);
      return res.status(400).send({ message: "No upload data found" });
    }

    if(!validatePrivateKey(privateKey)) {
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privateKey, connections);

    var arrayOfFiles = [];

    req.files.forEach(function (file, index, array) {
      arrayOfFiles.push({
        path: file.originalname,
        content: fs.readFileSync(file.path),
      });
      console.log(arrayOfFiles.length);
      if(arrayOfFiles.length === array.length) {
        ethofs.testAuthentication().then((result) => {
        const options = {
          ethofsData: {
            name: req.body.name
          },
          ethofsOptions: {
            hostingContractDuration: Number(req.body.duration)
          }
        };
        ethofs.pinFolderToIPFS(arrayOfFiles, options).then((result) => {
          console.log(result);
          console.log(res);
          res.status(200).send({
            message: "Uploaded the directory successfully: " + req.body.name,
          });

        }).catch((err) => {
          console.log(err);
        });
     }).catch((err) => {
      console.log(err);
    });
      }
    });

  } catch (err) {
      res.status(500).send({
      message: "Could not upload the directory: " + req.body.name,
  });
  }
};



const extend = async (req, res) => {
  try {
    await extendContract(req, res);

    if (req.body == undefined) {
      return res.status(400).send({ message: "Etho Protocol key authentication failed" });
    }
    if(!validatePrivateKey(privateKey)) {
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privatKey, connections);

    ethofs.testAuthentication().then((result) => {
      console.log(result);
      const options = {
        ethofsOptions: {
          hostingContractDuration: Number(req.body.duration)
        }
      };
      ethofs.extendPin(req.body.address, options).then((result) => {
        console.log(result);
        res.status(200).send({
          message: "Contract extension successful: " + req.body.address,
        });

      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });
  } catch (err) {
    res.status(500).send({
      message: `Could not extend contract: ${req.body.address}. ${err}`,
    });
  }
};

const remove = async (req, res) => {
  try {
    await removeContract(req, res);

    if (req.body == undefined) {
      return res.status(400).send({ message: "Etho Protocol key authentication failed" });
    }
    if(!validatePrivateKey(privateKey)) {
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privateKey, connections);

    ethofs.testAuthentication().then((result) => {
      console.log(result);
      ethofs.unpin(req.body.address).then((result) => {
        console.log(result);
        res.status(200).send({
          message: "Contract removal successful: " + req.body.address,
        });

      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });

  } catch (err) {
    res.status(500).send({
      message: `Could not remove contract: ${req.body.address}. ${err}`,
    });
  }
};

const signup = async (req, res) => {
  try {
    await registerAccount(req, res);

    if (req.body == undefined) {
      return res.status(400).send({ message: "Etho Protocol key authentication failed" });
    }

    if(!validatePrivateKey(privateKey)) {
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privateKey, connections);

      ethofs.addUser(req.body.name).then((result) => {
        console.log(result);
        res.status(200).send({
          message: "User registration successful: " + req.body.name,
        });
      }).catch((err) => {
        console.log(err);
        res.status(200).send({
          message: "false",
        });
      });

  } catch (err) {
    res.status(500).send({
      message: `Could not register user ${req.body.name}. ${err}`,
    });
  }
};

const authenticate = async (req, res) => {
  try {
    await authenticateAccount(req, res);

    if (req.body == undefined) {
      return res.status(400).send({ message: "Etho Protocol key authentication failed" });
    }
    if(!validatePrivateKey(privateKey)) {
      console.log("Invalid private key entry");
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privateKey, connections);

    ethofs.testAuthentication().then((result) => {
      res.status(200).send({
        message: "true",
      });
    }).catch((err) => {
      res.status(200).send({
        message: "false",
      });
      console.log(err);
    });

  } catch (err) {
    res.status(500).send({
      message: `Could not register user ${req.body.name}. ${err}`,
    });
  }
};

const list = async (req, res) => {
  try {
    await listUploads(req, res);
    if(!validatePrivateKey(privateKey)) {
      return res.status(500).send({ message: 'Invalid private key entry'});
    }

    let ethofs = ethofsSDK(privateKey, connections);

    ethofs.testAuthentication().then((result) => {
      ethofs.pinList().then((result) => {
        console.log(result);
        res.status(200).send(result);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {
      console.log(err);
    });

  } catch (err) {
    res.status(500).send({
      message: 'User not found - please register first'
    });
  }

};

const calculateCost = async (req, res) => {
  try {
    await calcCost(req, res);
    if (req.body == undefined || req.body.duration == undefined || req.body.size == undefined) {
      return res.status(400).send({ message: "Incorrect upload cost calculation parameters provided" });
    }

    let ethofs = ethofsSDK(connections);

    const options = {
      ethofsOptions: {
        hostingContractDuration: Number(req.body.duration),
        hostingContractSize: Number(req.body.size),
      }
    };

    ethofs.calculateCost(options).then((result) => {
      console.log(result);
      res.status(200).send(result);
    }).catch((err) => {
      console.log(err);
    });

  } catch (err) {
    res.status(500).send({
      message: 'Error in ethoFS cost calculation'
    });
  }
};

module.exports = {
  upload,
  uploadDirectory,
  calculateCost,
  extend,
  remove,
  signup,
  list,
  authenticate,
};
