process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var db = require('../models/index');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);
var agent = chai.request.agent(app);

//TODO test load boards when first enter home page


describe("Testing for boards on Home Page", function(){
  // Log in
  before(function(done){
    agent
    .post('/auth/login')
    .send({ email : 'demo@demo.com', password: 'demo' })
    .end(function (error, response) {
      response.should.have.status(200);
      expect('Location', '/home');
      done();
    });
  });

  it('should successfully POST and return the details of the board inserted', function(done) {
    agent
      .post('/home/board')
      .send({
        'boardId': 1,
        'boardName':'New Board',
        'userId': 1
      })
      .end(function(error, response) {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('boardName');
        response.body.boardName.should.equal('New Board');
        response.body.should.have.property('userId');
        response.body.userId.should.equal(1);
        done();
      });
    });

    //duplicate board name for a user
    it('should fail to POST and return an error message (board already exists)', function(done){
      agent
        .post('/home/board')
        .send({
          'boardName': 'New Board',
          'userId': 1
        })
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('err');
          response.body.boardName.should.equal('Board Name (New Board) already exists. Enter another');
          done();
        })
    });

    //delete board
    // it ('should successfully DELETE a board', function(done){
    //   agent
    //     .delete('/home/board/1')
    //     .end(function(error, response){
    //       response.should.have.status(200);
    //       done();
    //     })
    // });


});
