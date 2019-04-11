/* eslint-disable no-param-reassign */
// import mockjs from 'mockjs';
// 得到两数之间随机整数
const getRandomInt = (min, max) => {
  const nmin = Math.ceil(min);
  const nmax = Math.floor(max);
  return Math.floor(Math.random() * (nmax - nmin)) + nmin; // 不含最大值，含最小值
}

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];

// 在售虚拟商品列表
const fetchOnSaleList = (req, res) => {
  const obj = {
      id: 'KQ000001',
      suppiler: 1,  // 1'流量贝贝' 2拉卡拉
      synum: 'P123456789',
      lgnum: 'KQ000001',
      name: '50元话费',
      src: covers[(getRandomInt(0,4))],
      type: 1, // 1直 2非直
      cprice: 45.25,
      sprice: 50.22,
      inventory: 80000,
  };
  const list = [];
  list.push(obj);
  for(let i=0; i<50; i+=1) {
    const nobj = {};
    nobj.id = `KQ${getRandomInt(100000, 999999)}`;
    nobj.suppiler = getRandomInt(1, 3);
    nobj.synum = `P${getRandomInt(100000001, 999999999)}`;
    nobj.lgnum = `KQ${getRandomInt(100000, 999999)}`;
    nobj.name = '花费大师的话';
    nobj.src = covers[(getRandomInt(0,4))];
    nobj.type = getRandomInt(1,3);
    nobj.cprice = getRandomInt(100, 999);
    nobj.sprice = getRandomInt(100, 999);
    nobj.inventory = getRandomInt(10000, 99999);
    list.push(nobj);
  }

  setTimeout(() => {
    res.send({
      status: 'ok',
      list,
      total: list.length,
      pageSize: 50,
      currentPage: req.query.page || 1,
      query: req.query || {}
    });
  }, 1000);
}

const changeOnSalePrice = (req, res) => {
  const flag = Math.round(Math.random());
  res.send({
    status: flag?'ok': 'fail',
    body: req.body || {}
  });
}

const updateOnSale = (req, res) => {
  const flag = Math.round(Math.random());
  res.send({
    status: flag?'ok': 'fail',
    body: req.body || {}
  });
}

const fetchOnSaleDetail = (req, res) => {
  res.send({
    status: 'ok',
    list: [],
  });
}

module.exports.fetchOnSaleList = fetchOnSaleList;
module.exports.changeOnSalePrice = changeOnSalePrice;
module.exports.updateOnSale = updateOnSale;
module.exports.fetchOnSaleDetail = fetchOnSaleDetail;
