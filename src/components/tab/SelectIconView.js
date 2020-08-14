import React from 'react';
import { Select, Icon } from 'antd';
import _ from 'lodash';
import cx from 'classnames';
import styles from './icon.less';
import iconSourceData from '../../assets/icomoonSourceData.css';

export default class SelectIconView extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(props);
    const iconNameList = Object.keys(iconSourceData);

    this.state = {
      iconKey: null,
      iconColor: '#56A8F7',
      iconNameList,
    };
  }

  componentWillReceiveProps(nextprops) {
    const { iconColor, iconKey } = this.state;
    const tmpState = {};
    const transitiveIconkey = _.get(nextprops, 'value.iconKey');
    const transitiveIconColor = _.get(nextprops, 'value.iconColor');
    if (transitiveIconColor && _.isNull(iconColor)) {
      _.set(tmpState, 'iconColor', transitiveIconColor);
    }

    if (transitiveIconkey && _.isNull(iconKey)) {
      _.set(tmpState, 'iconKey', transitiveIconkey);
    }

    this.setState(tmpState);
  }

  updateIconInfo = (key, value) => {
    const { onChange } = this.props;

    this.setState({ [key]: value }, () => {
      const { iconColor, iconKey } = this.state;
      onChange({ iconColor, iconKey });
    });
  };

  renderSelectIcon = () => {
    const { iconKey, iconColor } = this.state;
    if (_.isNull(iconKey)) return <i />;
    const styleColor = _.isNull(iconColor) ? {} : { color: iconColor };
    return <i key="displayIcon" style={styleColor} className={cx(`icomoon ${iconKey}`, styles.dispalyIcon)} />;
  };

  renderSelectIconColor = () => {
    const { iconKey, iconColor } = this.state;
    const Option = Select.Option;

    return (
      <Select
        defaultValue="#56A8F7"
        value={iconColor}
        className={styles.iconColorSelect}
        disabled={_.isNull(iconKey)}
        onChange={(e) => {
          const colorvalue = _.isUndefined(e) ? null : e;
          this.updateIconInfo('iconColor', colorvalue);
        }}
      >
        <Option value="#56A8F7">默认</Option>
        <Option value="#666666">颜色一</Option>
        <Option value="#8777F4">颜色二</Option>
        <Option value="#48CE80">颜色三</Option>
        <Option value="#F0AF41">颜色四</Option>
      </Select>
    );
  };

  render() {
    const { iconKey, iconNameList } = this.state;

    return (
      <div>
        <div className={styles.dispalyIconView}>
          {this.renderSelectIcon()}
          {this.renderSelectIconColor()}
        </div>
        <div className={styles.scrollWrap}>
          <div className={styles.iconWrap}>
            {_.map(iconNameList, (key) => (
              <div
                key={key}
                className={styles.iconView}
                onClick={() => {
                  this.updateIconInfo('iconKey', key);
                }}
              >
                {iconKey === key && <Icon type="check-circle" className={styles.checkCircle} />}
                <i className={cx(`icomoon ${key}`, styles.icon)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
