import React, {Component} from 'react';
import VisTreeEnv from './VisTreeEnv';

/**
 * 大数据可视化部-数据之树，作为展示的主场景。
 * @author Molay
 */
class VisTree extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const me = this;
    const props = me.props;

    return (
      <div ref={'container'} style={{
        position: 'absolute',
        left: 0,
        top: 0,
        ...props.style
      }}/>
    );
  }

  componentDidMount() {
    const me = this;

    const env = me._env = new VisTreeEnv();
    env.resize(1920, 1080);
    me.refs.container.appendChild(env.domElement);
  }

  componentWillUnmount() {
  }

  appear() {
    const me = this;

    const env = me._env;
    env.startRender();
    env.appear();
  }

  disappear() {
  }

  highlight(index) {
    const me = this;
    const env = me._env;
    env.lookAt(index);
  }

  unhighlight(index) {
    const me = this;
    const env = me._env;
    env.updateBallStyle(index, '#FFF', 1);
    env.lookAt();
  }

  seal(index) {
    const me = this;
    const env = me._env;
    env.updateBallStyle(index, '#FFFF00', 1.5);
  }
}

export default VisTree;
