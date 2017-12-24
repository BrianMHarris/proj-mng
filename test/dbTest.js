const testDB = require('../static/js/db');
var AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000"
});

// NOTE: REFACTOR WAITFOR TO BE A FUNCTION THAT CALLS A FUNCTION => DRY AS EFF
// ALSO: Figure out how to chain this shit so it doesn't actually wait forever.
//        perhaps some kind of wait function that looks for ACTIVE state then flags
//        for all following functions


module.exports.db = testDB;
module.exports.docClient = docClient;

module.exports.createTable = (tableName, params) => {
  console.log(`Creating Table: ${tableName}`);

  return new Promise((resolve, reject) => {
    testDB.createTable(params).promise()
      .then(function(data) {
        console.log(`Created table. Table description JSON:", ${JSON.stringify(data, null, 2)}`);
        resolve(data);
      })
      .catch(function(err) {
        console.error(`Unable to create table: ${tableName}. Error: ${JSON.stringify(err, null, 2)}`)
        reject(err);
      });
  })
};

module.exports.deleteTable = (tableName, done) => {
  console.log(`Deleting Table: ${tableName}. This could take up to 25 seconds...`);

  // we need to be sure the table exists (ACTIVE) before trying to delete it
  testDB.waitFor('tableExists', {TableName: tableName}).promise()
    .then((data) => {
      return testDB.deleteTable({TableName: tableName}).promise();
    })
    .then(function(data) {
      console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));

    })
    .catch(function(err) {
      console.error("Unable to delete table. Error:", JSON.stringify(err, null, 2));
    });
    done();
};

module.exports.addToTable = (tableName, item, done) => {
  console.log(`Adding To Table: ${tableName}. This could take up to 25 seconds...`);

  let params = {
    TableName: tableName,
    Item: item
  };

  // we need to be sure the table exists (ACTIVE) before trying to delete it
  testDB.waitFor('tableExists', {TableName: tableName}).promise()
  .then((data) => {
      return docClient.put(params).promise();
    })
    .then(function(data) {
      console.log("Item added to table. Info:", data);
    })
    .catch(function(err) {
      console.error("Unable to add item to table. Error:", err);
    });
  done();
};

module.exports.tableProjects = () => (
  {
    TableName : "Projects",
    KeySchema: [
        { AttributeName: "name", KeyType: "HASH"}  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "name", AttributeType: "S" },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
  }
);
