import React, {Component} from 'react';
import './CandidatePanel.css';

/**
 * 候选判定面板。
 * @author Molay
 */
class CandidatePanel extends Component {
  constructor(props) {
    super(props);

    const me = this;
    me.state = {
      number: undefined,
      visible: false
    };
  }

  render() {
    const me = this;
    const props = me.props;
    const state = me.state;

    return (
      <div className={'candidate'} style={{
        display: state.visible ? '' : 'none',
        ...props.style
      }}>
        <h2>获奖号码</h2>
        <h1>{state.number}</h1>
        <div className={'btns'}>
          <button onClick={() => {
            me.callback(0);
          }}>YES
          </button>
          <button onClick={() => {
            me.callback(1);
          }}>NO
          </button>
        </div>
      </div>
    );
  }

  callback(code) {
    const me = this;
    const props = me.props;
    const onChoose = props.onChoose;

    if (typeof onChoose === 'function')
      onChoose(code);
  }

  appear() {
    const me = this;
    setTimeout(() => {
      me.setState({
        visible: true
      })
    }, 2000);
  }

  disappear() {
    const me = this;
    me.setState({
      visible: false
    })
  }
}

export default CandidatePanel;
