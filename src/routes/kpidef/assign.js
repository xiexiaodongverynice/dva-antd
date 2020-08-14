import React from 'react';
import { hashHistory } from 'dva/router';
import { connect } from 'dva';
import { Transfer, Row, Button } from 'antd';

const AssignKpiDef = ({ dispatch, targetKeys, selectedKeys, list }) => {

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    dispatch({
      type: 'kpi_def_assign/assignState',
      payload: {
        targetKeys: nextTargetKeys,
      },
    });
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    dispatch({
      type: 'kpi_def_assign/assignState',
      payload: {
        selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys],
      },
    });
  };

  const save = () => {
    dispatch({
      type: 'kpi_def_assign/save',
    });
  };

  const cancel = () => {
    hashHistory.push('/kpi_def/list');
  };

  const handleScroll = (direction, e) => {
  };

  return (
    <div>
      <Row>
        <Transfer
          listStyle={{
            width: 300,
            height: 400,
          }}
          dataSource={list}
          titles={['未分配', '已分配']}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
          onScroll={handleScroll}
          render={item => item.title}
        />
      </Row>
      <Row style={{marginTop: 10}}>
        <Button className="ant-btn-primary" onClick={save} style={{marginRight: 10}}>保 存</Button>

        <Button className="ant-btn-primary" onClick={cancel} >取 消</Button>
      </Row>
    </div>
  );
};

function mapStateToProps(state) {
  const { list, targetKeys, selectedKeys } = state.kpi_def_assign;
  return {
    list,
    targetKeys,
    selectedKeys,
  };
}

export default connect(mapStateToProps)(AssignKpiDef);
