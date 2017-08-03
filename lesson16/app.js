var express = require('express');
var cookieParser = require('cookie-parser');
var utility = require('utility');
var session = require('express-session');

var app = express();
app.listen(3000, function() {
    console.log('listening');
});

// 使用 cookiePareser 中间件，cookieParser(secret, options)
// 其中 secret 用来加密 cookie 字符串（下面会提到 signedCookies）
// options 传入上面介绍的 cookie 可选参数
app.use(cookieParser());

// 设置session的可选参数
// app.use(session({
//     secret: 'recommand 128 bytes random string', // 建议使用128个字符的随机字符串
// }));

var md5IsVisit = utility.sha1('isVisit');

app.get('/', function(req, res) {
    // 如果 cookie 存在则输出cookie，否则设置cookie并设置过期时间为1分钟
    if (req.cookies[md5IsVisit]) {
        var count = parseInt(req.cookies[md5IsVisit], 10) + 1;
        console.log(count);
        res.cookie(md5IsVisit, count, { maxAge: 60 * 1000 });
        res.send('这是第' + count + '次访问');
    } else {
        res.cookie(md5IsVisit, 1, { maxAge: 60 * 1000 });
        res.send('这是第1次访问');
    }
});

// app.get('/', function(req, res) {
//     // 检查session中的isVisit字段
//     // 如果存在则增加一次，否则为session设置isVisit字段，并初始化为1.
//     if (req.session[md5IsVisit]) {
//         req.session[md5IsVisit]++;
//         res.send('这是第' + req.session[md5IsVisit] + '次访问');
//     } else {
//         req.session[md5IsVisit] = 1;
//         res.send('这是第1次访问');
//     }
// });