import React from 'react';
import { Table } from 'antd';

class ObjectPageIndex extends React.Component {
  state = {
    value: undefined,
  };

  getInitialState=() => {
    console.log('getInitialState');
  }

  componentWillMount() {
    console.log('componentWillMount ObjePageIndex');
    /* const {object_api_name} = this.props.params;
    const { describe, record, layout } = this.props;
    console.log("object_api_name="+object_api_name)
    this.props.dispatch({
      type: 'object_page/fetchDescribe',
      payload: {object_api_name : object_api_name}
    });
    this.props.dispatch({
      type: 'object_page/fetchLayout',
      payload: {object_api_name : object_api_name, layout_type : 'index_page'}
    });*/
  }

  loadObject = (api_name) => {
    this.props.dispatch({ type: 'object_page/loadObject', payload: { object_api_name: api_name, includeFields: true } });
  }

  test=() => {
    console.log('test');
  }

  page_list_items =() => {
    const { layout } = this.props;

    console.log(layout);
    if (layout) {
      const dataSource = [{
        key: '1',
        name: '胡彦斌',
        age: 32,
        address: '西湖区湖底公园1号',
      }, {
        key: '2',
        name: '胡彦祖',
        age: 42,
        address: '西湖区湖底公园1号',
      }];

      const columns = [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      }, {
        title: '年龄',
        dataIndex: 'age',
        key: 'age',
      }, {
        title: '住址',
        dataIndex: 'address',
        key: 'address',
      }];

      return layout.containers.map((/* container*/) => {
           // const object_api_name=container.components[0].object_describe_api_name;
           // this.props.dispatch({
           //   type: 'object_page/fetchDescribe',
           //   payload: {object_api_name : object_api_name}
           // });
        return (<Table dataSource={dataSource} columns={columns} key="1" />);
      },

       );
    }
    return '等待渲染。';
  };
  /* const page_list_items=()=>{
     console.log("page_list_items");
     const containers=this.props.layout.containers;
     for (var container of containers) {
       console.log(container);
     }
   }*/


  render() {
    // const list_btn = { margin: '10px 10px' };
    // const btn_div = { width: 400, margin: '0 auto' };


    // const page_list_items = {
    //
    // };


    return (
      <div style={{ width: '100%' }}>
        {this.page_list_items()}
      </div>
    );
  }
}


ObjectPageIndex.proTypes = {
  // onSearch: PropTypes.func.isRequired,
  // onEdit : PropTypes.func.isRequired,
  // user: PropTypes.array.isRequired,
};

export default ObjectPageIndex;

