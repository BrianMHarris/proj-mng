const request = require('supertest'); // test http requests/responses
const app = require('../app'); // get the app
var expect = require('chai').expect; // use chai!

const dbTest = require('../static/js/dbTest');

const user1 = {
  username: "user1",
  password: "whatever",
  email: "test1@test.com"
}

const user2 = {
  username: "user2",
  password: "whatever",
  email: "test2@test.com"
}

// test for redirect from root
describe('GET /', function() {
  it('responds with redirect', function(done) {
    request(app)
      .get('/')
      .expect(302, done);
  });
});

// test for 'users' route
describe('/users Route', function(done) {
  before('before: /users', function(done) {
    // setup
    dbTest.initialize();
    done();
  });

  // after('after: /users',function(done) {
  //   dbTest.deleteModel("User", {});
  //   done();
  // });

  // NOTE: test for user collision (already exists)
  describe('POST /users', function() {
    it('inserts a new user object', function() {
      return new Promise((resolve, reject) => {
        request(app)
          .post('/users')
          .send(user1)
          .expect(200)
          .then(() => (resolve()))
          .catch((err => (reject(err))))
      });
    });
    it('inserts a new user object', function() {
      return new Promise((resolve, reject) => {
        request(app)
          .post('/users')
          .send(user2)
          .expect(200)
          .then(() => (resolve()))
          .catch((err => (reject(err))))
      });
    });
  });
// Needs a signup & login type of test
// authentication necessary

  // describe('GET /users', function(done) {
  //   it('responds with JSON', function(done) {
  //     request(app)
  //       .get('/users')
  //       .expect(200, done);
  //   });
  // });
  // NOTE: Must test  ser, and test an incorrect user
  describe('SHOW /users', function(done) {
    it('responds with user information', function(done) {
      request(app)
        .get('/users/user1')
        .expect(200, done);
    });
  });
  // describe('PATCH /users', function(done) {
  //   it('responds with JSON', function(done) {
  //     request(app)
  //       .patch('/users/test')
  //       .expect(200, done);
  //   });
  // });
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
