const chalk = require("chalk");

Date.prototype.UTCformat = function(fmt) {
  const o = {
    "M+": this.getUTCMonth() + 1, // 月份
    "d+": this.getUTCDate(), // 日
    "h+": this.getUTCHours(), // 小时
    "m+": this.getUTCMinutes(), // 分
    "s+": this.getUTCSeconds(), // 秒
    "q+": Math.floor((this.getUTCMonth() + 3) / 3), // 季度
    S: this.getUTCMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${this.getFullYear()}`.substr(4 - RegExp.$1.length)
    );
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  }
  return fmt;
};

function gmtime(d, fmt = "yyyy-MM-dd hh:mm:ss") {
  const date = d || new Date();
  return date.UTCformat(fmt);
}

module.exports = {
  debug(...msg) {
    this._consolePrint("log", msg);
  },

  log(...msg) {
    this._consolePrint("log", msg);
  },

  warn(...msg) {
    this._consolePrint("warn", msg);
  },

  error(...msg) {
    this._consolePrint("error", msg);
  },
  /**
   * 打印输出
   **/
  _consolePrint(type, msg) {
    const fn = console[type];
    let output = this._formatMsg(type, msg);
    if (fn) {
      fn.apply(console, output);
    }
  },
  _getTime() {
    let d = new Date();
    return chalk.green(gmtime(d));
    // return chalk.green(
    //   String(d.getHours()) +
    //     ":" +
    //     String(d.getMinutes()) +
    //     ":" +
    //     String(d.getSeconds())
    // );
  },
  _formatMsg(type, msg) {
    let tempMsg;
    if (type == "log") {
      tempMsg = this._getTime() + " [" + chalk.blue(type) + "] > ";
    } else if (type == "warn") {
      tempMsg = this._getTime() + " [" + chalk.yellow(type) + "] > ";
    } else if (type == "error") {
      tempMsg = this._getTime() + " [" + chalk.red(type) + "] > ";
    }
    msg.unshift(tempMsg);
    return msg;
  }
};
