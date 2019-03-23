
import { Layout, Button, Row, Col } from 'antd';
const { Sider, Content } = Layout;
import React, { Component } from 'react'
import './App.css';
import Title from 'antd/lib/typography/Title';
import { SideBar } from './SideBar/SideBar'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: 'https://biblioclub.ru/index.php?page=main_ub_red&needauth=1'
    };
  }

  render() {
    return (
      <Layout>
        <Content>lorem</Content>
        <SideBar />
      </Layout>
    )
  }


}

export default App
