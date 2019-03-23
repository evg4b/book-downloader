import React, { Component } from 'react'
import { Input, Select, Icon, Button } from 'antd';
import { values } from 'lodash-es';
import { SITES, SITE_NAMES, SITE_URLS } from '../../../constants/Sites';
import { parse, resolve } from 'url';

export class Navigation extends Component {

  state = {
    url: '/',
    site: SITES.BIBLIOCLUB
  };

  render() {
    return (
      <div>
        <div style={{ marginBottom: 8 }}>
          <Input
            value={this.state.url}
            addonBefore={this.addonBefore()}
            addonAfter={this.addonAfter()}
            defaultValue={this.state.url}
            onChange={this.urlChanged}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button.Group >
            <Button>
              <Icon type="left" /> Назад
            </Button>
            <Button>
              Вперед <Icon type="right" />
            </Button>
          </Button.Group>
        </div>
      </div>
    )
  }

  addonBefore = () => {
    return (
      <Select style={{ width: 150 }}
        defaultValue={this.state.site}
        onChange={this.siteChanged}
      >
        {values(SITES).map(site => (
          <Select.Option key={site} value={site}>
            {SITE_NAMES[site]}
          </Select.Option>
        ))}
      </Select>
    )
  }

  addonAfter = () => {
    return (
      <Icon type="arrow-right" onClick={this.navigate} />
    )
  }

  siteChanged = (site) => {
    this.setState({ site });
  }

  urlChanged = ({ target }) => {
    const { path } = parse(target.value);
    this.setState({ url: path });
  }

  navigate = () => {
    const { site, url } = this.state;
    console.log(resolve(SITE_URLS[site], url));
  }
}
