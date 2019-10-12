var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET News list. */
router.get('/api/content/getNewsList', function(req, res, next) {
  var file = path.join(__dirname, '../data/newsList.json');
  // 读取json文件
  fs.readFile(file, 'utf-8', function(err, data) {
    if (err) {
      res.send({
        data: {
          state: 'failure',
          message: err.message
        }
      });
    } else {
      res.send(JSON.parse(data));
    }
  });
});

/* GET News detail. */
router.get('/api/content/getNewsDetail', function(req, res, next) {
  // 获取返回的url对象的query属性值
  var arg = url.parse(req.url).query;

  // 将arg参数字符串反序列化为一个对象
  var params = querystring.parse(arg);

  // 读取json文件
  var file = path.join(__dirname, '../data/newsDetails/' + params.id + '.json');
  fs.readFile(file, 'utf-8', function(err, data) {
    if (err) {
      res.send({
        data: {
          state: 'failure',
          message: err.message
        }
      });
    } else {
      res.send(JSON.parse(data));
    }
  });
});

module.exports = router;
