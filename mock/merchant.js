/* eslint-disable no-param-reassign */
// import mockjs from 'mockjs';
// 得到两数之间随机整数
const getRandomInt = (min, max) => {
  const nmin = Math.ceil(min);
  const nmax = Math.floor(max);
  return Math.floor(Math.random() * (nmax - nmin)) + nmin; // 不含最大值，含最小值
}

const fetchList = (req, res) => {
  // console.log(req.query);
  const list = [
    {
      _id: 'asdasdas01',
      id: 'SH00001',
      name: '深圳中琛源科技股份有限公司',
      time: '1554645035',
    }
  ]
  res.send({
    list,
    total: list.length
  });
}

const addMerchant = (req, res) => {
  const flag = Math.round(Math.random());
  setTimeout(() => {
    res.send({
      rc: 0,
      status: flag ? 'ok' : 'fail'
    })
  }, 1000);
}

// 预存款充值
const merchantRecharge = (req, res) => {
  const flag = Math.round(Math.random());
  setTimeout(() => {
    res.send({
      rc: 0,
      status: flag ? 'ok' : 'fail'
    })
  }, 1000);
}
// 充值记录
const fetchRechargeRecord = (req, res) => {
  const obj = {
      id: 'SH00001',
      num: 'CZ12345671',
      money: 80000.00,
      status: 0,
      ctime: '1544790283',
      gtime: '1544790283'
  };
  const list = [];
  list.push(obj);
  for(let i=0; i<20; i+=1) {
    const nobj = {};
    nobj.id = `SH${getRandomInt(100000, 999999)}`;
    nobj.num = `CZ${getRandomInt(10000000, 99999999)}`;
    nobj.money = getRandomInt(0,10000000);
    nobj.status = Math.round(Math.random());
    nobj.ctime = `${getRandomInt(1540000000, 1545000000)}`;
    nobj.gtime = `${getRandomInt(1540000000, 1545000000)}`;
    list.push(nobj);
  }

  setTimeout(() => {
    res.send({
      status: 'ok',
      list,
      total: list.length,
      pageSize: 20,
      page: req.query.page || 1,
      query: req.query || {}
    });
  }, 1000);
}
const updateRecord = (req, res) => {
  const flag = Math.round(Math.random());
  res.send({
    status: flag?'ok': 'fail',
    body: req.body || {}
  });
}


module.exports.fetchList = fetchList;
module.exports.addMerchant = addMerchant;
module.exports.merchantRecharge = merchantRecharge;
module.exports.fetchRechargeRecord = fetchRechargeRecord;
module.exports.updateRecord = updateRecord;
