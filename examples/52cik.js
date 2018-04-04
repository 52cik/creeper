const Creeper = require('..');

// GitHub Pages 搭建的博客，爬取略慢
const configs = {
  scanUrls: ['http://www.52cik.com'], // 入口页
  contentUrls: [/^http:\/\/www\.52cik\.com\/\d+\/\d+\/\d+\/[\w-]+\.html$/], // 内容页
  fields: [
    {
      name: 'title',
      alias: '标题',
      selector: '.article-title',
      required: true,
    },
    {
      name: 'time',
      alias: '时间',
      selector: 'time',
    },
    {
      name: 'lead',
      alias: '简要',
      selector($) {
        return $('meta[name=description]').prop('content');
      },
    },
    {
      name: 'content',
      alias: '内容',
      selector: '.article-entry',
      required: true,
    },
  ],
};

const creeper = new Creeper(configs);

// 字段过滤，比如时间转换，数据清洗，关键词替换
creeper.onExtractField = (field, data) => data.trim();

// 爬取结果回调
creeper.onResult = (page, data) => {
  console.log('===============================');
  console.log('url:', page.url);
  console.log('data:', data);
  console.log('===============================');
};

creeper.onExit = () => {
  console.timeEnd('爬取耗时');
  // 爬取耗时: 2228.279ms - 2018-04-04 23:23:27
};

console.time('爬取耗时');

// 开始
creeper.start();
