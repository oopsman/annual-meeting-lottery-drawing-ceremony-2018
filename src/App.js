import React, {Component} from 'react';
import axios from 'axios';
import ResizeManager from './component/common/ResizeManager';
import './App.css'
import VisTree from './component/vis-tree/VisTree';
import Disclaimer from './component/info/Disclaimer';
import CandidatePanel from './component/panel/CandidatePanel';

/**
 * 主容器，包含抽奖业务和展示控制逻辑。
 * @author Molay
 */
class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const me = this;

    return (
      <div className={'main'}>
        <ResizeManager fullWidth='1920' fullHeight='1080' mode={ResizeManager.MODE_DEBUG}/>
        <VisTree ref={'visTree'}/>
        <CandidatePanel ref={'candidatePanel'} onChoose={(code) => {
          me.decide(code);
        }}/>
        <div className={'buttons'}>
          <button style={{display: 'none'}}>RESET</button>
          <button onClick={() => {
            if (me._drawLotteryFlag) return;
            me._drawLotteryFlag = true;
            me.drawLottery();
          }}>
            GO
          </button>
        </div>
        <Disclaimer ref={'disclaimer'} onClose={() => {
          const refs = me.refs;
          refs.disclaimer.setState({
            visible: false
          });
          refs.visTree.appear();
          me.reset();
        }}/>
      </div>
    );
  }

  componentDidMount() {
    const me = this;
  }

  componentWillUnmount() {
  }

  /**
   * 总计多少号码牌。
   * @type {number|undefined}
   * @private
   */
  _total = 1000;

  /**
   * 抽奖池。
   * @type {Array|undefined}
   * @private
   */
  _pool = undefined;

  /**
   * 获奖清单。
   * @type {Array|undefined}
   * @private
   */
  _winnerList = undefined;

  /**
   * 暂存当前生成的数组随机下标。
   * @type {number|undefined}
   * @private
   */
  _currentRand = undefined;

  /**
   * 暂存当前抽中的号码。
   * @type {number|undefined}
   * @private
   */
  _currentN = undefined;

  /**
   * 重置抽奖环境，此行为将会清除当前已抽出的号码信息。
   */
  reset() {
    const me = this;
    me._winnerList = [];

    const total = me._total;

    const pool = [];
    for (let i = 0; i < total; i++) {
      pool.push(i + 1);
    }
    console.log(pool);
    me._pool = pool;
  }

  /**
   * 抽奖，首先尝试读取random.org的API获取真随机数，
   * 如果获取失败，则使用内置伪随机数生成算法。
   */
  drawLottery() {
    const me = this;
    // result include min and max
    const min = 0;
    const max = (me._pool || []).length - 1;
    axios
      .get(
        [
          'https://www.random.org/integers/?num=1',
          '&min=', min,
          '&max=', max,
          '&col=1&base=10&format=plain&rnd=new'
        ].join('')
      )
      .then(response => {
        console.log(response);
        me.candidate(Math.floor(Number(response.data)));
      })
      .catch(error => {
        console.log(error);
        const rand = Math.round(min + (max - min) * Math.random());
        me.candidate(rand);
      })
  }

  /**
   * 因为号码不连续，人工干预判断随机得出的号码是否可以中奖。
   * @param rand
   */
  candidate(rand) {
    const me = this;
    const refs = me.refs;
    const visTree = refs.visTree;
    const candidatePanel = refs.candidatePanel;
    const pool = me._pool;

    const n = pool[rand];
    me._currentN = n;

    console.log('Current pick:', n);

    visTree.highlight(n - 1);
    candidatePanel.setState({
      number: n
    });
    candidatePanel.appear();
  }

  /**
   * 决定当前号码是否中奖还是丢弃（只要抽出，结果都是丢弃）。
   * @param code
   */
  decide(code) {
    const me = this;
    const refs = me.refs;
    const visTree = refs.visTree;
    const candidatePanel = refs.candidatePanel;
    const pool = me._pool;
    const rand = me._currentRand;
    const n = me._currentN;

    pool.splice(rand, 1);
    visTree.unhighlight(n - 1);
    candidatePanel.disappear();
    me._drawLotteryFlag = false;
    console.log('Abandon number:', n);

    // yes
    if (code === 0) {
      visTree.seal(n - 1);
      console.log('Congratulations number:', n);
    }
    // no
    else if (code === 1) {
    }
  }
}

export default App;
