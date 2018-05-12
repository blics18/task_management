process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var db = require('../models/index');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);

// Login Testing
it('should successfully login and redirect to home page', function(done) {
  chai.request(app)
    .post('/auth/login')
    .send({
      'email':'demo@demo.com',
      'password':'demo'
    })
    .end(function(error, response) {
      response.should.have.status(200);
      response.should.be.json;
      response.body.should.be.a('object');
      response.body.should.have.property('redirect');
      response.body.redirect.should.equal('/home');
      expect('Location', '/home');
      done();
    });
});


it('should fail to login and print out error message (both email and password  are incorrect)', function(done) {
  chai.request(app)
    .post('/auth/login')
    .send({
      'email':'blah@demo.com',
      'password':'blah'
    })
    .end(function(error, response) {
      response.should.have.status(200);
      response.body.should.have.property('err');
      response.body.err.should.equal('Incorrect Username or Password');
      done();
    });
});

it('should fail to login and print out error message (password is incorrect)', function(done) {
  chai.request(app)
    .post('/auth/login')
    .send({
      'email':'demo@demo.com',
      'password':'blah'
    })
    .end(function(error, response) {
      response.should.have.status(200);
      response.body.should.have.property('err');
      response.body.err.should.equal('Incorrect Username or Password');
      done();
    });
});

it('should fail to login and print out error message (email is incorrect)', function(done) {
  chai.request(app)
    .post('/auth/login')
    .send({
      'email':'blah@demo.com',
      'password':'demo'
    })
    .end(function(error, response) {
      response.should.have.status(200);
      response.body.should.have.property('err');
      response.body.err.should.equal('Incorrect Username or Password');
      done();
    });
});


//Registration Testing
it('should fail registration and return error (email already exits)', function(done) {
   chai.request(app)
     .post('/auth/register')
     .send({
       'firstName': 'demo',
       'lastName': 'me',
       'email': 'demo@demo.com',
       'password': 'me'
     })
     .end(function(error, response) {
       response.should.have.status(200);
       response.should.be.json;
       response.body.should.be.a('object');
       response.body.should.have.property('err');
       response.body.err.should.equal('Email already in use');
       done();
     });
 });

describe('Register', function() {
  before(function(done) {
   db.sequelize.query('DELETE FROM "taskUsers" WHERE email=:email AND password=:password', {replacements: {email: 'hello@world.com', password: 'helloworld'}, type: db.sequelize.QueryTypes.DELETE})
   .then(function(result){
     done();
   })
   .catch(function(err){
     return console.error(err);
   })
 });
 it('should successfully register user information', function(done) {
   chai.request(app)
     .post('/auth/register')
     .send({
       'firstName': 'hello',
       'lastName': 'world',
       'email': 'hello@world.com',
       'password': 'helloworld',
     })
     .end(function(error, response) {
       response.should.have.status(200);
       response.should.be.json;
       response.body.should.be.a('object');
       response.body.should.have.property('redirect');
       response.body.redirect.should.equal('/home');
       done();
     });
 });
});
