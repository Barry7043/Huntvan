var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../testindex');
var should = chai.should();

chai.use(chaiHttp);


describe('login', function() {
    // tests associated with Users
    this.timeout(10000);
    it('login information check', function(done) {
        chai.request(server).post('/login').send({'email':'1','password':'2'})
            .end(function(error,res){
                res.should.have.status(200);

                res.should.be.json;
                res.body[0].email.should.equal('1');
                res.body[0].password.should.equal('2');
                done();
            });
    });
});

describe('register', function() {
    // tests associated with Users
    this.timeout(10000);
    it('should add one user on POST requset for /register', function(done) {
        chai.request(server).post('/register').send({'name':'1','email':'2','password':'3','password2':'4'})
            .end(function(error,res){
                res.should.have.status(200);

                res.should.be.json;
                res.body.should.be.an('array');
                res.body[0].name.should.equal('1');
                res.body[0].email.should.equal('2');
                res.body[0].password.should.equal('3');
                res.body[0].password2.should.equal('4');
                done();
            });
    });
});

describe('postitem/deleteitem/popup', function() {
    // tests associated with Users
    this.timeout(10000);
    it('popuptest value', function(done) {
        chai.request(server).post('/popup').send({'postid':'1','comment_email':'email'})
            .end(function(error,res){
                res.should.have.status(200);

                res.should.be.json;
                res.body.should.be.an('array');
                res.body[0].postid.should.equal('1');
                res.body[0].comment_email.should.equal('email');

                done();
            });
    });
    it('postitem value test', function(done) {
        chai.request(server).post('/postitem').send({'username':'1', 'title':'2', 'post_text':'3',
        'place':'4', 'budget':'5', 'email':'6',  'icon':'9'})
            .end(function(error,res){
                res.should.have.status(200);

                //res.should.be.json;
                //res.should.be.a('array');
                res.body[0].username.should.equal('1');
                res.body[0].title.should.equal('2');
                res.body[0].post_text.should.equal('3');
                res.body[0].place.should.equal('4');
                res.body[0].budget.should.equal('5');
                res.body[0].email.should.equal('6');
                res.body[0].icon.should.equal('9');


                done();
            });
    });



});

describe('comment/likes/follow', function() {
    // tests associated with Users
    this.timeout(10000);
    it('comment test', function(done) {
        chai.request(server).post('/commend').send({'postid':'1','comment_email':'2','countheart':'4','likes':'5'})
            .end(function(error,res){
                res.should.have.status(200);

                res.should.be.json;
                res.body.should.be.an('array');
                res.body[0].postid.should.equal('1');
                res.body[0].comment_email.should.equal('2');
                res.body[0].countheart.should.equal('4');
                res.body[0].likes.should.equal('5');
                done();
            });
    });
    it('likes test', function(done) {
        chai.request(server).post('/like').send({'postid':'1','likes':'5'})
            .end(function(error,res){
                res.should.have.status(200);

                res.should.be.json;
                res.body.should.be.an('array');
                res.body[0].postid.should.equal('1');
                res.body[0].likes.should.equal('5');
                done();
            });
    });
    it('follow test', function(done) {
        chai.request(server).post('/follow').send({'femail':'1','uemail':'2','username':'3'})
            .end(function(error,res){
                res.should.have.status(200);

                res.should.be.json;
                res.body.should.be.an('array');
                res.body[0].femail.should.equal('1');
                res.body[0].uemail.should.equal('2');
                  res.body[0].username.should.equal('3');
                done();
            });
    });
});
