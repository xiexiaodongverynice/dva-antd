/*
  废弃
*/
import React from 'react';
import { Input } from 'antd';
import styles from './search_obj.less';

const Search = Input.Search;


class SearchObj extends React.Component {
  check_li = (item) => {
    const values = {
      id: item.id,
      api_name: item.api_name,
    };
    this.props.dispatch({ type: 'search_obj/changeObjId', payload: values });
  }

  render() {
    return (
      <div>
        <Search
          placeholder="input search text"
          style={{ width: 200, margin: '0 0 10px 0' }}
        />
        <div className={styles.box}>
          <ul>
            {this.props.obj.map((item) => {
              return (
                <li
                  className={item.id === this.props.objCheck.id ? styles.check : ''} key={item.id}
                  onClick={this.check_li.bind(null, item)} id={item.id}
                >{item.display_name}</li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

}

export default SearchObj;
