# Three.js 空间动画实验指南

v0.8 在 `/labs/threejs` 增加一个独立的 Three.js / WebGL 实验阶段。目标不是把
所有动画升级成 3D，而是建立一条清楚的判断线：只有信息真实依赖相机、透视、深度、
材质、光照、三维模型或 GPU 图元时，才值得承担空间运行时的工程成本。

## Three.js 在技术地图中的位置

| 技术 | 主要坐标系统 | 最适合解决的问题 | 不应接管的职责 |
|---|---|---|---|
| CSS / SVG | DOM 布局与二维矢量 | 常规 UI、图标、路径与状态反馈 | 大量逐帧图元与三维空间 |
| Motion / GSAP | DOM / SVG 状态与时间线 | React 交互、布局过渡、复杂编排 | 3D 渲染管线 |
| D3 | 数据域到几何域 | 比例尺、布局、路径和数据转换 | 持有完整播放与场景生命周期 |
| Canvas 2D | 屏幕二维坐标 | 粒子、轨迹、高密度二维即时绘制 | 原生语义、真实相机和深度遮挡 |
| Three.js | 三维世界坐标与 GPU 场景图 | 相机叙事、3D 模型、材质、光照与空间命中 | 文本、表单、按钮、普通二维界面 |
| Remotion / HyperFrames | 帧与离线输出 | 可重复的视频生产 | 网页实时交互运行时 |

Three.js 不是 Motion、GSAP 或 D3 的替代品。它管理空间场景与 GPU 渲染；React
继续管理业务状态和语义控件，Motion / GSAP 仍可管理 DOM 层动画，D3 仍可生成数据几何。

## 参考作品：Spatial Signal Field

空间信号场把同一组指标映射为三种场景状态：

1. **信号星群**：用半径与方向观察核心、增长和留存信号。
2. **分层映射**：把节点展开到不同高度和深度，强调结构层级。
3. **聚焦路径**：把点云改写为沿 X 轴推进的螺旋路径，强调叙事顺序。

画布支持拖动相机、滚轮缩放和射线点击。相同的三个信号也始终提供原生按钮，保证
键盘、读屏和 WebGL 不可用时仍能访问相同信息。

## React 与 Three.js 的边界

页面本身保持 Server Component。一个很小的 Client Component 使用 `next/dynamic`
且关闭 SSR，只有进入 Three.js 路由时才加载场景代码和运行时。

React 只拥有以下低频状态：

- 空间模式、质量档位、暂停、自动环绕和减少动效策略；
- 当前选中的信号；
- 每 500ms 更新一次的性能遥测。

Three.js 控制器拥有以下高频状态：

- 相机、OrbitControls、Raycaster 和场景图对象；
- 点云的当前位置与目标位置；
- 每帧插值、旋转、渲染与 renderer.info 采样。

禁止把每个点的位置或相机姿态写入 React state。这样可以避免用组件树重渲染驱动
GPU 帧循环，也让场景生命周期可以在路由卸载时集中结束。

## 生命周期与清理

初始化时建立 Renderer、Scene、Camera、Controls、Geometry、Material 和
ResizeObserver；运行时使用 `renderer.setAnimationLoop()` 驱动帧循环。暂停或减少
动效时停止循环，直接落到目标位置，并只在相机控制发生变化时补画一帧。

卸载时按以下顺序清理：

1. `setAnimationLoop(null)` 停止渲染；
2. 断开 ResizeObserver 与 OrbitControls 事件；
3. 遍历并去重释放 BufferGeometry 和 Material；
4. 调用 `controls.dispose()` 与 `renderer.dispose()`。

仅从 Scene 移除对象不会释放 GPU buffer。Three.js 官方清理指南要求由应用显式调用
资源的 `dispose()`；`renderer.info` 可用于观察 geometry、texture 与 draw call。

## 性能实验参数

| 档位 | 点数量 | DPR 上限 | 用途 |
|---|---:|---:|---|
| 节能 | 480 | 1× | 移动设备、低功耗或辅助背景 |
| 均衡 | 1,200 | 1.5× | 默认交互体验 |
| 压力 | 2,600 | 2× | 观察高密度与高分辨率成本 |

点云使用一个 BufferGeometry 和一个 PointsMaterial，而不是为每个点建立 Mesh。
界面展示 FPS、平均帧时、DPR、draw calls、点图元和 geometry 数量，但只以 500ms
频率同步到 React。FPS 只是当前设备上的观察值，产品决策还需要低端设备、长任务、
输入延迟、温度与电量数据。

## 减少动效与失败后备

- 系统 `prefers-reduced-motion` 或手动模拟开启时，停止循环和自动相机运动；
- 点云与节点直接落到最终状态，信息不因减少动效而消失；
- 暂停后仍可用 OrbitControls 手动观察，每次变化只渲染一帧；
- Renderer 创建失败时显示中文后备说明，原生信号按钮和洞察仍保持可用。

## 默认决策

1. 普通 UI 从 CSS / SVG + Motion 开始。
2. 数据几何用 D3，高密度二维图元用 Canvas。
3. 只有产品含义依赖三维坐标、相机、深度、模型或 GPU 管线时才进入 Three.js。
4. 进入 Three.js 后仍保持 DOM / Canvas 分层，不把整页界面画进 WebGL。
5. 若多个复杂 React 3D 作品反复出现声明式场景组合需求，再评估 React Three Fiber；
   v0.8 先掌握原生生命周期，不提前引入抽象层。

## 官方依据

- [WebGLRenderer API](https://threejs.org/docs/pages/WebGLRenderer.html)
- [OrbitControls API](https://threejs.org/docs/pages/OrbitControls.html)
- [Three.js Cleanup](https://threejs.org/manual/en/cleanup.html)
- [How to dispose of objects](https://threejs.org/manual/en/how-to-dispose-of-objects.html)
- [Responsive design](https://threejs.org/manual/en/responsive.html)
