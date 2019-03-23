
import { Modal, Button } from 'antd';
import React, { Component } from 'react';

export class SettingsModal extends Component {

  render() {
    return (
      <Modal
          title="Настройки"
          visible={this.props.visible}
          onOk={this.props.onClose}
          onCancel={this.props.onClose}
        >
          <Button type="primary" onClick={() => {
            console.log(window);
            window.openDevTools();
          }}>
            Open dev tools
          </Button>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
      </Modal>
    )
  }
}

