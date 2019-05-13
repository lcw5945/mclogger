const chalk = require("chalk");

let level = 1;
let setting = {
  loglevel: 1,
  showTime: false
};

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
  config(ops /** loglevel:debug,log,warn,error; showTime: boolean **/) {
    if (ops.loglevel) {
      switch (ops.loglevel) {
        case "debug":
          setting.loglevel = 1;
          break;
        case "log":
          setting.loglevel = 2;
          break;
        case "warn":
          setting.loglevel = 3;
          break;
        case "error":
          setting.loglevel = 4;
          break;
      }
    }

    setting.showTime = ops.showTime || false;
  },
  debug(...msg) {
    level = 1;
    this._consolePrint("log", msg);
  },

  log(...msg) {
    level = 2;
    this._consolePrint("log", msg);
  },

  warn(...msg) {
    level = 3;
    this._consolePrint("warn", msg);
  },

  error(...msg) {
    level = 4;
    this._consolePrint("error", msg);
  },
  /**
   * 打印输出
   **/
  _consolePrint(type, msg) {
    if (level < setting.loglevel) return;
    const fn = console[type];
    let output = this._formatMsg(type, msg);
    if (fn) {
      fn.apply(console, output);
    }
  },
  _getTime() {
    let d = new Date();
    return chalk.green(gmtime(d));
  },
  _formatMsg(type, msg) {
    let tempMsg;
    if (type == "log") {
      tempMsg = "[" + chalk.blue(type) + "] > ";
    } else if (type == "warn") {
      tempMsg = "[" + chalk.yellow(type) + "] > ";
    } else if (type == "error") {
      tempMsg = "[" + chalk.red(type) + "] > ";
    }
    if (setting.showTime) {
      tempMsg = `${this._getTime()}: ${tempMsg}`;
    }
    msg.unshift(tempMsg);
    return msg;
  }
};
