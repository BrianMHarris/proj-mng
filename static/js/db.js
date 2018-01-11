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
    this.db.Promise = Promise;

    this.models = {};
    this.isConnected = false;
  }

  async _connect(connectedMsg, errMsg) {
    await this.db.connect(config.connection, { useMongoClient: true })
      .then(() => {
        this.isConnected = true;
        console.log(settings.connectedMsg)
      })
      .catch((err) => (
        this.logDBError(this.name, err);
      ));
  }

  _attachModels(models) {
    if (!models || Object.keys(models).length === 0) {
      if (config.debug)
        this.logDBError(this.name, err);
      return;
    };
    this.models = models;
    return this.models;
  }

  async initialize() {
    if (this.isConnected) return true;

    // NOTE: handle errors from function below here as well, don't move on?
    await this._connect()
    .then(() => {
      // attach the imported models
      if (this._attachModels(modelsImport)) {
        return true;
      } else {
        this.logDBError(this.name, err);
        return false;
      }
    }); // this is async, await / errors handled inside
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
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          this.logDBError(this.name, err);
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
        this.logDBError(this.name, err);
      });
  }

  // modeName:  name of the model key found in this.models
  // params:    key:values to find the model with, should match "model" folder
  // many:      find and return all entries with these parameters? false = first found
  // NOTE:      find all records by passing params={} and multiple=true
  findModel(modelName, params, multiple=false) {
    let findFN = (multiple === true) ? this.models[modelName].find(params) :
      this.models[modelName].findOne(params);

    return new Promise(function(resolve, reject) {
      findFN
        .then(doc => resolve(doc))
        .catch(err => {
          this.logDBError(this.name, err);
          reject(err);
        });
    });
  }

  logDBError(fnName, err) {
    console.log('ERROR! Database::' + fnName + " - " + err)
  }
}

const db = new Database();
db.initialize();
module.exports = db;
