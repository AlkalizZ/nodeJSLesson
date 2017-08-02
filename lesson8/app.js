var express = require('express');

var fibonacci = function(n) {
    if (typeof n !== 'number' || isNaN(n)) throw new Error('n should be a Number');
    if (n < 0) throw new Error('n should >= 0');
    if (n > 10) throw new Error('n should <= 10');

    if (n === 0) return 0;
    if (n === 1) return 1;

    return fibonacci(n - 1) + fibonacci(n - 2);
};

var app = express();
app.get('/fib', function(req, res) {
    // http传来的东西默认都是没有类型的，都是String，所以我们要手动转换类型
    var n = Number(req.query.n);
    try {
        // 为何使用String做类型转换，是因为如果你直接给个数字给res.send的话，
        // 它会当成是你给了它一个http状态码，所以我们明确给String
        res.send(String(fibonacci(n)));
    } catch (e) {
        // 如果fibonacci抛错的话，错误信息会记录在err对象的message属性中。
        res.status(500).send(e.message);
    }
});

// 暴露 app 出去。 module.exports和exports的区别详见《深入浅出NodeJs》
module.exports = app;
app.listen(3000, function() {
    console.log('app is listening at port 3000');
});