const environment = process.env.NODE_ENV;
const config = require('./dbConfig.js')[environment];
const blueprints = require('../../models/index');

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

  buildModels(blueprints) {
    if (!blueprints || blueprints.length === 0) {
      if (config.debug)
        console.log("Database::buildModels ERROR - argument not valid")
      return undefined;
    };

    // for every blueprint we import, build a schema and model
    //  (fake schema!)
    for (var key in blueprints) {
      let schema = new this.db.Schema(
        blueprints[key],
        {timestamps: true}
      );
      this.models[key] = this.db.model(key, schema);
    }

    return this.models;
  }

  initialize() {
    // NOTE: handle errors from function below here as well, don't move on?
    this.connect(); // this is async, await / errors handled inside

    // currently using the const blueprints from above
    if (this.buildModels(blueprints)) {
    } else {
      console.log("Database::initialize ERROR - build models failed");
    }
  }

  // modeName:  name of the model key found in this.models
  // params:    key:values to fill the model with, should match "model" folder
  insertModel(modelName, params) {
    let model = this.models[modelName];

    return new Promise(function(resolve, reject) {
      if (!model) {
        reject("'" + modelName + "' does not exist");
      }
      model.create(params)
        .then(data => (
          resolve(data)
        ))
        .catch(err => (
          reject(err)
        ));
    })
    .catch(err => {
      console.log("Error - Database::insertModel ERROR - " + err);
    });
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
        console.log("Database::deleteModel ERROR - ", err);
      });
  }

  // modeName:  name of the model key found in this.models
  // params:    key:values to find the model with, should match "model" folder
  // many:      find and return all entries with these parameters? false = first found
  // NOTE:      find all records by passing params={} and multiple=true
  findModel(modelName, params, multiple=false) {
    let findFN = (multiple === true) ? this.models[modelName].find(params) :
      this.models[modelName].findOne(params);

    findFN
      .then()
      .catch(err => {
        console.log("Database::findModel ERROR - ", err);
      });
  }
}

const db = new Database();
module.exports = db;
