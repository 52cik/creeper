const { resolve } = require('url');
const got = require('got');

class Page {
  constructor(options = {}) {
    this.type = options.type;
    this.url = options.url;
    this.options = options.options;
    this.urlfix = options.urlfix === undefined; // url修复 默认 true

    // 跳过该地址
    this.skiped = !!options.skiped;
  }

  async fetch() {
    this.res = await got(this.url, this.options);
    this.body = this.res.body;
    if (this.urlfix) {
      this.fixurl(); // 修复url
    }
    return this;
  }

  // 修复 link img 地址
  fixurl() {
    this.body = this.body
      .replace(/(?<=(?:src|href)=")[^"]+/g, url => resolve(this.url, url));
  }

  // 自动发现地址
  autoFound(site) {
    const urls = this.body.match(/(?<=<a.+?href=['"])[^'"]+/g);
    if (!urls) {
      return;
    }
    urls.forEach((it) => {
      if (site.isContentPage(it)) {
        site.addUrl(it);
      }
    });
  }

  skip() {
    this.skiped = true;
  }
}

module.exports = Page;
