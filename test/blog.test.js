require('should');

const app = require('../app');
const supertest = require('supertest');
const request = supertest(app);

describe('测试Blog的相关接口 routes/blog/index.js', () => {
  it('queryAll interface return code should be 2000', (done) => {

    request.get('/blog/queryAll')
      .query()
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.body.code.should.equal(2000);
        done();
      });
  });

  it('queryByTitleId should return code 2000 when titleId===2', (done) => {

    request.get('/blog/queryByTitleId')
      .query({titleId: 2})
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.body.code.should.equal(2000);
        done();
      });
  });
});
