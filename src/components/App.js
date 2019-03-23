
import { Layout, Button, Row, Col } from 'antd';
const { Sider, Content } = Layout;
import React, { Component } from 'react'
import './App.css';
import Title from 'antd/lib/typography/Title';
import { SideBar } from './SideBar/SideBar'
import { WebViewContainer } from './WebViewContainer/WebViewContainer';

class App extends Component {

  state = {
    url: 'https://biblioclub.ru/index.php?page=main_ub_red&needauth=1'
  };

  render() {
    return (
      <Layout>
        <Content>
          <WebViewContainer url={this.state.url} />
        </Content>
        <SideBar onNavigate={this.onNavigate} />
      </Layout>
    )
  }

  onNavigate = (url) => {
    this.setState({ url })
  }

}

export default App
