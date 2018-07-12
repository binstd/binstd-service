const rds = require('ali-rds');
var db = rds({
    host: '144.202.53.64',
    port: 3306,
    user: 'admin',
    password: 'wly3125965',
    database: 'wallet',
  });
  module.exports  = db;