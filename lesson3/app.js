var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function(req, res, next) {

    // 用superagent去抓取https://cnodejs.org/的内容
    superagent.get('https://cnodejs.org/')
        .end(function(err, sres) {

            // 常规的错误处理
            if (err) return next(err);

            // sres.text里面存着存储网页的HTML内容，将它传给cheerio.load之后

            var $ = cheerio.load(sres.text);
            var items = [];
            $('#topic_list .cell').each(function(index, elem) {
                var $elem = $(elem),
                    data = {},
                    _elem = $elem.find('.topic_title');

                data.author = $elem.find('.user_avatar img').attr('title');
                data.title = _elem.attr('title');
                data.href = _elem.attr('href');

                items.push(data);
            });

            res.send(items);
        });
});

app.listen(3000, function() {
    console.log('running on 3000');
});