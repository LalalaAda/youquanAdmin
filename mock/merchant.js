// import mockjs from 'mockjs';

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


const merchantRecharge = (req, res) => {
  const flag = Math.round(Math.random());
  setTimeout(() => {
    res.send({
      rc: 0,
      status: flag ? 'ok' : 'fail'
    })
  }, 1000);
}


module.exports.fetchList = fetchList;
module.exports.addMerchant = addMerchant;
module.exports.merchantRecharge = merchantRecharge;