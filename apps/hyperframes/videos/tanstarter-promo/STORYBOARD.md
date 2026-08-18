---

## Video direction

- 视觉骨架：code-editorial，经捕获 token 重映射为 TanStarter 的白、黑与金黄；深色只用于终端/代码表面。
- 主电流：LEFT。所有普通场景切口均使用同轴、同向、速度匹配的 cut-the-curve；不使用 crossfade。
- 持续运动：每个场景分别使用 staged reveals、camera with intent、sequenced UI life 或 animated sequences；禁止用漂浮、呼吸、光晕循环填时间。
- 文字：操作说明、旁白与字幕使用简体中文；仓库命令、技术名和真实界面文案保留英文。
- 声音：低调、精确的技术脉冲音乐；旁白清晰自然，不做激昂广告腔。
- 高潮：Frame 7 命令出现前保留约 0.5 秒静止，形成动作与结果之间的停顿。
format: 1920x1080
duration: 41.8s
message: "TanStarter 把现代 TanStack 全栈基础压缩成一个可理解、可删除、可继续生长的最小起点"
arc: "BAB：重复脚手架 → 最小起点 → 真实基础能力 → 直接写产品"
audience: "正在选择 TanStack Start 项目起点的独立开发者与小型产品团队"
mode: autonomous
language: zh-CN
music: "confident minimal technical pulse, restrained and precise"
captions: true
---

## Frame 1 — 不要再从脚手架开始

- scene: 四个“重复准备”词组沿同一条横向轨道快速掠过，最后被一句结果导向的主张接管画面。
- voiceover: "你的下一个产品，不该从重复搭脚手架开始。"
- duration: 4.2s
- poster: 3.2s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Friction reduction
- beat: frustration → relief
- blueprint: kinetic-type-beats (Adapt)
- focal: typography-only
- roles: no external assets
- asset_candidates:

Adapt: 保留固定中心、短语替换和最终主张停留的签名动作；删除氛围漂浮与复杂字形特效，让痛点像编译日志一样快速、克制地被清空。

- Scene 1 (0–0.8s): “AUTH” 在中心硬切出现，使用 `discrete-text-sequence`，背景保持固定。
- Scene 2 (0.8–2.2s): “ROUTES / DATABASE / TOOLING” 依次沿同一槽位硬切替换，使用 `kinetic-beat-slam` 和 `dynamic-content-sequencing`；上一词不残留。
- Scene 3 (2.2–3.6s): 四个准备词组沿 LEFT 方向快速离场，中文主张分两拍接管中心，使用 `gsap-effects` 的短距位移与 `discrete-text-sequence`。
- Scene 4 (3.6–4.2s): “不该从重复搭脚手架开始”静态停留，仅保留金黄句点；场景包装器继续为切口积累左向速度。

narrativeRole: 用开发者熟悉的重复劳动建立张力，并在第一拍就给出“跳过它”的结果承诺。
keyMessage: 产品工作应当先于脚手架工作。

## Frame 2 — 一个最小、清晰的起点

- scene: TanStarter 官方首页从局部命令框拉远到完整首屏，产品名与“minimal”主张被金黄色标记锁定。
- voiceover: "TanStarter，把现代全栈基础压缩成一个最小、清晰、能直接继续写的起点。"
- duration: 6.4s
- poster: 4.5s
- transition_in: cut
- status: animated
- src: compositions/frames/02-promise.html
- type: product_intro
- persuasion: Value proposition
- beat: clarity + control
- blueprint: zoom-out-workspace-reveal (Adapt)
- focal: assets/scroll-000.png
- roles: background: assets/scroll-000.png
- asset_candidates: assets/scroll-000.png — 1920×1080 官方预览首屏，包含品牌、主张与安装命令

Adapt: 保留“局部命令 → 完整产品首屏”的单次减速拉远；近景命令用 DOM 重建保证锐利，真实截图作为产品证据和最终环境，不把低分辨率位图过度放大。

- Scene 1 (0–1.5s): 画面紧贴 DOM 重建的命令行，截图只在后方提供页面上下文；使用 `coordinate-target-zoom` 的轻度近景，不超过可接受的位图放大范围。
- Scene 2 (1.5–3.9s): 单一相机包装器减速拉远至完整首屏，使用 `viewport-change`；禁止同时移动截图内部元素。
- Scene 3 (3.9–5.5s): 金黄标记线从左到右划过 “minimal”，使用 `css-marker-patterns`；产品名和主张保持固定。
- Scene 4 (5.5–6.4s): 完整首屏静态停留，命令框成为视线落点，字幕带保持净空。

