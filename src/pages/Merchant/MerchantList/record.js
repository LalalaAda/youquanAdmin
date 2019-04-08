import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { message, Input, Table, Card, Form, Select, Modal } from 'antd';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ rcrecord, loading }) => ({
  rcrecord,
  loading: loading.models.rclist,
}))
@Form.create()
class RechargeRecord extends PureComponent {
  state = {
    modalVisible: false,
    
    currentItem: undefined,
    search: {
      num: undefined,
      type: undefined,
      time: undefined,
    },
  };

  columns = [
    {
      title: '充值单号',
      dataIndex: 'num',
    },
    {
      title: '充值金额',
      dataIndex: 'money',
    },
    {
      title: '收款状态',
      dataIndex: 'status',
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
        
        const urlComp = val.status==="0" ? (
          <span className={styles.linkbutton} onClick={()=>updateStatusClick}>修改收款状态</span>
        ) : (
          "----------"
        );
        return (
          <Fragment>
            {urlComp}
          </Fragment>
        );
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
    const { search } = this.state;
    const { num, type, time } = search;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        const { id, status } = values;
        dispatch({
          type: 'rcrecord/updateRecordStatus',
          payload: { id, status },
          callback(flag) {
            if (flag) {
              message.success('成功添加');
              that.setState({ modalVisible: false });
              dispatch({
                type: 'rcrecord/fetchList',
                payload: { num, type, time },
              });
            } else {
              message.error('添加失败');
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
    const { num, type, time } = this.state;

    const changePage = (page, pageSize) => {
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

    const searchList = () => {
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
          <div className={styles.form}>
            {/* TODO 填充搜索 */}
          </div>
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
              {currentItem&&currentItem.money || 0}元
            </FormItem>
            <FormItem label="充值时间" {...formLayout}>
              {currentItem&&currentItem.time || "------"}
            </FormItem>
            <FormItem label="收款状态" {...formLayout}>
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择收款状态' }],
                initialValue: currentItem&&currentItem.status || undefined
              })(
                <Select placeholder="请选择">
                  <Option value="1">已收到转账款项</Option>
                  <Option value="0">未收到转账款项</Option>
                </Select>
              )}
            </FormItem>
            {getFieldDecorator('id', {
              rule: [{ required: true }],
              initialValue: currentItem&&currentItem.id,
            })(<Input type="hidden" />)}
          </Form>
        </Modal>
      </div>
    );
  }
}

export default RechargeRecord;
