import React, { Component } from 'react';
import { Tag, Input, Tooltip, Button } from 'antd';

class EditableTagGroup extends Component {

  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      tags: value,
      inputVisible: props.inputVisible,
      inputValue: props.inputValue,
    };
  }

  handleClose = (removedTag) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag);
    this.setState({ tags });
  };

  showInput = () => {
    this.setState({ inputVisible: true });
    // this.input.focus(); somehow the ref is not working ...
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }
    this.setState({
      tags,
      inputVisible: false,
      inputValue: '',
    });

    // 通知父Form组件值变化
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(tags);
    }
  };

  saveInputRef = (input) => {
    this.input = input;
  };

  renderAddTags = () => {
    const { inputVisible, inputValue } = this.state;
    if (!inputVisible) {
      return <Button size="small" type="dashed" onClick={this.showInput}>+ New Tag</Button>
    }

    if (inputVisible) {
      return (
        <Input
          ref={this.saveInputRef}
          type="text"
          size="small"
          style={{ width: 78 }}
          value={inputValue}
          onChange={this.handleInputChange}
          onBlur={this.handleInputConfirm}
          onPressEnter={this.handleInputConfirm}
        />
      );
    }
  }

  render() {
    const { tags } = this.state;
    const { defaultDisable } = this.props;
    return (
      <div>
        {tags.map((tag) => {
          const isLongTag = tag.length > 20;
          const tagElem = (
            <Tag key={tag} closable={!defaultDisable} afterClose={() => this.handleClose(tag)}>
              {isLongTag ? `${tag.slice(0, 20)}...` : tag}
            </Tag>
          );
          return isLongTag ? <Tooltip title={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {!defaultDisable && this.renderAddTags()}
      </div>
    );
  }
}

export default EditableTagGroup;
