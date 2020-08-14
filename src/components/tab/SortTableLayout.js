import React from 'react';
import _ from 'lodash';
import { hashHistory } from 'dva/router';
import SortableTree from 'react-sortable-tree';
import { Input, Popconfirm, Tooltip, Row, Col, Button, Modal } from 'antd';
import * as styles from './styles.less';
// import 'react-sortable-tree/style.css'; // This only needs to be imported once in your app

const Search = Input.Search;
/**
 * https://github.com/frontend-collective/react-sortable-tree/tree/97610d1705451e260e4d1f2d587c169709f5a5de
 * 当前1.8.1，如果使用最新版2.6.0的话，需要更新react为最新版，老代码需要更新，升级较多
   "react-dnd-html5-backend": "^7.0.1",
   "react": "^16.3.0",
   "react-dnd": "^6.0.0 || ^7.0.0",
   "react-dom": "^16.3.0",
   "react-sortable-tree": "^2.6.0",
   "sql-formatter": "^2.3.0",
   "prop-types": "15.6.0",
   "react-router": "3.2.0"
 */
export default class SortTableLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: props.tabsData, // [{ title: 'Chicken', children: [{ title: 'Egg' }] }],
      searchString: '',
      searchFocusIndex: 0,
      searchFoundCount: null,
    };
  }

  componentDidMount = () => {
  }


  componentWillReceiveProps = (nextProps) => {
    const { tabsData } = nextProps;
    this.setState({ treeData: tabsData });
  };
  alertNodeInfo = ({ node, path, treeIndex }) => {
    const tabRecord = node.tabRecord;
    Modal.info({
      title: 'Tab Info……',
      content: (
        <div style={{ fontSize: 14 }}>
          <p>treeIndex: {treeIndex}</p>
          <p>path: [{path.join(', ')}]</p>
          <p>api_name: {tabRecord.api_name}</p>
          <p>label: {tabRecord.label}</p>
          <p>record_type: {_.get(tabRecord, 'record_type', '')}</p>
          <p>type: {tabRecord.type}</p>
          <p>object_describe_api_name: {tabRecord.object_describe_api_name}</p>
          <p>hidden_devices: {_.join(tabRecord.hidden_devices)}</p>
          <p>define_type: {tabRecord.define_type}</p>
        </div>
      ),
      onOk() {},
    });
  };


  handleTreeOnChange = (treeData) => {
    this.setState({ treeData });
  };

  handleSearchOnChange = (e) => {
    this.setState({
      searchString: e.target.value,
    });
  };

  selectPrevMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
          : searchFoundCount - 1,
    });
  };

  selectNextMatch = () => {
    const { searchFocusIndex, searchFoundCount } = this.state;

    this.setState({
      searchFocusIndex:
        searchFocusIndex !== null
          ? (searchFocusIndex + 1) % searchFoundCount
          : 0,
    });
  };

  toggleNodeExpansion = (expanded) => {
    this.setState(prevState => ({
      // treeData: onVisibilityToggle({
      //   treeData: prevState.treeData,
      //   expanded,
      // }),
    }));
  };

  onCancel=() => {
    hashHistory.push('/tabs');
  }
  onReset=() => {
    this.setState({ treeData: this.props.tabsData });
  }

  onSave=() => {
    const { onOk } = this.props;
    const { treeData } = this.state;
    onOk(treeData);
  }

  render() {
    const {
      treeData,
      searchString,
      searchFocusIndex,
      searchFoundCount,
    } = this.state;
    const height = window.innerHeight-200;
    return (
      <div style={{ height }}>

        <div className={styles.gutter_example}>
          <Row type="flex" justify="start" gutter={2}>
            <Col span={4}>
              <Search
                placeholder="input search text"
                // style={{ width: 200 }}
                onSearch={value => console.log(value)}
                onPressEnter={this.selectNextMatch}
                onChange={this.handleSearchOnChange}
                // allowClear
              />
            </Col>
            <Col><Button onClick={this.selectPrevMatch}>Previous</Button></Col>
            <Col><Button onClick={this.selectNextMatch}>Next</Button></Col>
            <Col>
              <span>
                {searchFocusIndex} / {searchFoundCount}
              </span>
            </Col>
          </Row>
          <Row type="flex" justify="end">
            <Popconfirm placement="topLeft" title="是否返回？" onConfirm={this.onCancel.bind(this)} okText="确定" cancelText="再想想">
              <Button>返回</Button>
            </Popconfirm>
            <Popconfirm placement="topLeft" title="是否重置？" onConfirm={this.onReset.bind(this)} okText="确定" cancelText="再想想">
              <Button style={{ marginLeft: '5px' }} >重置</Button>
            </Popconfirm>
            <Button type="primary" style={{ marginLeft: '5px' }} onClick={this.onSave.bind(this)}>保存</Button>
          </Row>
        </div>

        <SortableTree
          treeData={treeData}
          onChange={treeData => this.setState({ treeData })}
          generateNodeProps={rowInfo => ({
            buttons: [
              <button
                className="btn btn-outline-success"
                style={{
                  verticalAlign: 'middle',
                }}
                onClick={() => this.alertNodeInfo(rowInfo)}
              >
                ℹ
              </button>,
            ],
          })}

          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          // isVirtualized
          searchFinishCallback={matches =>
            this.setState({
              searchFoundCount: matches.length,
              searchFocusIndex:
                matches.length > 0 ? searchFocusIndex % matches.length : 0,
            })
          }
        />
      </div>
    );
  }
}

