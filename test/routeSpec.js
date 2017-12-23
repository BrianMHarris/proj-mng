const request = require('supertest'); // test http requests/responses
const app = require('../app'); // get the app
var expect = require('chai').expect; // use chai!

const dbTest = require('./dbTest');

// test for redirect from root
describe('GET /', function() {
  it('responds with redirect', function(done) {
    request(app)
      .get('/')
      .expect(302, done);
  });
});

// test for 'users' route
describe('/users Route', function() {
  before('before: /users', function(done) {
    dbTest.createTable("Users", tableUsers, done);
  });

  after('after: /users',function(done) {
    dbTest.deleteTable("Users", done);
  });

  describe('GET /users', function(done) {
    it('responds with JSON', function(done) {
      request(app)
        .get('/users')
        .expect(200, done);
    });
  });
  describe('POST /users', function(done) {
    it('responds with JSON', function(done) {
      request(app)
        .post('/users')
        .expect(302, done);
    });
  });
  describe('PATCH /users', function(done) {
    it('responds with JSON', function(done) {
      request(app)
        .patch('/users/test')
        .expect(200, done);
    });
  });
  describe('DELETE /users', function(done) {
    it('responds with JSON', function(done) {
      request(app)
        .delete('/users/test')
        .expect(302, done);
    });
  });
});

const tableUsers = {
  TableName : "Users",
  KeySchema: [
      { AttributeName: "username", KeyType: "HASH"}  //Partition key
  ],
  AttributeDefinitions: [
      { AttributeName: "username", AttributeType: "S" },
  ],
  ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
  }
}
