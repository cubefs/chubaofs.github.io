/**
 * 写日志
 */
const path = require('path');
const log4js = require('log4js');
// const config = require('config');
const _ = require('lodash');

const baseLogPath = path.resolve(__dirname, '../logs');
// 错误日志目录
const errorPath = '/error';
// 错误日志文件名
const errorFileName = 'error';
// 错误日志输出完整路径
const errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

// 响应日志目录
const responsePath = '/response';
// 响应日志文件名
const responseFileName = 'response';
// 响应日志输出完整路径
const responseLogPath = baseLogPath + responsePath + '/' + responseFileName;

// 加载配置文件
log4js.configure({
  appenders: {
    console: { type: 'console' },
    errorLogger: {
      'type': 'dateFile',
      'filename': errorLogPath,
      'pattern': '-yyyy-MM-dd.log',
      'path': errorPath,
      'alwaysIncludePattern': true
    },
    resLogger: {
      'type': 'dateFile',
      'filename': responseLogPath,
      'path': responsePath,
      'alwaysIncludePattern': true,
      'pattern': '-yyyy-MM-dd.log'
    }
  },
  categories: {
    errorLogger: {
      appenders: ['console', 'errorLogger'],
      level: 'ERROR'
    },
    resLogger: {
      appenders: ['console', 'resLogger'],
      level: 'ALL'
    },
    default: {
      appenders: ['console', 'resLogger'],
      level: 'ALL'
    }
  }
});

let errorLogger = log4js.getLogger('errorLogger');
let resLogger = log4js.getLogger('resLogger');

let logUtil = {
  error(error, req, resTime) {
    if (error) {
      if (typeof (error) === 'string') {
        errorLogger.error('***** node server error *****', error);
      } else {
        errorLogger.error(formatError(req, error, 'node', resTime));
      }
    }
  },

  res(ctx, resTime) {
    if (ctx) {
      resLogger.info(formatRes(ctx, resTime));
    }
  },

  info(key, info = '') {
    if (key) {
      resLogger.info(key, info);
    }
  }
};

// 格式化响应日志
let formatRes = function (req, resTime) {
  let logText = new String();

  // 响应日志开始
  logText += '\n' + '*************** response log start ***************' + '\n';

  // 添加请求日志
  logText += formatReqLog(req, resTime);

  // 响应状态码
  logText += 'response status: ' + req.status + '\n';

  // 响应内容
  logText += 'response body: ' + '\n' + JSON.stringify(req.body) + '\n';

  // 响应日志结束
  logText += '*************** response log end ***************' + '\n';
  // console.log(logText);
  return logText;
};

// 格式化错误日志
let formatError = function (req = {}, error = {}, type = 'node', resTime = 0) {
  let logText = new String();
  let err = type === 'h5' ? req.query : error;
  // 错误信息开始
  logText += '\n' + '***************  ' + type + ' error log start ***************' + '\n';
  // 添加请求日志
  if (!_.isEmpty(req)) {
    logText += formatReqLog(req);
  }
  if (type === 'h5') {
    // 用户信息
    if (err.userInfo) {
      logText += 'request user info:  ' + err.userInfo + '\n';
    }
    // 客户端渠道信息
    if (err.pageParams) {
      logText += 'request client channel info:  ' + err.pageParams + '\n';
    }
    // 客户端设备信息
    if (err.clientInfo) {
      logText += 'request mobile info:  ' + err.clientInfo + '\n';
    }
    // 报错位置
    logText += 'err line: ' + err.line + ', col: ' + err.col + '\n';
    // 错误信息
    logText += 'err message: ' + err.msg + '\n';
    // 错误页面
    logText += 'err url: ' + err.url + '\n';
  } else { // node server
    // 错误名称
    logText += 'err name: ' + error.name + '\n';
    // 错误信息
    logText += 'err message: ' + error.message + '\n';
    // 错误详情
    logText += 'err stack: ' + error.stack + '\n';
  }
  // 错误信息结束
  logText += '***************  ' + type + '  error log end ***************' + '\n';
  // console.error(logText);
  return logText;
};

// 格式化请求日志
let formatReqLog = function (req) {

  let logText = new String();
  let method = req.method;
  // 访问路径
  logText += 'request url: ' + req.url + '\n';
  // 访问方法
  logText += 'request method: ' + method + '\n';
  // 客户端ip
  logText += 'request client ip:  ' + req.ip + '\n';

  return logText;
};

module.exports = logUtil;
