import React, {Component} from 'react';
import './Disclaimer.css';
import warning_image from './image/warning.png';
import qr_code_image from './image/qr-code.png';

/**
 * 免责声明;)
 * @author Molay
 */
class Disclaimer extends Component {
  constructor(props) {
    super(props);

    const me = this;
    me.state = {
      visible: true
    };
  }

  render() {
    const me = this;
    const state = me.state;
    const props = me.props;

    return (
      <div className={'disclaimer'} style={{
        display: state.visible ? '' : 'none',
        ...props.style
      }}>
        <div className={'content'}>
          <h1>WARNING! 警告！</h1>
          <h2>
            <p>应公司美女要求，九次方大数据可视化部临时为2018年公司年会的抽奖环节开发了这款抽奖程序。</p>
            <p>随机算法优先使用random.org提供的真随机数接口，获取失败时调用JavaScript原生的伪随机数生成方法。</p>
            <p>抽奖业务采用朴素方法实现，源码已放置在公司内网可视化部Gitlab的公开域以及外网Github仓中，
              请自行REVIEW（见下方二维码）。</p>
            <p>对于任何抽奖环节使用本程序所产生的，包含但不限于以下情况的，九次方大数据可视化部及本程序制作组均
              <span className={'emphasis'}>不承担任何责任</span>：
            </p>
            <p>* 未能抽中任何奖品</p>
            <p>* 抽中头奖，激动晕倒</p>
            <p>* 同一团队连续中奖</p>
            <p>* 同一团队未抽中任何奖品</p>
            <p>* 等</p>
          </h2>
          <img src={warning_image} width={200} className={'warning-icon'} onClick={function () {
            const onClose = props.onClose;
            if (typeof onClose === 'function') onClose();
          }}/>
          <img src={qr_code_image} width={200} className={'qr-code-icon'}/>
          <p className={'emphasis'} style={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '28px'
          }}>点击黄色图标进入，即代表您同意上述免责条款。</p>
        </div>
      </div>
    );
  }
}

export default Disclaimer;
