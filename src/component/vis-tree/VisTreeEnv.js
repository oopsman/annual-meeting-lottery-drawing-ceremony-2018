import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import {
  InteractiveGroup
} from '@jusfoun-vis/threejs-common';
import {
  General3DEnv, WaveEffect, ParticleSystem
} from '@jusfoun-vis/threejs-chart';
import {
  DP, UA,
  isNumber,
  pulsate, curveIt,
  createTray, createTree, createBalls
} from './utils';

/**
 * 主要的3D环境。
 * @author Molay
 */
class VisTreeEnv extends General3DEnv {
  constructor() {
    super();

    const me = this;
    me.initialize();
  }

  /**
   * 主容器。
   * @private
   */
  _group = undefined;
  /**
   * 底盘（土地）。
   * @private
   */
  _tray = undefined;
  /**
   * 树本体。
   * @private
   */
  _tree = undefined;
  /**
   * 粒子球集合。
   * @private
   */
  _balls = undefined;

  _cameraPosition = undefined;
  _controlsTarget = undefined;

  /**
   * 初始化3D对象。
   * @private
   */
  _initObjects() {
    const me = this;

    const group = me._group = new InteractiveGroup();
    me.addObject(group);
    // group.rotation.y = Math.random() * DP;

    const tray = me._tray = createTray();
    tray.material = new THREE.LineBasicMaterial({
      // color: '#FF0000',
      color: '#1DA9D2',
      transparent: true,
      // opacity: 0.15,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });
    // tray.rotation.y = Math.random() * DP;
    group.addObject(tray);

    const tree = me._tree = createTree();
    group.addObject(tree);
    const waveEffect = me._waveEffect = new WaveEffect('#7D247F', '#1DA9D2', 0.3, 0.5);
    waveEffect.effect(tree, 100);
    tree.material.blending = THREE.AdditiveBlending;

    const balls = me._balls = createBalls(tree.geometry, 20000, 95000, 1000);
    balls.interactive = true;
    balls.buttonMode = true;
    group.addObject(balls);

    // hide for appear
    tray.geometry.setDrawRange(0, 0);
    tree.geometry.setDrawRange(0, 0);
    balls.geometry.setDrawRange(0, 0);
  }

  _initFinally() {
    const me = this;
    const camera = me.camera;
    const renderer = me.renderer;
    const controls = me.controls;

    camera.position.set(-76.83293962900859, 101.22800372899032, 379.85566813934776);
    controls.update();

    controls.enableZoom = false;
    controls.enablePan = false;

    renderer.setPixelRatio(1);

    // just test
    // me.domElement.addEventListener('dblclick', function () {
    //   me.lookAt(Math.random() * 1000);
    // });
  }

  /**
   * 更新指定粒子的样式。
   * @param index
   * @param color
   * @param scale
   */
  updateBallStyle(index, color, scale) {
    const me = this;
    const balls = me._balls;

    if (color) balls.setColor(color, index);
    if (typeof scale === 'number' && isFinite(scale))
      balls.setScale(scale, index);
  }

  appear() {
    const me = this;
    const tray = me._tray;
    const trayGeometry = tray.geometry;
    const trayN = trayGeometry.attributes.position.count;
    const tree = me._tree;
    const treeGeometry = tree.geometry;
    const treeN = treeGeometry.attributes.position.count;

    new TWEEN.Tween({t: 0})
      .to({t: 1}, 3000)
      .delay(0)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function (o) {
        const t = o.t;
        trayGeometry.setDrawRange(0, t * trayN);
      })
      .start();

    new TWEEN.Tween({t: 0})
      .to({t: 1}, 3000)
      .delay(1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function (o) {
        const t = o.t;
        treeGeometry.setDrawRange(0, t * treeN);
      })
      .start();

    const balls = me._balls;
    const ballsGeometry = balls.geometry;
    const ballsN = ballsGeometry.attributes.position.count;

    new TWEEN.Tween({t: 0})
      .to({t: 1}, 2000)
      .delay(2000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function (o) {
        const t = o.t;
        ballsGeometry.setDrawRange(0, t * ballsN);
      })
      .start();
  }

  render() {
    const me = this;
    const group = me._group;
    const waveEffect = me._waveEffect;
    const balls = me._balls;

    // group.rotation.y += UA * 0.1;
    waveEffect.t += UA * 3;
    balls.t += UA * 3;
  }

  lookAt(index) {
    const me = this;
    const camera = me.camera;
    const controls = me.controls;
    const balls = me._balls;

    // revert last index
    if (isNumber(me._index)) {
      balls.setColor('#FFFFFF', me._index);
      balls.setScale(1, me._index);
      me._index = undefined;
    }

    // look at
    if (isNumber(index)) {
      if (!me._cameraPosition && !me._controlsTarget) {
        me._cameraPosition = camera.position.clone();
        me._controlsTarget = controls.target.clone();
      }

      index = Math.floor(index);
      me._index = index;

      const position = balls.getPosition(index);

      const cameraPosition0 = camera.position.clone();
      const cameraPosition1 = new THREE.Vector3(0, position.y, 0)
        .sub(position)
        .normalize()
        .multiplyScalar(-10)
        .add(position);
      const controlsTarget0 = controls.target.clone();
      const controlsTarget1 = position.clone();

      balls.setColor('#FF0000', index);
      balls.setScale(10, index);

      me._moveCamera(
        cameraPosition0,
        cameraPosition1,
        controlsTarget0,
        controlsTarget1
      );
    }
    // go back
    else if (me._cameraPosition && me._controlsTarget) {
      me._moveCamera(
        camera.position,
        me._cameraPosition,
        controls.target,
        me._controlsTarget
      );
      me._cameraPosition = undefined;
      me._controlsTarget = undefined;
    }
  }

  _moveCamera(cameraPosition0, cameraPosition1, controlsTarget0, controlsTarget1) {
    const me = this;
    const camera = me.camera;
    const controls = me.controls;

    // console.log(cameraPosition0, cameraPosition1, controlsTarget0, controlsTarget1);

    new TWEEN.Tween({t: 0})
      .to({t: 1}, 2000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onUpdate(function (o) {
        const t = o.t;
        camera.position.set(
          cameraPosition0.x + (cameraPosition1.x - cameraPosition0.x) * t,
          cameraPosition0.y + (cameraPosition1.y - cameraPosition0.y) * t,
          cameraPosition0.z + (cameraPosition1.z - cameraPosition0.z) * t
        );
        controls.target.set(
          controlsTarget0.x + (controlsTarget1.x - controlsTarget0.x) * t,
          controlsTarget0.y + (controlsTarget1.y - controlsTarget0.y) * t,
          controlsTarget0.z + (controlsTarget1.z - controlsTarget0.z) * t
        );
        controls.update();
      })
      .start();
  }
}

export default VisTreeEnv;
