const AWS = require("aws-sdk");
AWS.config.update({
  region: "us-west-2",
  endpoint: process.env.TEST_DATABASE
});

module.exports = new AWS.DynamoDB();
