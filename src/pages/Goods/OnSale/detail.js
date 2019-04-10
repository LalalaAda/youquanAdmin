import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message, Input, Table, Card, Form, Select, Modal, Button, DatePicker } from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;

@Form.create()
class SearchForm extends PureComponent {
  render() {
    const { search, onSearch, form } = this.props;
    const { getFieldDecorator } = form;
    const onSubmit = e => {
      e.preventDefault();
      form.validateFields((err, values) => {
        if (!err) {
          onSearch(values);
        }
      });
    };
    return (
      <Form onSubmit={onSubmit} className={styles.form} layout="inline">
        <FormItem>
          {getFieldDecorator('num', {
            initialValue: search.num,
          })(<Input placeholder="充值单号" />)}
        </FormItem>
        <FormItem label="交易类型">
          {getFieldDecorator('type', {
            initialValue: search.type || 0,
          })(
            <Select style={{ minWidth: '140px' }}>
              <Option value={0}>全部</Option>
              <Option value={1}>预存款充值</Option>
              <Option value={2}>订单支出</Option>
              <Option value={3}>订单退款</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="交易时间">
          {getFieldDecorator('time', {
            initialValue: search.time || undefined,
          })(
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="YYYY-MM-DD HH:mm"
              placeholder={['开始时间', '结束时间']}
              label="交易时间"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" icon="search">
            搜索
          </Button>
        </FormItem>
      </Form>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ rcrecord, loading }) => ({
  rcrecord,
  loading: loading.models.rcrecord,
}))
@Form.create()
class RechargeRecord extends PureComponent {
  state = {
    modalVisible: false,
    currentItem: undefined,
    search: {
      num: undefined,
      type: 0,
      time: undefined,
    },
  };

  columns = [
    {
      title: '充值单号',
      dataIndex: 'num',
    },
    {
      title: '充值金额(元)',
      dataIndex: 'money',
      render: val => (val && val.toFixed(2)) || 0.00,
    },
    {
      title: '收款状态',
      dataIndex: 'status',
      render: val => (
        <span style={val ? { color: '#1890ff' } : { color: '#f5222d' }}>
          {val ? '已收到转账款项' : '未收到转账款项'}
        </span>
      ),
    },
    {
      title: '充值时间',
      dataIndex: 'ctime',
      // sorter: true,
      render: val => <span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '收款时间',
      dataIndex: 'gtime',
      render: val => <span>{moment.unix(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: val => {
        const updateStatusClick = () => {
          this.showModal(val);
        };

        const urlComp = !val.status ? (
          <span className={styles.linkbutton} onClick={updateStatusClick}>
            修改收款状态
          </span>
        ) : (
          '----------'
        );
        return <Fragment>{urlComp}</Fragment>;
      },
    },
  ];

  componentDidMount() {
    const {
      match: { params },
      dispatch,
    } = this.props;
    dispatch({
      type: 'rcrecord/fetchList',
      payload: { id: params.id },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        const { id, status } = values;
        dispatch({
          type: 'rcrecord/updateRechargeRecord',
          payload: { id, status },
          callback(flag) {
            if (flag) {
              message.success('更改成功');
              that.setState({ modalVisible: false });
            } else {
              message.error('更改失败');
            }
          },
        });
      }
    });
  };

  handleCancel = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      modalVisible: false,
    });
  };

  showModal = item => {
    this.setState({
      currentItem: item || {},
      modalVisible: true,
    });
  };

  render() {
    const { rcrecord, loading, dispatch, form } = this.props;
    const { search } = this.state;

    const changePage = (page, pageSize) => {
      const { num, type, time } = search;
      dispatch({
        type: 'rcrecord/fetchList',
        payload: {
          page,
          pageSize,
          num,
          type,
          time,
        },
      });
    };
    const changePageSize = (current, size) => {
      const { num, type, time } = search;
      dispatch({
        type: 'rcrecord/fetchList',
        payload: {
          page: current,
          pageSize: size,
          num,
          type,
          time,
        },
      });
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: rcrecord.pageSize || 20,
      total: rcrecord.total,
      current: rcrecord.currentPage || 0,
      onChange: changePage,
      onShowSizeChange: changePageSize,
    };

    const onSearch = values => {
      const { state } = this;
      this.setState({
        ...state,
        search: { ...values },
      });
      const { num, type, time } = values;
      dispatch({
        type: 'rcrecord/fetchList',
        payload: { num, type, time },
      });
    };

    const { modalVisible, currentItem } = this.state;
    const modalFooter = { okText: '确定', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    return (
      <div>
        <Card bordered={false}>
          <div className={styles.title}>
            <h2>商户预存款明细</h2>
          </div>
          <SearchForm search={search} onSearch={onSearch} />
          <Table
            rowKey={item => item.id}
            dataSource={rcrecord.list}
            columns={this.columns}
            loading={loading}
            pagination={paginationProps}
          />
        </Card>
        <Modal
          title="修改收款状态"
          width={640}
          destroyOnClose
          confirmLoading={loading}
          visible={modalVisible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="充值金额" {...formLayout}>
              {(currentItem && currentItem.money.toFixed(2)) || 0.0}元
            </FormItem>
            <FormItem label="充值时间" {...formLayout}>
              {(currentItem && moment.unix(currentItem.ctime).format('YYYY-MM-DD HH:mm')) ||
                '------'}
            </FormItem>
            <FormItem label="收款状态" {...formLayout}>
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择收款状态' }],
                initialValue: (currentItem && currentItem.status),
              })(
                <Select placeholder="请选择">
                  <Option value={1}>已收到转账款项</Option>
                  <Option value={0}>未收到转账款项</Option>
                </Select>
              )}
            </FormItem>
            {getFieldDecorator('id', {
              rule: [{ required: true }],
              initialValue: currentItem && currentItem.id,
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default RechargeRecord;
