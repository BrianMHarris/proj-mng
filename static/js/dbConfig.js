module.exports = {
  development: {
    client: 'mongodb',
    connection: 'mongodb://localhost/proj-man-server',
    debug: true,
    // migrations: {
    //   directory: __dirname + '/src/server/db/migrations'
    // },
    // seeds: {
    //   directory: __dirname + '/src/server/db/seeds'
    // }
  },
  test: {
    client: 'mongodb',
    connection: 'mongodb://localhost/proj-man-test',
    debug: true,
    // migrations: {
    //   directory: __dirname + '/src/server/db/migrations'
    // },
    // seeds: {
    //   directory: __dirname + '/src/server/db/seeds'
    // }
  }
};
