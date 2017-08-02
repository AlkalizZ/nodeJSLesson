var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');
var async = require('async');
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

        var conCurrencyCount = 0;

        async.mapLimit(topicUrls, 5, function(topicUrl, callback) {
            conCurrencyCount++;
            console.log('现在的并发数是：', conCurrencyCount, '，正在抓取的是:', topicUrl);

            superagent.get(topicUrl)
                .end(function(err, res) {
                    if (err) return err;
                    console.log('fetch ' + topicUrl + ' successful');
                    conCurrencyCount--;
                    callback(null, topicUrl + ' html content');
                });
        }, function(err, result) {
            console.log('final:');
            console.log(result);
            console.log('---------------------------end-------------------------');
        });

        // 重复监听topic_html事件topicUrls.length次（也就是40次）之后，执行回调函数
        // ep.after('topic_html', topicUrls.length, function(topics) {

        //     topics = topics.map(function(topicPair) {

        //         var topicUrl = topicPair[0],
        //             topicHtml = topicPair[1];
        //         var $ = cheerio.load(topicHtml);
        //         return ({
        //             title: $('.topic_full_title').text().trim(),
        //             href: topicUrl,
        //             comment1: $('.reply_content').eq(0).text().trim(),
        //         });
        //     });

        //     console.log('final:');
        //     console.log(topics);
        //     console.log('---------------------------end-------------------------');
        // });

        // topicUrls.forEach(function(topicUrl, index) {
        //     setTimeout(function() {

        //     }, 100 * index); // cnodejs对并发请求有限制，当发送请求超过一定速度会导致返回值为空或报错。所以这里降低点发送速度，不确定还能不能算得上是并发
        // });
    });


app.listen(3000, function() {
    console.log('running on 3000');
});