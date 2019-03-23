import React, { Component } from 'react'
import { InputNumber, Row, Col, Button } from 'antd';

export class Downloader extends Component {

  state = {
    start: 1,
    end: 1
  }

  render() {
    return (
      <div>
        <Row>
          <Col span={12}>
            Страницы
          </Col>
          <Col span={12}>
            <InputNumber
              min={1}
              max={this.state.end}
              value={this.state.start}
              onChange={(value) => this.setState({ start: value })}
            />
            -
            <InputNumber
              min={this.state.start}
              max={300}
              value={this.state.end}
              onChange={(value) => this.setState({ end: value })}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Button block style={{ marginTop: 8 }}>
              Скачать
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}
