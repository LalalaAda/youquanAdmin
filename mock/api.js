import mockjs from 'mockjs';
import { delay } from 'roadhog-api-doc';
import * as merchant from './merchant';
import * as goods from './goods';

const proxy = {
  // 使用 mockjs 等三方库
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 50, 'type|0-2': 1 }],
  }),
  'POST /api/login/account': (req, res) => {
    const { password, userName, type } = req.body;
    if (password === '123456' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'GET /api/user/users': (req, res) => {
    res.send({
      status: "ok"
    });
  },
  'GET /api/user/currentuser': (req, res) => {
    res.send({
      status: "ok",
      currentUser: {
        avatar: "https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png",
        name: "admin"
      }
    });
  },



  //  商户管理
  'GET /api/merchant/list': (req, res) => {
    return merchant.fetchList(req, res);
  },
  'POST /api/merchant/addmerchant': (req, res) => {
    return merchant.addMerchant(req, res);
  },
  'POST /api/merchant/merchantrecharge': (req, res) => {
    return merchant.merchantRecharge(req, res);
  },
  'GET /api/merchant/rechargerecord': (req, res) => {
    return merchant.fetchRechargeRecord(req, res);
  },
  'POST /api/merchant/updaterecord': (req, res) => {
    return merchant.updateRecord(req, res);
  },

  // 商品管理
  'GET /api/goods/onsale/list': (req, res) => {
    return goods.fetchOnSaleList(req, res);
  },
  'POST /api/goods/onsale/detail': (req, res) => {
    return goods.fetchOnSaleDetail(req, res);
  },
  'POST /api/goods/onsale/changeprice': (req, res) => {
    return goods.changeOnSalePrice(req, res);
  },
  'POST /api/goods/onsale/update': (req, res) => {
    return goods.updateOnSale(req, res);
  },
  'POST /api/uploadimg': (req, res) => {
    res.send({
      status: 'ok',
      url: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png'
    })
  }
};

export default delay(proxy, 1000);