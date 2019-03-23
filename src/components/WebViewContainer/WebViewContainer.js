import React, { Component } from 'react';

export class WebViewContainer extends Component {

  render() {
    return (
      <webview src={this.props.url} style={{height: '100vh'}} preload="./injectables/biblioclub.js">
        skaldjlkasdk
      </webview>
    )
  }
}
