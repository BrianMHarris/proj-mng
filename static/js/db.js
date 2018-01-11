const environment = process.env.NODE_ENV;
const config = require('./dbConfig.js')[environment];
const modelsImport = require('../../models/index');

const settings = {
  connectedMsg: "Connected to MongoDB",
  errMsg: "Connection Error: "
}

class Database {
  constructor() {
    this.db = require('mongoose');
    this.db.set("debug", config.debug);
    this.db.Promise = global.Promise;

    this.models = {};
  }

  async connect(connectedMsg, errMsg) {
    await this.db.connect(config.connection, { useMongoClient: true })
      .then(() => (
        console.log(settings.connectedMsg)
      ))
      .catch((err) => (
        console.log(settings.errMsg + err)
      ));
  }

  attachModels(models) {
    if (!models || models.length === 0) {
      if (config.debug)
        console.log("Database::attachModels ERROR - no models found")
      return;
    };
    this.models = models;
    return this.models;
  }

  initialize() {
    // NOTE: handle errors from function below here as well, don't move on?
    this.connect(); // this is async, await / errors handled inside

    // attach the imported models
    if (this.attachModels(modelsImport)) {
      return true;
    } else {
      console.log("Database::initialize ERROR - attach models failed");
      return false;
    }
  }

  // modeName:  name of the model key found in this.models
  // params:    key:values to fill the model with, should match "model" folder
  insertModel(modelName, params) {
    let model = this.models[modelName];

    if (!model) {
      return Promise.reject("Error - Database::insertModel - '" + modelName + "' does not exist");
    }

    return new Promise(function(resolve, reject) {
      model.create(params)
        .then(data => (
          resolve(data)
        ))
        .catch(err => {
          console.log("Error - Database::insertModel - " + err);
          reject(err);
        })
    })
  }

  // modeName:  name of the model key found in this.models
  // params:    key:values to match the model with, should match "model" folder
  // multiple:  delete all matching records with these parameters? false = first found
  // NOTE:      you can delete an entire collection by passing params={} and multiple=true. Don't do this!
  deleteModel(modelName, params, multiple=false) {
    let removeFN = (multiple === true) ? this.models[modelName].remove(params) :
      this.models[modelName].findOneAndRemove(params);

    removeFN
      .then()
      .catch(err => {
        console.log("Error - Database::deleteModel - ", err);
      });
  }

  // modeName:  name of the model key found in this.models
  // params:    key:values to find the model with, should match "model" folder
  // many:      find and return all entries with these parameters? false = first found
  // NOTE:      find all records by passing params={} and multiple=true
  findModel(modelName, params, multiple=false) {
    console.log(params)
    let findFN = (multiple === true) ? this.models[modelName].find(params) :
      this.models[modelName].findOne(params);

    return new Promise(function(resolve, reject) {
      findFN
        .then(data => resolve(data))
        .catch(err => {
          console.log("Database::findModel ERROR - ", err);
          reject(err);
        });
    });
  }
}

const db = new Database();
module.exports = db;