narrativeRole: 在第二拍明确产品承诺，并用真实页面证明这是仓库自身的定位。
keyMessage: “最小”意味着清晰的现代基础，而不是空白项目。

## Frame 3 — 一条命令，核心就位

- scene: 终端输入 `pnpm create mugnavo`，命令提交后四个核心模块沿路径依次接入项目树。
- voiceover: "一条命令，得到 React 19、TanStack Start、Router 和 Query。"
- duration: 5.1s
- poster: 4.1s
- transition_in: cut
- status: animated
- src: compositions/frames/03-command.html
- type: feature_showcase
- persuasion: Effort reduction
- beat: momentum + confidence
- blueprint: prompt-type-submit-generate (Adapt)
- focal: generated terminal command
- roles: no external assets
- asset_candidates:

Adapt: 保留“输入—提交—结果生成”的因果链，把生成结果从泛化内容改为真实依赖模块；不模拟不存在的安装进度或成功指标。

- Scene 1 (0–0.9s): 黑色终端胶囊从中心横向展开，使用 `card-morph-anchor`，尺寸变化只用 transform/clip-path。
- Scene 2 (0.9–2.6s): `pnpm create mugnavo` 逐字输入，使用 `discrete-text-sequence` 和 `context-sensitive-cursor`。
- Scene 3 (2.6–4.3s): React 19、TanStack Start、Router、Query 四个模块沿项目主线依次接入，使用 `dynamic-content-sequencing` 和 `svg-path-draw`。
- Scene 4 (4.3–5.1s): 四模块锁定为一个清晰项目树，光标停止，结果停留供阅读。

narrativeRole: 把“起点”变成一个可执行动作，并建立后续能力拼装的视觉语法。
keyMessage: 核心 React/TanStack 能力由一条创建命令进入项目。

## Frame 4 — 身份、数据、类型安全

- scene: Better Auth 与 Drizzle/PostgreSQL 两个结构面板并排展开，类型连线从 Router 穿过 server functions 汇入两侧。
- voiceover: "Better Auth 管身份，Drizzle 连接 PostgreSQL；类型安全，从路由延伸到服务端。"
- duration: 6.8s
- poster: 5.4s
- transition_in: cut
- status: animated
- src: compositions/frames/04-foundation.html
- type: feature_showcase
- persuasion: Risk reduction
- beat: trust + control
- blueprint: comparison-split (Adapt)
- focal: generated architecture diagram
- roles: no external assets
- asset_candidates:

Adapt: 保留左右双面板与中央关系揭示，但双方不是竞品比较，而是同一生产基础的身份与数据两翼；移除漂浮、循环光晕和虚构性能数字。

- Scene 1 (0–1.1s): “Production foundation”与中央类型主线建立，使用 `discrete-text-sequence`。
- Scene 2 (1.0–3.0s): Better Auth 与 Drizzle / PostgreSQL 两张卡从中心向两侧镜像展开，使用 `split-tilt-cards` 的平面化变体。
- Scene 3 (3.0–5.7s): 类型连线从 Router 经 server functions 绘向两侧，使用 `svg-path-draw` 和 `dynamic-content-sequencing`；节点在旁白提及时依次点亮。
- Scene 4 (5.7–6.8s): 两侧卡片与完整类型路径共同停留，不再增加循环动作。

narrativeRole: 证明这个最小起点已经覆盖真实应用最容易重复出错的身份、数据与边界类型。
keyMessage: Auth、数据库和端到端类型约束已经形成一套可继续扩展的基础。

## Frame 5 — 界面与工具链同样克制

- scene: shadcn/ui、Base UI、Vite+、Oxlint、Oxfmt 以非等宽模块逐层组装；每一层出现时同步点亮其负责的工作。
- voiceover: "shadcn/ui 与 Base UI 负责界面；Vite+、Oxlint、Oxfmt，把开发和检查收进同一条工具链。"
- duration: 8.1s
- poster: 5.2s
- transition_in: cut
- status: animated
- src: compositions/frames/05-toolchain.html
- type: feature_showcase
- persuasion: Value stacking
- beat: speed + order
- blueprint: grid-card-assemble (Adapt)
- focal: assets/scroll-100.png
- roles: supporting: assets/scroll-100.png
- asset_candidates: assets/scroll-100.png — 官方预览下半屏，包含真实依赖版本徽章与 cleanup checklist

