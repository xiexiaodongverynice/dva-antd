import React from 'react';
import { connect } from 'dva';
import ObjectPageIndex from './../../components/object_page/ObjectPageIndex';

// class ObjectIndex extends Component{
const ObjectIndex = ({ dispatch, layout, location, loading }) => {
  // componentWillMount() {
  //   const {object_api_name} = this.props.params;
  //   console.log("object_api_name="+object_api_name)
  // //   this.props.dispatch({
  // //     type: 'object_page/fetchDescribe',
  // //     payload: {object_api_name : object_api_name}
  // //   });
  // //   this.props.dispatch({
  // //     type: 'object_page/fetchLayout',
  // //     payload: {object_api_name : object_api_name, layout_type : 'index_page'}
  // //   });
  // }
  return (
    <div style={{ padding: 24, background: '#fff', minHeight: 525 }}>
      <ObjectPageIndex
        dispatch={dispatch}
        loading={loading}
        location={location}
        layout={layout}
      />
    </div>
  );
};

function mapStateToProps(state) {
  console.log('mapStateToProps routes');
  const { layout, describe } = state.object_page;
  const loading = state.loading.models.object_page;
  return {
    loading,
    layout,
    describe,
  };
}
export default connect(mapStateToProps)(ObjectIndex);
