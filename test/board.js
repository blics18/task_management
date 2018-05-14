process.env.NODE_ENV = 'test';
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app');
var db = require('../models/index');

var expect = chai.expect;
var should = chai.should();

chai.use(chaiHttp);
var agent = chai.request.agent(app);

describe("Testing for categories and tasks on Board Page", function(){
  // Log in
  before(function(done){
    agent
    .post('/auth/login')
    .send({ email : 'demo@demo.com', password: 'demo' })
    .end(function (error, response) {
      response.should.have.status(200);
      expect('Location', '/home');
      db.sequelize.query('INSERT INTO boards ("boardName", "userId") VALUES (:boardName, :userId)', { replacements: { boardName: 'New Board', userId: 1}, type: db.sequelize.QueryTypes.INSERT})
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
  })

  it('should successfully GET and render page', function(done){
    agent
      .get('/board/New Board/board-id/2')
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.html;
        done();
      })
  });

  it('should successfully POST and return details of newly category added', function(done){
    agent
      .post('/board/2/category')
      .send({
        categoryTitle: "New Category"
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('categoryName');
        response.body.categoryName.should.equal("New Category");
        response.body.should.have.property('categoryId');
        response.body.categoryId.should.equal(1);
        response.body.should.have.property('boardId');
        response.body.boardId.should.equal(2);
        done();
      })
  });

  it('should fail POST and return error message (category already exists)', function(done){
    agent
      .post('/board/2/category')
      .send({
        categoryTitle: "New Category"
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('err');
        response.body.err.should.equal("Category Name (New Category) already exists. Enter another")
        done();
      })
  });

  it('should successfully GET and return categories for a board', function(done){
    agent
      .get('/board/2/categories')
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.be.a('object');
        response.body[0].should.have.property('categoryName');
        response.body[0].categoryName.should.equal('New Category');
        response.body[0].should.have.property('boardId');
        response.body[0].boardId.should.equal(2);
        response.body[0].should.have.property('categoryId');
        response.body[0].categoryId.should.equal(1);
        done();
      })
  });

  it('should successfully POST and return details of newly added task', function(done){
    agent
      .post('/board/2/category/1/task')
      .send({
        taskDescription: "New Task"
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('taskName');
        response.body.taskName.should.equal("New Task");
        response.body.should.have.property('taskId');
        response.body.taskId.should.equal(1);
        response.body.should.have.property('categoryId');
        response.body.categoryId.should.equal(1);
        done();
      })
  });

  it('should fail POST and return error message (task already exists)', function(done){
    agent
      .post('/board/2/category/1/task')
      .send({
        taskDescription: "New Task"
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('err');
        response.body.err.should.equal("Task (New Task) already exists. Enter another");
        done();
      })
  });

  it('should successfully POST task order', function(done){
    agent
      .post('/board/2/category/1/task/order')
      .send({
        array: ["New Task"]
      })
      .end(function(error, response){
        response.should.have.status(200);
        done();
      })
  })

  it('should successfully GET and return task order', function(done){
    agent
      .get('/board/2/category/1/task/load')
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('taskArray');
        response.body.taskArray.should.a('array');
        response.body.should.have.property('categoryId');
        response.body.categoryId.should.equal(1);
        done();
      })
  });

  it('should successfully GET and return details of task', function(done){
    agent
      .get('/board/2/category/1/task/New Task')
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('taskId');
        response.body.taskId.should.equal(1);
        response.body.should.have.property('taskName');
        response.body.taskName.should.equal("New Task");
        response.body.should.have.property('categoryId');
        response.body.categoryId.should.equal(1);
        done();
      })
  });

  it('should successfully PUT a new category title', function(done){
    agent
      .put('/board/2/category/1')
      .send({
        categoryTitle: "Category 1 Edited"
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('categoryName');
        response.body.categoryName.should.equal("Category 1 Edited");
        response.body.should.have.property('boardId');
        response.body.boardId.should.equal(2);
        response.body.should.have.property('categoryId');
        response.body.categoryId.should.equal(1);
        done();
      })
  });

  it('should fail PUT and return error message (category name already exists)', function(done){
    agent
      .put('/board/2/category/1')
      .send({
        categoryTitle: "Category 1 Edited"
      })
      .end(function(error, response){
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('err');
        response.body.err.should.equal("Category Name (Category 1 Edited) already exists. Enter another")
        done();
      })
  });

  it('should successfully DELETE a task from a category', function(done){
    agent
      .delete('/board/2/category/1/task/1')
      .end(function(error, response){
        response.should.have.status(200);
        done();
      })
  });

  it('should successfully DELETE a category', function(done){
    agent
      .delete('/board/2/category/1')
      .end(function(error, response){
        response.should.have.status(200);
        done();
      })
  });


})
