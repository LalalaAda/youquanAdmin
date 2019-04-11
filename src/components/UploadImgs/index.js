import React, { PureComponent } from 'react';
import isEqual from 'lodash/isEqual';
import { Upload, Icon, Modal } from 'antd';
import styles from './index.less';

const changeValueToFileList = val => {
  let fl = [];
  fl = val.map((item, index) => {
    const obj = {};
    obj.name = item.name || `图片${index}.png`;
    obj.status = 'done';
    obj.url = item.url;
    obj.uid = index;
    return obj;
  });
  return fl;
};

const changeFileListToValue = list => {
  let val = [];
  val = list.map(item => {
    const obj = {};
    obj.name = item.name;
    obj.url = item.url;
    return obj;
  });
  return val;
};

export default class PicturesWall extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: changeValueToFileList(props.value),
      value: props.value,
      readonly: props.readonly,
    };
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (
      isEqual(nextProps.value, preState.value) &&
      isEqual(nextProps.readonly, preState.readonly)
    ) {
      return null;
    }
    return {
      fileList: changeValueToFileList(nextProps.value),
      value: nextProps.value,
      readonly: nextProps.readonly,
    };
  }


  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({file, fileList }) => {
    const { onChange } = this.props;
    this.setState({ fileList });
    if(file.status==="removed" || file.response&&(file.response.status==="ok")){
      let fl = fileList;
      fl = fl.map(item => {
        const t = item;
        if(t.uid===file.uid){
          t.url = file.response.url;
        }
        return t;
      });
      onChange(changeFileListToValue(fl));
    }
  };

  render() {
    const { previewVisible, previewImage, fileList, readonly } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" className={styles['ant-upload-i']} />
        <div className={styles['ant-upload-text']}>Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="/api/uploadimg"
          accept="image/*"
          listType="picture-card"
          fileList={fileList}
          disabled={readonly}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 5 || readonly ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