Adapt: 保留模块直接进入各自槽位的组装动作；限制为五个真实工具，删除慢推镜、漂浮和旅行光晕，最后用官方版本徽章条作为仓库证据。

- Scene 1 (0–1.3s): 标题与 shadcn/ui、Base UI 两张界面卡直接进入上层槽位，使用 `center-outward-expansion` 的短路径变体。
- Scene 2 (1.3–3.8s): Vite+、Oxlint、Oxfmt 三张工具卡依次组装到下层，使用 `gsap-effects` 的低振幅 stagger。
- Scene 3 (3.8–6.7s): 一条工具链从开发指向检查与格式化，使用 `svg-path-draw` 和 `dynamic-content-sequencing` 逐段点亮。
- Scene 4 (6.7–8.1s): 从官方截图裁出的真实版本徽章条进入底部证据位，所有模块静态停留。

narrativeRole: 将界面层和工程工具层翻译为同一个收益：更少切换、更少重复配置。
keyMessage: UI 与开发工具链都已选好，但仍保持可理解和可替换。

## Frame 6 — 保留该留的，删除其余

- scene: 官方页面中的 cleanup checklist 被放大，三个可删除示例依次划走；真实目录树在右侧收束成产品代码的空位。
- voiceover: "默认界面保持极简。认证路由、主题切换和开发工具已经就位；其余，留给产品本身。"
- duration: 7s
- poster: 5.3s
- transition_in: cut
- status: animated
- src: compositions/frames/06-cleanup.html
- type: benefit_highlight
- persuasion: Negative contrast
- beat: relief + ownership
- blueprint: transcript-scroll-artifact-reveal (Adapt)
- focal: assets/full-page.png
- roles: background: assets/full-page.png
- asset_candidates: assets/full-page.png — 1920×1294 官方完整页面，包含 cleanup checklist 和仓库的最小化说明

Adapt: 保留“滚动找到证据—展开细节—产出结果”的结构，把长页面当作真实可滚动文档；删除终端输入假动作，以 cleanup checklist 的真实内容驱动清场。

- Scene 1 (0–2.6s): 完整页面在固定视窗内向 cleanup 区域滚动，使用 `3d-page-scroll` 的平面元素滚动；滚动层标记 `data-layout-allow-overflow`。
- Scene 2 (2.6–4.4s): cleanup checklist 从页面位置展开为前景卡，使用 `anchored-layout-expand`；背景页面停止滚动。
- Scene 3 (4.4–6.2s): 三个示例路径按顺序向 LEFT 划走并删除，使用 `dynamic-content-sequencing` 和 `nudge-curve`，不同时移动相机。
- Scene 4 (6.2–7.0s): 右侧简化项目树露出产品代码空间，金黄标签“YOUR PRODUCT”落位后静态停留。

narrativeRole: 用仓库主动标出的可删除内容证明它不会把演示代码伪装成产品架构。
keyMessage: TanStarter 清楚地区分基础设施、示例和真正的产品代码。

## Frame 7 — 直接写产品

- scene: 前面所有模块沿左向电流清场，TanStarter 名称固定；终端胶囊输入创建命令并保持光标闪烁。
- voiceover: "少写脚手架，直接写产品。TanStarter。"
- duration: 4.2s
- poster: 3.8s
- transition_in: cut
- status: animated
- src: compositions/frames/07-cta.html
- type: cta
- persuasion: Action simplification
- beat: motivation + inevitability
- blueprint: prompt-type-submit-generate (Adapt)
- focal: generated command end card
- roles: no external assets
- asset_candidates:

Adapt: 保留命令胶囊的展开与输入，但将生成结果改为最终品牌锁定；先让主张完整停顿，再出现动作，避免结尾像第二次功能演示。

- Scene 1 (0–1.0s): “少写脚手架，直接写产品。”按词组从左向中心接力出现，使用 `dynamic-content-sequencing`。
- Scene 2 (1.0–1.6s): 主张完全静止约 0.6 秒，形成高潮前停顿。
- Scene 3 (1.6–3.3s): 终端胶囊横向展开并输入 `pnpm create mugnavo`，使用 `card-morph-anchor`、`discrete-text-sequence` 和 `context-sensitive-cursor`。
- Scene 4 (3.3–4.2s): TanStarter 名称与命令共同停留，只允许光标按上下文闪烁，不添加氛围循环。

narrativeRole: 把整条片子的价值压回一个可立即执行的动作，形成明确而不过度营销的收尾。
keyMessage: 使用 `pnpm create mugnavo`，从产品代码开始。
