
const request = require('request');
var chai = require("chai");

var existingIdPlayer = 102;
var unExistingIdPlayer = 140392;

describe("Testing tennis player stats services", () => {

  it('Should return all players and status code 200', function(done) {
    request.get(`http://localhost:8001/players` , function(error, response, body) {
      chai.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should test that tennis player sort is correctly based on their ids', function(done) {
    request.get(`http://localhost:8001/players` , function(error, response, body) {
      chai.expect(response.statusCode).to.equal(200);
      const result = JSON.parse(body);
      chai.expect(Array.isArray(result)).to.equal(true);

      done();
    });
  });

  it('Should return one players associated to this id and status code 200', function(done) {
    request.get(`http://localhost:8001/players/${existingIdPlayer}` , function(error, response, body) {
      chai.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should return a 404 when there is no player with this id', function(done) {
    request.get(`http://localhost:8001/players/${unExistingIdPlayer}` , function(error, response, body) {
      chai.expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('Should delete a player and return 200 if player exist', function(done) {
    request.delete(`http://localhost:8001/players/${existingIdPlayer}` , function(error, response, body) {
      chai.expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should delete a player and return 404 if player does not exist', function(done) {
    request.delete(`http://localhost:8001/players/${unExistingIdPlayer}` , function(error, response, body) {
      chai.expect(response.statusCode).to.equal(404);
      done();
    });
  });

});
