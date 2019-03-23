import React, { Component } from 'react'
import { Layout, Button, Row, Col, Divider } from 'antd';
const { Sider } = Layout;
import './SideBar.css';
import Title from 'antd/lib/typography/Title';
import { Navigation } from './Navigation/Navigation';

export class SideBar extends Component {

  render() {
    return (
      <Sider width="400px" theme="light" className="app-sidebar">
          <Row>
            <Col className="gutter-row" span={12}>
              <Title level={4}>
                test
              </Title>
            </Col>
            <Col className="gutter-row" span={12}>
              <Button shape="circle" icon="setting"  />
            </Col>
          </Row>
          <Divider orientation="left">Навигация</Divider>
          <Row>
            <Navigation />
          </Row>
          <Divider orientation="left">Скачивание</Divider>
          <Row>
            <Navigation />
          </Row>
      </Sider>
    )
  }


}
