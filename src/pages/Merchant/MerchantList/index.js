import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Input,Table, Card, Button, Divider } from 'antd';

import styles from './index.less';


const {Search} = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ mclist, loading }) => ({
  mclist,
  loading: loading.models.mclist,
}))
class MerchantList extends PureComponent {
  state = {};
  
  columns = [
    {
      title: '商户编号',
      dataIndex: 'id',
    },
    {
      title: '商户名称',
      dataIndex: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'time',
      // sorter: true,
      render: val => <span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: () => (
        <Fragment>
          <span>预存款充值</span>
          <Divider type="vertical" />
          <span href="">充值记录</span>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mclist/fetchList',
    });
  }

  render() {
    
    const {
      mclist,
      loading,
      dispatch
    } = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 20,
      total: mclist.total,
    };
    
    const searchList = value => {
      const payload = value? {name: value} : undefined;
      dispatch({
        type: 'mclist/fetchList',
        payload
      });
    }

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.title}>
            <h2>商户列表</h2>
            <Button icon="plus" type="primary" className={styles.buttonDiv}>
              新建
            </Button>
          </div>
          <div className={styles.form}>
            <Search
              className={styles.search}
              placeholder="商户编号/商户名称"
              enterButton="搜索"
              size="default"
              onSearch={value => searchList(value)}
            />
          </div>
          <Table
            // eslint-disable-next-line no-underscore-dangle
            rowKey={item => item._id}
            dataSource={mclist.list}
            columns={this.columns}
            loading={loading}
            pagination={paginationProps}
          />
        </Card>
      </div>
    );
  }
}

export default MerchantList;
