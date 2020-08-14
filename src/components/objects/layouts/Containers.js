import React, { Component } from 'react';
import { Tag } from 'antd';

class Contianers extends Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler = () => {
    this.props.addHandler({ type: 'fieldSection' });
  }

  render() {
    return (
      <div className="Contianers">
        <h2>容器</h2>
        <div style={{ margin: '16px' }}>
          <Tag onClick={this.clickHandler} color="cyan" style={{ width: '100%' }}>
            字段分组
          </Tag>
        </div>
      </div>
    );
  }
}

export default Contianers;
