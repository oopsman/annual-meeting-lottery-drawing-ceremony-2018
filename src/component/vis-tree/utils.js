import * as THREE from 'three';
import {
  ParticleSystem
} from '@jusfoun-vis/threejs-chart';
import vis_tree_tray_obj from './obj/vis-tree-tray.obj';
import vis_tree_body_obj from './obj/vis-tree-body.obj';
import white_dot_image from './image/white-dot.png';

/**
 * 2π
 * @type {number}
 */
const DP = Math.PI * 2;

/**
 * 单位角（弧度制）
 * @type {number}
 */
const UA = Math.PI / 180;

export {
  DP,
  UA
}

const isNumber = function (n) {
  return typeof n === 'number' && isFinite(n);
};

export {
  isNumber
};

/**
 * 获取指定数值正负范围内的随机抖动。
 * @author Molay
 * @param n
 * @return {number}
 */
const pulsate = function (n) {
  return -n + Math.random() * 2 * n;
};

/**
 * 将粗糙直线曲线化。
 * @private
 */
const curveIt = function (object3d, smoothing) {
  smoothing = smoothing || 10;

  let geometry = object3d.geometry;
  if (geometry instanceof THREE.BufferGeometry) {
    geometry = new THREE.Geometry();
    const positionAttr = object3d.geometry.attributes.position;
    for (let i = 0, n = positionAttr.count; i < n; i++) {
      geometry.vertices.push(new THREE.Vector3(
        positionAttr.getX(i),
        positionAttr.getY(i),
        positionAttr.getZ(i)
      ));
    }
  }
  const curve = new THREE.CatmullRomCurve3(geometry.vertices);
  const points = curve.getPoints(geometry.vertices.length * smoothing);

  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.addAttribute('position',
    new THREE.Float32BufferAttribute(points.length * 3, 3).copyVector3sArray(points));
  object3d.geometry = bufferGeometry;

  return object3d;
};

export {
  pulsate,
  curveIt
}

/**
 * 创建底盘（土地）。
 * @private
 */
const createTray = function () {
  // bypassing
  const LIB = THREE;

  const objLoader = new LIB.OBJLoader();
  const geometry = objLoader.parse(vis_tree_tray_obj).children[0].geometry;

  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.addAttribute('position', geometry.attributes.position);

  const line = new THREE.Line(bufferGeometry);
  curveIt(line);
  return line;
};

/**
 * 创建树本体。
 * @private
 */
const createTree = function () {
  // bypassing
  const LIB = THREE;

  const objLoader = new LIB.OBJLoader();
  const geometry = objLoader.parse(vis_tree_body_obj).children[0].geometry;

  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.addAttribute('position', geometry.attributes.position);

  const line = new THREE.Line(bufferGeometry);
  curveIt(line);
  return line;
};

/**
 * 依据已知几何体，创建均匀分布点。
 * @param geometry
 * @param start
 * @param end
 * @param n
 * @private
 */
const createBalls = function (geometry, start, end, n) {
  n = n || 1;
  const positionAttr = geometry.attributes.position;
  const points = [];
  const di = (end - start) / n;
  for (let i = start; i < end; i += di) {
    i = Math.round(i);
    points.push(new THREE.Vector3(
      positionAttr.getX(i),
      positionAttr.getY(i),
      positionAttr.getZ(i)
    ));
  }

  const bufferGeometry = new THREE.BufferGeometry();
  bufferGeometry.addAttribute('position',
    new THREE.Float32BufferAttribute(points.length * 3, 3).copyVector3sArray(points));

  const balls = new ParticleSystem(bufferGeometry, {
    size: 4,
    color: '#FFFFFF',
    opacity: 0.7,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    map: new THREE.TextureLoader().load(white_dot_image)
  });
  return balls;
};

export {
  createTray,
  createTree,
  createBalls
}
