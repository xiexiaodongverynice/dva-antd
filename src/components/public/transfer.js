import React from 'react';
import { Transfer, Button, Select } from 'antd';

import styles from './transfer.less';


const Option = Select.Option;

class transfers extends React.Component {

  filterOption = (inputValue, option) => {
    return option.name.indexOf(inputValue) > -1;
  }
  handleChange = (targetKeys) => {
    this.props.dispatch({
      type: 'roleTransfer/TransferR',
      payload: {
        targetKeys,
      },
    });
  }

  okSearch = (value) => {
    const { onSearch } = this.props;

    onSearch(value);
  }
  okSave = () => {
    const { onSave } = this.props;
    onSave(
      this.props.targetKeys, this.props.config, this.props.mockData, this.props.oldTargetKeys, this.props.targetBodyObj,
    );
  }
  goBack = () => {
    window.history.back();
  }

  render() {
    return (
      <div className={styles.mybox}>
        <h1>{this.props.config.indexName}：{this.props.config.name}</h1>
        <span>要将其他用户分配给此{this.props.config.indexName}：</span><br />
        <span>    从下拉列表中选择，以显示可用用户。</span><br />
        <span>    从左侧选择一个用户并将其添加到选定用户列表。</span><br />
        <span>从选定用户列表中移除一个用户会删除该用户的{this.props.config.indexName}分配。</span><br />
        <hr />

        <div className={styles.traBox}>
          <Select
            className={this.props.location.pathname === '/group/distribution' ? styles.editButton : ''}
            placeholder="可用用户搜索"
            style={{ width: 200, marginBottom: 30 }}
            optionFilterProp="children"
            filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            onChange={this.okSearch}
            defaultValue=""
          >
            <Option key={1000} value="">全部用户</Option>
            <Option key={1001} value="null">全部未分配</Option>
            {

              this.props.searchList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {this.props.location.pathname === '/group/distribution' ? item.label : item.name}
                  </Option>
                );
              })
            }
          </Select>
          <Transfer
            rowKey={record => record.id}
            dataSource={this.props.mockData}
            showSearch
            titles={['未分配', '已分配']}
            filterOption={this.filterOption}
            targetKeys={this.props.targetKeys}
            onChange={this.handleChange}
            render={item => `${item.name} - ${item.account}`}
            listStyle={{
              width: 300,
              height: 350,
              margin: '0px auto',
            }}
          />
        </div>
        <div className={styles.myButton}>
          <Button type="primary" onClick={this.okSave}>保存</Button>
          <Button type="primary" onClick={this.goBack}>取消</Button>
        </div>
      </div>
    );
  }
}


export default transfers;
