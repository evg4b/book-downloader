import { Button, Divider, Layout, Row } from 'antd';
import React, { Component } from 'react';
import { Downloader } from './Downloader/Downloader';
import { Navigation } from './Navigation/Navigation';
import { SettingsModal } from './SettingsModal/SettingsModal';
import './SideBar.css';

export class SideBar extends Component {

  state = {
    settingsVisible: false
  }

  render() {
    return (
      <Layout.Sider width="400px" theme="light" className="app-sidebar">
          <Row style={{ textAlign: 'right' }}>
              <Button shape="circle" icon="setting" onClick={() => this.setState({ settingsVisible: true })}  />
          </Row>
          <Divider orientation="left">Навигация</Divider>
          <Row>
            <Navigation
              onNavigate={this.props.onNavigate}
              onBack={this.props.onBack}
              onForward={this.props.onForward}
            />
          </Row>
          <Divider orientation="left">Скачивание</Divider>
          <Row>
            <Downloader />
          </Row>
          <SettingsModal visible={this.state.settingsVisible} onClose={() => this.setState({ settingsVisible: false })} />
      </Layout.Sider>
    )
  }
}
