const cheerio = require('cheerio');
const pLimit = require('p-limit');
const Site = require('./site');

class Creeper {
  constructor(options = {}) {
    options.scanUrls = options.scanUrls || [];
    options.contentUrls = options.contentUrls || [];
    this.options = options;
    this.autoFindUrls = options.autoFindUrls === undefined; // 自动发现地址 默认true
    this.site = new Site(options);
    this.limit = pLimit(options.limit || 10); // 并发控制 10
  }

  start() {
    this.init();
  }

  init() {
    this.onInit(this.site);
    this.initTask();
  }

  async initTask() {
    const { site } = this;
    try {
      for (const scan of site.scanUrls) {
        const scanPage = await scan.fetch();
        this.onScanPage(scanPage, scanPage.body, site);

        if (this.autoFindUrls) {
          scanPage.autoFound(site); // 自动发现url
        }

        let countContent = 0; // 内容页计数器
        const tasks = site.contentUrls
          .filter(({ url }) => site.isContentPage(url))
          .map(content => this.limit(async () => {
            const contentPage = await content.fetch();
            this.onContentPage(contentPage, contentPage.body, site);

            if (contentPage.skiped) {
              return; // 跳过
            }

            // 提取数据
            const data = this.extract(contentPage, countContent++);

            if (contentPage.skiped) {
              return; // 跳过
            }

            this.onResult(contentPage, data, site);
          }));

        await Promise.all(tasks); // 并发控制抓取
      }

      this.onExit(site); // 爬取完毕退出
    } catch (error) {
      this.onError(error, site);
    }
  }

  // 提取字段
  extract(page, index) {
    const $ = cheerio.load(page.body, { decodeEntities: false });
    const data = {};

    for (const field of this.options.fields) {
      let fieldData; // 字段数据

      if (typeof field.selector === 'string') {
        // jquery 选择器字符串
        if (field.type === 'text' || field.type === 'txt') {
          fieldData = $(field.selector).text();
        } else if (field.type === 'value') {
          fieldData = $(field.selector).text();
        } else {
          fieldData = $(field.selector).html();
        }
      } else if (typeof field.selector === 'function') {
        // 自定义函数
        fieldData = field.selector($);
      }

      // 字段回调处理
      data[field.name] = this.onExtractField(field.name, fieldData, page, this.site, index);

      if (field.required && !data[field.name]) {
        page.skiped = true; // 如果是必须抓取字段，抓取不到就放弃该页面
        return data;
      }
    }

    return data;
  }

  // 退出脚本
  exit() {
    process.exit();
  }

  /* eslint-disable */
  onInit(site) {} // 初始化回调
  onScanPage(page, content, site) {} // 入口页下载完成回调
  onContentPage(page, content, site) {} // 内容页面下载完成回调 (可以修改 page.body 给后续提取)
  onExtractField(field, data, page, site, index) {} // 字段提取回调
  onResult(page, data, site) {} // 输出结果回调
  onExit(site) {} // 退出爬虫
  onError(error, site) {} // 退出爬虫
  /* eslint-enable */
}

module.exports = Creeper;
