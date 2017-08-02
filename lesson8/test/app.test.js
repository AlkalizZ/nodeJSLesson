var app = require('../app');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');

describe('test/app.test.js', function() {
    // 第一个测试用例
    it('should return 55 when n is 10', function(done) {
        // 之所以这个function要接受一个 done 函数，是因为测试内容涉及了异步调用，而 mocha 是无法感知异步调用完成的。
        // 所以我们要主动接受它提供的 done 函数，在测试完毕时，自行调用一下，以示结束。
        // mocha 可以感知到我们的测试函数是否接受 done 参数。JS中，function对象是有长度的，它的长度由它的参数决定
        // (function(a, b, c, d){}).length === 4
        // 所以 mocha 通过我们的测试函数长度就可以确定我们是否是异步测试

        request.get('/fib')
            // .query方法用来传 queryString .send方法用来传 body。
            // 它们都可以传 Object 对象进去。
            // 在这里，我们等于访问的是 /fib?n=10
            .query({ n: 10 })
            .end(function(err, res) {
                // 由于 http 返回的是 String, 所以我要传入’55‘。
                res.text.should.equal('55');

                should.not.exist(err);
                res.text.should.equal('55');
                done(err);
            });
    });

    // 对各种边界条件进行测试
    var testFib = function(n, statusCode, expect, done) {
        request.get('/fib')
            .query({ n: n })
            .expect(statusCode)
            .end(function(err, res) {
                should.not.exist(err);
                res.text.should.equal(expect);
                done(err);
            });
    };

    it('should return 0 when n === 0', function(done) {
        testFib(0, 200, '0', done);
    });
    it('should return 1 when n === 1', function(done) {
        testFib(1, 200, '1', done);
    });
    it('should return 55 when n === 10', function(done) {
        testFib(10, 200, '55', done);
    });
    it('should throw err when n > 10', function(done) {
        testFib(110, 500, 'n should <= 10', done);
    });
    it('should throw err when n < 10', function(done) {
        testFib(-1, 500, 'n should >= 0', done);
    });
    it('should throw err when n isnt Number', function(done) {
        testFib(undefined, 500, 'n should be a Number', done);
    });

    // 单独测试一下返回码500
    it('should status 500 when err', function(done) {
        request.get('/fib')
            .query({ n: 100 })
            .expect(500)
            .end(function(err, res) {
                should.not.exist(err);
                res.text.should.equal('n should <= 10');
                done(err);
            });
    });
});