var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');

var cnodeUrl = 'https://cnodejs.org/';

var app = express();

// 用superagent去抓取https://cnodejs.org/的内容
superagent.get(cnodeUrl)
    .end(function(err, res) {

        // 常规的错误处理
        if (err) return console.error(err);

        var topicUrls = [];
        var $ = cheerio.load(res.text);

        // 获取首页所有的链接
        $('#topic_list .topic_title').each(function(index, elem) {
            var $elem = $(elem);

            // 使用url.resolve自动推断出完整url
            topicUrls.push(url.resolve(cnodeUrl, $elem.attr('href')));
        });


        var ep = new eventproxy();

        // 重复监听topic_html事件topicUrls.length次（也就是40次）之后，执行回调函数
        ep.after('topic_html', topicUrls.length, function(topics) {

            topics = topics.map(function(topicPair) {

                var topicUrl = topicPair[0],
                    topicHtml = topicPair[1];
                var $ = cheerio.load(topicHtml);
                return ({
                    title: $('.topic_full_title').text().trim(),
                    href: topicUrl,
                    comment1: $('.reply_content').eq(0).text().trim(),
                });
            });

            console.log('final:');
            console.log(topics);
            console.log('---------------------------end-------------------------');
        });

        topicUrls.forEach(function(topicUrl, index) {
            setTimeout(function() {
                superagent.get(topicUrl)
                    .end(function(err, res) {
                        if (err) return err;
                        console.log('fetch ' + topicUrl + ' successful');
                        ep.emit('topic_html', [topicUrl, res.text]);
                    });
            }, 100 * index);
        });
    });


app.listen(3000, function() {
    console.log('running on 3000');
});