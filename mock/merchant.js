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

module.exports.fetchList = fetchList;