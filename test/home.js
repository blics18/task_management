process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var db = require('../models/index');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);
var agent = chai.request.agent(app);

describe("Testing for boards on Home Page", function(){
  // Log in
  before(function(done){
    agent
    .post('/auth/login')
    .send({ email : 'demo@demo.com', password: 'demo' })
    .end(function (error, response) {
      response.should.have.status(200);
      expect('Location', '/home');
      db.sequelize.query('INSERT INTO boards ("boardName", "userId") VALUES (:boardName, :userId)', { replacements: { boardName: 'Copy Board', userId: 1}, type: db.sequelize.QueryTypes.INSERT})
      .then(function(boardResult){
      })
      .catch(function(error){
        return console.error(error);
      })
      done();
    });
  });

  after(function(done){
    db.sequelize.query('DELETE FROM boards', {type: db.sequelize.QueryTypes.DELETE})
    .then(function(result){
      done();
    })
    .catch(function(error){
      return console.error(error);
    })
  });


  //load boards when first enter home page
  it('should successfully GET and return boards in database', function(done){
    agent
      .get('/home')
      .send({
        'userId': 1
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.html;
        done();
      })
  })

  it('should successfully POST and return the details of the board inserted', function(done) {
    agent
      .post('/home/board')
      .send({
        'boardTitle':'New Board',
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
          'boardTitle': 'Copy Board',
          'userId': 1
        })
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('err');
          response.body.err.should.equal('Board Name (Copy Board) already exists. Enter another');
          done();
        })
    });


    //update board Title
    it('should successfully PUT and return new board title', function(done){
      agent
        .put('/home/board/1')
        .send({
          'userId': 1,
          'boardTitle' : 'New Copy Board'
        })
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('boardName');
          response.body.boardName.should.equal('New Copy Board');
          response.body.should.have.property('userId');
          response.body.userId.should.equal(1);
          response.body.should.have.property('boardId');
          response.body.boardId.should.equal(1);
          done();
        })
    });

    //update board title with duplicate title
    it('should fail to PUT and return error message (board already exists)', function(done){
      agent
        .put('/home/board/1')
        .send({
          'userId': 1,
          'boardTitle' : 'New Copy Board'
        })
        .end(function(error, response){
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('err');
          response.body.err.should.equal('Board Name (New Copy Board) already exists. Enter another');
          done();
        })
    });

    //delete board
    it ('should successfully DELETE a board', function(done){
      agent
        .delete('/home/board/1')
        .end(function(error, response){
          response.should.have.status(200);
          done();
        })
    });


});
