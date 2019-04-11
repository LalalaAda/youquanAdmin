import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { message, Input, Button, Card, Form, Select, Modal} from 'antd';
import PicturesWall from '@/components/UploadImgs';

import styles from './index.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ onsale, loading }) => ({
  onsale,
  loading: loading.models.onsale,
}))
@Form.create()
class OnSaleDetail extends PureComponent {
  state = {
    modalVisible: false,
    imgobj: undefined,
    isEdit: false
  };


  componentDidMount() {
    const {
      match: { params },
      dispatch,
    } = this.props;
    dispatch({
      type: 'onsale/fetchItem',
      payload: { id: params.id },
    });
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const that = this;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'onsale/updateItem',
          payload: { ...values },
          callback(flag) {
            if (flag) {
              message.success('更改成功');
              that.setState({ isEdit: false });
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
      isEdit: false,
    });
  };

  showModal = item => {
    this.setState({
      imgobj: item || {},
      modalVisible: true,
    });
  };

  showEdit = () => {
    this.setState({
      isEdit: true
    });
  }

  render() {
    const { onsale, loading, form } = this.props;
    const { isEdit, modalVisible, imgobj } = this.state;
    const { getFieldDecorator } = form;
    const formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 13 },
    };

    const Buttons = () => {
      if(!isEdit){
        return (<Button className={styles.buttonDiv} type="primary" onClick={this.showEdit}>编辑</Button>);
      }
      return (
        <div className={styles.buttonDiv}>
          <Button type="primary" style={{marginRight: '6px'}} onClick={this.handleSubmit} loading={loading}>确定</Button>
          <Button type="" onClick={this.handleCancel}>取消</Button>
        </div>
      );
    }

    const {detail} = onsale;
    const supplierText = supplier => {
      switch(supplier){
        case 1:
          return '流量贝贝';
        case 2:
          return '拉卡拉';
        default:
          return '----';
      }
    }
    const inputText = (key, type, errmsg) => {
      if(isEdit){
        return (getFieldDecorator(key, {
          rules: [{required: true, message: errmsg || "" }],
          initialValue: detail&&detail[key]
        })(
          <Input type={type} maxLength={30} />
        ));
      }
      return (
        <span>{detail&&detail[key] || "----"}</span>
      )
    }
    const validatorUploadimgs = (rule, value, callback) => {
      if(!value || value.length<=0){
        callback(rule.message);
        return;
      }
      callback();
    }
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.title}>
            <h2>虚拟商品详情</h2>
            {Buttons()}
          </div>
          <Form onSubmit={this.handleSubmit} {...formLayout}>
            <FormItem label="上游供应商">
              <span>{supplierText(detail.supplier)}</span>
            </FormItem>
            <FormItem label="上游商品编号" {...formLayout}>
              <span>{detail&&detail.synum || "----"}</span>
            </FormItem>
            <FormItem label="立咕商品编号" {...formLayout}>
              <span>{detail&&detail.lgnum || "----"}</span>
            </FormItem>
            <FormItem label="虚拟商品名称" {...formLayout}>
              {inputText('name', 'text','请输入虚拟商品名')}
            </FormItem>
            <FormItem label="商品图片" {...formLayout}>
              {
                getFieldDecorator('imgurls', {
                  rules:[{required: true, validator: validatorUploadimgs, message: '商品图片为必填项'}],
                  initialValue: detail&&detail.imgurls || []
                })(
                  <PicturesWall readonly={!isEdit} />
                )
              }
            </FormItem>
            <FormItem label="卡券类型" {...formLayout}>
              <span>{detail&&detail.type===1?'直充':'非直充' || '----'}</span>
            </FormItem>
            <FormItem label="含税成本价" {...formLayout}>
              <span>{detail&&detail.cprice || 0.00}元</span>
            </FormItem>
            <FormItem label="下游销售库存" {...formLayout}>
              {inputText('inventory', 'number','请输入库存数')}
            </FormItem>
            <FormItem label="销售状态" {...formLayout}>
              {
                isEdit ? (
                  getFieldDecorator('status', {
                    rules: [{required: true}],
                    initialValue: detail&&detail.status
                  })(
                    <Select placeholder="请选择">
                      <Option value={1}>在售</Option>
                      <Option value={0}>停售</Option>
                    </Select>
                  )
                ) : (
                  <span>{(detail&&detail.status)?'在售':'停售'}</span>
                )
              }
            </FormItem>
            <FormItem label="商品详情" {...formLayout}>
              {
                <textarea readOnly style={{width:'100%', resize: 'none'}} rows="5" value="暂无详情" />
              }
            </FormItem>
            {getFieldDecorator('id', {
              rule: [{ required: true }],
              initialValue: detail && detail.id,
            })(<Input type="hidden" />)}
          </Form>
        </Card>
        <Modal
          title={imgobj&&imgobj.alt || '未知图片'}
          width={640}
          destroyOnClose
          visible={modalVisible}
        >
          <img src={imgobj&&imgobj.src || ''} alt={imgobj&&imgobj.alt || ''} />
        </Modal>
      </div>
    );
  }
}

export default OnSaleDetail;
