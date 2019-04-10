export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './User/Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/dashboard/index' },
      {
        path: '/dashboard',
        name: '仪表盘',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/index',
            name: '操作面板1',
            component: './Dashboard/index',
          },
        ],
      },
      {
        path: '/merchant',
        name: '商户管理',
        icon: 'form',
        routes: [
          { path: '/merchant/list', name: '商户列表', component: './Merchant/MerchantList/index' },
          {
            path: '/merchant/:id/record',
            name: '充值记录',
            hideInMenu: true,
            component: './Merchant/MerchantList/record',
          },
        ],
      },
      {
        path: '/goods',
        name: '商品管理',
        icon: 'form',
        routes: [
          { path: '/goods/onsale/list', name: '在售虚拟商品列表', component: './Goods/OnSale/index' },
          {
            path: '/goods/onsale/detail/:id',
            name: '详情',
            hideInMenu: true,
            component: './Goods/OnSale/detail',
          },
        ],
      },
      {
        path: '/exception',
        name: '错误',
        icon: 'warning',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
    ],
  },
];
