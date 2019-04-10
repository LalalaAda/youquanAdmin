import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { message, Input, Table, Card, Form, Select, Modal, Button, Divider } from 'antd';
import Link from 'umi/link';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

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
          {getFieldDecorator('txt', {
            initialValue: search.txt,
          })(<Input className={styles.searchinput} placeholder="上游商品编号/立咕商品编号/虚拟商品名称" maxLength={30} />)}
        </FormItem>
        <FormItem label="上游供应商">
          {getFieldDecorator('supplier', {
            initialValue: search.supplier || 0,
          })(
            <Select style={{ minWidth: '140px' }}>
              <Option value={0}>全部</Option>
              <Option value={1}>流量贝贝</Option>
              <Option value={2}>拉卡拉</Option>
            </Select>
          )}
        </FormItem>
        <FormItem label="卡券类型">
          {getFieldDecorator('type', {
            initialValue: search.type || 0,
          })(
            <Select style={{ minWidth: '140px' }}>
              <Option value={0}>全部</Option>
              <Option value={1}>直充</Option>
              <Option value={2}>非直充</Option>
            </Select>
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
@connect(({ onsale, loading }) => ({
  onsale,
  loading: loading.models.onsale,
}))
@Form.create()
class OnSaleList extends PureComponent {
  state = {
    modalVisible: false,
    currentItem: undefined,
    search: {
      txt: undefined,
      type: 0,
      suppiler: 0,
    },
  };

  columns = [
    {
      title: '上游供应商',
      dataIndex: 'suppiler',
    },
    {
      title: '上游商品编号',
      dataIndex: 'synum',
    },
    {
      title: '立咕商品编号',
      dataIndex: 'lgnum',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
    },
    {
      title: '商品图片',
      dataIndex: 'src',
      render: (_, val) => <img className={styles.tableimg} src={val.src} alt={val.name} />,
    },
    {
      title: '卡券类型',
      dataIndex: 'type',
      render: val => <span>{val === 1 ? '直充' : '非直充'}</span>,
    },
    {
      title: '含税成本价(元)',
      dataIndex: 'cprice',
      render: val => <span>{val ? val.toFixed(2) : 0.0}</span>,
    },
    {
      title: '含税下游供货价(元)',
      dataIndex: 'sprice',
      render: val => <span>{val ? val.toFixed(2) : 0.0}</span>,
    },
    {
      title: '下游销售库存',
      dataIndex: 'inventory',
    },
    {
      title: '操作',
      render: val => {
        const changePriceClick = () => {
          this.showModal(val);
        };
        return (
          <Fragment>
            <Link to={`/goods/onsale/detail/${val.id}`}>详情</Link>
            <Divider type="vertical" />
            <span onClick={changePriceClick} className={styles.linkbutton}>
              编辑供货价
            </span>
          </Fragment>
        );
      },
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'onsale/fetchList',
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        const { id, sprice } = values;
        dispatch({
          type: 'onsale/changePrice',
          payload: { id, sprice },
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
    const { onsale, loading, dispatch, form } = this.props;
    const { search } = this.state;

    const changePage = (page, pageSize) => {
      const { txt, type, suppiler } = search;
      dispatch({
        type: 'onsale/fetchList',
        payload: {
          page,
          pageSize,
          txt,
          type,
          suppiler,
        },
      });
    };
    const changePageSize = (current, size) => {
      const { txt, type, suppiler } = search;
      dispatch({
        type: 'onsale/fetchList',
        payload: {
          page: current,
          pageSize: size,
          txt,
          type,
          suppiler,
        },
      });
    };
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: onsale.pageSize || 50,
      pageSizeOptions: ['20', '40', '50', '60'],
      total: onsale.total || 0,
      showTotal: total => `共${total}项  `,
      current: onsale.currentPage || 1,
      onChange: changePage,
      onShowSizeChange: changePageSize,
    };

    const onSearch = values => {
      const { state } = this;
      this.setState({
        ...state,
        search: { ...values },
      });
      const { txt, type, suppiler } = values;
      dispatch({
        type: 'onsale/fetchList',
        payload: { txt, type, suppiler },
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
            <h2>在售虚拟商品列表</h2>
          </div>
          <SearchForm search={search} onSearch={onSearch} />
          <Table
            rowKey={item => item.id}
            dataSource={onsale.list}
            columns={this.columns}
            loading={loading}
            pagination={paginationProps}
          />
        </Card>
        <Modal
          title="编辑供货价"
          width={640}
          destroyOnClose
          confirmLoading={loading}
          visible={modalVisible}
          {...modalFooter}
        >
          <Form onSubmit={this.handleSubmit}>
            <FormItem label="含税成本价" {...formLayout}>
              {(currentItem && currentItem.cprice.toFixed(2)) || 0.0}元
            </FormItem>
            <FormItem label="含税下游供货价" {...formLayout}>
              {getFieldDecorator('sprice', {
                rules: [
                  {
                    required: true,
                    transform: value => +value,
                    type: 'number',
                    message: '请正确输入金额',
                  },
                ],
                initialValue: currentItem && currentItem.sprice,
              })(<Input placeholder="仅限输入数字" type="number" />)}
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

export default OnSaleList;
