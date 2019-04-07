// ref: https://umijs.org/config/
import { primaryColor } from '../src/defaultSettings';

import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';


export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: {
          hmr: true,
        },
        locale: {
          default: 'zh-CN'
        },
        targets: {
          ie: 11,
        },
        dynamicImport: {
          loadingComponent: './components/PageLoading/index',
          webpackChunkName: true,
          level: 3,
        },
      },
    ],
  ],
  targets: {
    ie: 11,
  },

  /**
   * 路由相关配置
   */
  routes: pageRoutes,
  disableRedirectHoist: true,

  /**
   * webpack 相关配置
   */
  define: {
    APP_TYPE: process.env.APP_TYPE || '',
  },

  //  配置代理
  proxy: {
    '/api': {
      target: 'http://172.16.4.195:7300',
      changeOrigin: true,
      pathRewrite: { '^/api': '/mock/5ca452f665c61041ac3dea4f/api/api' },
    },
  },
  
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },

  // chainWebpack: webpackPlugin,
};
