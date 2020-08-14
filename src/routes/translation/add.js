import React, { Component } from 'react';
import { connect } from 'dva';
import TranslationForm from './form';


class TranslationAdd extends Component {
  componentWillMount() {
    // this.props.dispatch({
    //   type: 'nav_tabs/fetchCustomObjects',
    // });
  }

  render() {
    const { translation, dispatch, location } = this.props;
    return (
      <div style={{ padding: 24, background: '#fff', minHeight: 525 }} >
        <TranslationForm
          translation={translation}
          dispatch={dispatch}
          location={location}
        />
      </div>
    );
  }

}

function mapStateToProps(state) {
  const { translation } = state.translation_add;
  return {
    translation,
  };
}

export default connect(mapStateToProps)(TranslationAdd);
