var Benchmark = require('benchmark');
var suite = new Benchmark.Suite;

var ini1 = function(str) {
    return +str;
}
var int2 = function(str) {
    return parseInt(str, 10);
}
var int3 = function(str) {
    return Number(str);
}

var number = '100';

// 添加测试
suite
    .add('+', function() {
        ini1(number);
    })
    .add('parseInt', function() {
        ini2(number);
    })
    .add('Number', function() {
        ini3(number);
    })
    // 每个测试跑完后，输出信息
    .on('cycle', function(event) {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('Fastest is ', this.filter('fastest').map('name'));
    })
    // run async
    .run({ 'async': true });