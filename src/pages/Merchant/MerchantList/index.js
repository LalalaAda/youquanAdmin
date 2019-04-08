import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {message, Input, Table, Card, Button, Divider, Form, Select, Modal } from 'antd';
import Link from 'umi/link';
import { checkStrLength } from '@/utils/utils';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;
const { Search } = Input;

/* eslint react/no-multi-comp:0 */
@connect(({ mclist, loading }) => ({
  mclist,
  loading: loading.models.mclist,
}))
@Form.create()
class MerchantList extends PureComponent {
  state = {
    modalType: '',
    modalTitle: '创建商户',
    modalVisible: false,
    currentId: undefined,
  };

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
      render: val => {
        const rechargeClick = () => {
          this.showModal('recharge', val.id);
        };
        const createLinkButton = (text, clickFnc) => {
          if (clickFnc && typeof clickFnc === 'function') {
            return (
              <span className={styles.linkbutton} onClick={clickFnc}>
                {text}
              </span>
            );
          }
          return <span className={styles.linkbutton}>{text}</span>;
        };
        // eslint-disable-next-line no-underscore-dangle
        const urlComp = val ? (
          <Link to={`/merchant/${val.id}/record`}>充值记录</Link>
        ) : (
          createLinkButton('充值记录')
        );
        return (
          <Fragment>
            {createLinkButton('预存款充值', rechargeClick)}
            <Divider type="vertical" />
            {urlComp}
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'mclist/fetchList',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { modalType } = this.state;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        const {name} = values;
        const {id, money, status} = values;
        if(modalType==="create"){
          dispatch({
            type: 'mclist/addMerchant',
            payload: {name},
            callback(flag){
              if(flag){
                message.success('成功添加');
                that.setState({modalVisible: false});
                dispatch({
                  type: 'mclist/fetchList',
                });
              }else{
                message.error('添加失败');
              }
            }
          });
        }else{
          dispatch({
            type: 'mclist/merchantRecharge',
            payload: {id, money, status},
            callback(flag){
              if(flag){
                message.success('充值成功');
                that.setState({modalVisible: false});
              }else{
                message.error('充值失败');
              }
            }
          });
        }
      }
    });
  };

  handleCancel = () => {
    const {form} = this.props;
    form.resetFields();
    this.setState({
      modalVisible: false,
    });
  };

  

  showModal = (type, id) => {
    let title;
    if (type === 'create') {
      title = "创建商户";
    } else {
      title = '预存款充值';
    }
    this.setState({
      currentId: id || '',
      modalType: type,
      modalTitle: title,
      modalVisible: true,
    });
  };

  render() {
    const { mclist, loading, dispatch, form } = this.props;

    const changePage = (page, pageSize) => {
      dispatch({
        type: 'mclist/fetchList',
        payload: {
          page,
          pageSize,
        },
      });
    };
    const changePageSize = (current, size) => {
      dispatch({
        type: 'mclist/fetchList',
        payload: {
          page: current,
          pageSize: size,
        },
      });
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: mclist.pageSize || 20,
      total: mclist.total,
      current: mclist.currentPage || 0,
      onChange: changePage,
      onShowSizeChange: changePageSize,
    };

    const searchList = value => {
      const payload = value ? { name: value } : undefined;
      dispatch({
        type: 'mclist/fetchList',
        payload,
      });
    };
    const { currentId, modalType, modalTitle, modalVisible } = this.state;
    const modalFooter = { okText: '确定', onOk: this.handleSubmit, onCancel: this.handleCancel };
    const getModalContent = () => {
      const  { getFieldDecorator } = form;
      const formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
      };
      const validatorMerchantName = (rule, value, callback) => {
        const opts = {zhLength:15, value};
        if(!value){
          callback(rule.message);
          return;
        }
        if(!checkStrLength(opts).check){
          callback('商户名超过30长度');
          return;
        }
        callback();
      }

      if (modalType === 'create') {
        return (
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="商户名" {...formLayout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请正确输入商户名' },{
                  validator: validatorMerchantName
                }],
              })(<Input placeholder="限30个中文、英文或数字" maxLength={50} />)}
            </FormItem>
          </Form>
        );
      }

      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="充值金额" {...formLayout}>
            {getFieldDecorator('money', {
              rules: [{ required: true, transform: value => +value, type: "number", message: '请正确输入金额' }],
            })(<Input placeholder="仅限输入数字" type="number" />)}
          </FormItem>
          <FormItem label="收款状态" {...formLayout}>
            {getFieldDecorator('status', {
              rules: [{ required: true, message: '请选择收款状态' }],
            })(
              <Select placeholder="请选择">
                <Option value="1">已收到转账款项</Option>
                <Option value="0">未收到转账款项</Option>
              </Select>
            )}
          </FormItem>
          {getFieldDecorator('id', {
            rule: [{ required: true }],
            initialValue: currentId
          })(<Input type="hidden" />)}
        </Form>
      );
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.title}>
            <h2>商户列表</h2>
            <Button
              icon="plus"
              type="primary"
              className={styles.buttonDiv}
              onClick={() => this.showModal('create')}
            >
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
        <Modal
          title={modalTitle}
          width={640}
          destroyOnClose
          confirmLoading={loading}
          visible={modalVisible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </div>
    );
  }
}

export default MerchantList;
