import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'dva';
import _ from 'lodash';

/**
 * @params
 * external_page_param
 * external_page_src
 * **/

class ExternalPageIndex extends Component {
  componentDidMount() {
    if (!this.src) {
      return false;
    }
  }

  updateSrc() {
    this.src = _.get(this.props, 'external_page_src', null);
    const { external_page_param = '' } = this.props;
    if (external_page_param) {
      let paramsData = '';
      for (const Key in external_page_param) {
        paramsData += `${Key}=${external_page_param[Key]}&`;
      }
      console.log(this.src, paramsData, 'paramsData');
      this.src = `${this.src}?${paramsData}`;
    }
  }

  render() {
    this.updateSrc();

    return this.src ? (
      <iframe
        key={new Date().getTime()}
        style={{ marginTop: '-27px', marginBottom: '-35px' }}
        src={this.src}
        frameBorder="0"
        width={'100%'}
        height={'1000px'}
      />
    ) : null;
  }
}

export default ExternalPageIndex;
