const Page = require('./page');
const { version, homepage } = require('../package');

class Site {
  constructor(options = {}) {
    this.userAgent = `Creeper/${version}(+${homepage})`;
    this.scanUrls = []; // 入口页
    this.contentUrls = []; // 详情页
    this.options = options;
    // 添加入口页面
    options.scanUrls.forEach(url => this.addScanUrl(url));
  }

  // 添加入口页
  addScanUrl(url, options = {}) {
    this.addUserAgent(options);
    this.scanUrls.push(new Page({
      type: 'scan',
      url,
      options,
    }));
  }

  // 添加内容页
  addUrl(url, options = {}) {
    this.addUserAgent(options);
    this.contentUrls.push(new Page({
      type: 'content',
      url,
      options,
      // skiped: false, // 是否忽略
    }));
  }

  // 添加 ua
  addUserAgent(options) {
    const headers = Object.assign({
      'user-agent': this.userAgent,
    }, options.headers);
    options.headers = headers;
  }

  // 是否内容页
  isContentPage(url) {
    for (const re of this.options.contentUrls) {
      if (re.test(url)) {
        return true;
      }
    }
    return false;
  }
}

module.exports = Site;
