const testDB = require('../static/js/db');

module.exports.db = testDB;

module.exports.createTable = (tableName, params, done) => {
  console.log(`Creating Table: {tableName}`);

  testDB.createTable(params).promise()
    .then(function(data) {
      console.log(`Created table. Table description JSON:", ${JSON.stringify(data, null, 2)}`);
    })
    .catch(function(err) {
      console.error(`Unable to create table: ${tableName}. Error: ${JSON.stringify(err, null, 2)}`)
    })
    .then(function() { done(); });
};

module.exports.deleteTable = (tableName, done) => {
  console.log(`Deleting Table: {tableName}. This could take up to 25 seconds...`);

  testDB.waitFor('tableExists', {TableName: tableName}).promise()
    .then(function(data) {
      return testDB.deleteTable({TableName: tableName}).promise();
    })
    .then(function(data) {
      console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    })
    .catch(function(err) {
      console.error(`Unable to delete table. Error: ${JSON.stringify(err, null, 2)}`)
    })
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
