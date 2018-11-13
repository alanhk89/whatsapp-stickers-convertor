import React, { Component } from 'react';
import './App.css';
import saveAs from 'file-saver';
import { Upload, Button, Form, Input, Icon, Modal, message } from 'antd';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

class StickerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      identifier: '',
      name: '',
      publisher: '',
      tray_image: '',
      stickers: [],
      file_name: '',
    };
  }

  getImageInBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result.split(',')[1]));
    reader.readAsDataURL(file);
  }

  generateStickersBase64 = (fileList) => {
    let stickers = [];
    fileList.map((file) => {
      this.getImageInBase64(file.originFileObj, imageBase64 => stickers.push({image_data: imageBase64}));
    });
    return stickers;
  };

  handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(this.state);
    const { identifier, name, publisher, tray_image, stickers, file_name } = this.state;
    const jsonResult = JSON.stringify({identifier, name, publisher, tray_image, stickers});
    const file = new Blob([jsonResult], {type: "application/json;charset=utf-8"});
    /*identifier && name && publisher && trayImage && stickers &&*/ file_name ? saveAs.saveAs(file, `${file_name}.json`) : message.error('Please enter all required values');
  }

  updateInputValue = (evt) => {
    this.setState({
      [evt.target.id]: evt.target.value
    });
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  renderUploadButton = () => {
    return (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
  };

  renderFormInputItem = (label, varName, msg) => {
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem
        {...formItemLayout}
        label={label}
      >
        {getFieldDecorator(varName, {
          rules: [{
            required: true, message: msg,
          }],
        })(
          <Input onChange={this.updateInputValue} />
        )}
      </FormItem>
    );
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { tray_image, previewVisible, previewImage } = this.state;
    return (
      <Form className="StickerForm" onSubmit={this.handleSubmit}>
        {this.renderFormInputItem("JSON name", "file_name", 'Please input your json file name!')}
        {this.renderFormInputItem("Identifier", "identifier", 'Please input your identifier!')}
        {this.renderFormInputItem("Name", "name", 'Please input your name!')}
        {this.renderFormInputItem("Publisher", "publisher", 'Please input your publisher!')}
        <FormItem
          {...formItemLayout}
          label="Tray Image">
          {getFieldDecorator('tray_image', {
            rules: [{
              required: true, message: 'Please upload the tray image',
            }],
          })(
            <div>
              <Upload
                multiple = {false}
                beforeUpload = {(file) => {
                  if(file.type !== 'image/png') {
                    message.error('Only PNG is allowed');
                  }
                  return false;
                }}
                onChange = {(info) => {console.log(info);
                  if (info.file.status === "removed") {
                    this.setState({ tray_image: '', previewVisible: false });
                  } else if(info.file.type === 'image/png'){
                    this.getImageInBase64(info.file, imageBase64 => this.setState({
                      tray_image: imageBase64
                    }));
                  }
                }}
                onPreview={this.handlePreview}
                listType="picture-card"
                >
                {tray_image ? null : this.renderUploadButton()}
              </Upload>
              <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="trayImage" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Stickers">
          {getFieldDecorator('stickers', {
            rules: [{
              required: true, message: 'Please upload the stickers',
            }],
          })(
            <div>
              <Upload
                multiple = {true}
                beforeUpload = {(file) => {
                  if (file.type !== 'image/webp') {
                    message.error('Only webp is allowed');
                  } 
                  return false;
                }}
                onRemove={() => {
                  this.setState({ previewVisible: false });
                }}
                onChange = {(info) => {
                  if(info.file.type === 'image/webp'){
                    this.setState({ stickers: this.generateStickersBase64(info.fileList) || []});
                  }
                }}
                onPreview={this.handlePreview}
                listType="picture-card"
                >
                {this.state.stickers.length >= 30 ? null : this.renderUploadButton()}
              </Upload>
              <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
                <img alt="stickers" style={{ width: '100%' }} src={this.state.previewImage} />
              </Modal>
            </div>
          )}
        </FormItem>
        <FormItem
          wrapperCol={{ span: 12, offset: 5 }}
        >
          <Button type="primary" htmlType="submit">
            Save Json
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(StickerForm);
