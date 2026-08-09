# 设计语言确认清单(Design Standards Checklist)

> **这是什么**:把 trust-system / 项目矩阵开发中沉淀的设计决策,逐项过审、成文、落 demo,
> 最终形成「y 系列项目共享同一套设计语言」的完整标准。
>
> **每一项的完成定义(DoD)**——缺一不可:
> 1. **确认**:你对该项的标准拍板(本清单打勾,争议点写在条目下);
> 2. **成文**:标准写进 `AGENTS.md`(英文,规则式、可执行,像现有 System-header icon row 那节);
> 3. **Demo**:`/ui/*` 下有 demo 页,覆盖该项列出的全部状态(含暗色 + compact 密度);
> 4. **台账**:`.roadmap/features.yaml` 增补/更新对应条目。
>
> **状态标记**:✅ 已成型(已有实现+规范) 🟡 有底子(有实现但标准未成文/不完整) ⬜ 缺失
>
> **建议确认顺序**:J(状态色)→ H(Icon)→ A(布局)→ B(异步边界)→ C(反馈)→
> D(表单)→ E(表格)→ F(补组件,按 D/E 的需要拉)→ G(Dashboard)→ L(弹层)→
> I(排版文案)→ N(URL/数据层)→ M(标准页面库)。
> J/H 最先,因为后面所有 demo 都要引用状态色和 icon 语义;D/E 是工作量大头。

---

## A. 布局与页面骨架

- [ ] **A1 · App Shell** ✅
  三种导航布局(vertical / mini-rail / horizontal)+ 移动端 drawer 已成型。
  确认点:三种布局下 PageHeader 的 sticky 偏移是否都正确;horizontal 布局下二级导航的去处。
- [ ] **A2 · PageHeader 全页强制** 🟡
  组件已有(icon tile / title / description / titleSuffix / actions / toolbar / tabs / sticky)。
  待成文的规则:**每个页面必须以 `<PageHeader>` 开头**,禁止手写标题行;
  各 slot 的语义(actions 放主操作,toolbar 放筛选,titleSuffix 放状态)。
- [ ] **A3 · PageHeader 子 tab 形态** 🟡
  tabs slot 已支持「下划线贴 band 底边」。确认:统一用 underline 式 tab(贴 header 底边)
  作为**页面级**导航;Card 内部的**局部** tab 用 shadcn 默认的 segmented 式 —— 两种形态各司其职,不混用。
  确认 tab 与 URL 的关系(子路由 vs searchParam,见 N1)。
- [ ] **A4 · Card = 功能模块的唯一容器** ⬜(核心规则,需成文)
  一个页面的每个大功能(一个表单、一个表格、一组统计)各占一个 `<Card>`;
  多个功能 = 多个 Card 并列,**禁止**裸 div 分区、禁止一个 Card 塞两个不相关功能。
  Card 内结构:`CardHeader`(标题 + 描述 + 右上角局部 action)→ `CardContent`;
  确认 Card 之间的标准间距(建议统一 `gap-4`/`gap-6` 二选一)。
- [ ] **A5 · 虚线分隔线(dashed separator)** ⬜(你已有明确偏好,需成文)
  Card **内部**的功能区段用虚线隔开:表格的 toolbar 区 / 表体 / pagination 区;
  表单的 section 之间;详情页的字段组之间。
  实线 `<Separator>` 只用于 Card 外(如导航);Card 内一律虚线 —— 确认这条二分法。
- [ ] **A6 · 页面布局模板库** ⬜
  固定几种页面骨架并配 demo:
  ① 单列流(默认);② 主内容 + 右侧 meta 栏(详情页);③ 左侧锚点/子导航 + 内容(设置页);
  ④ 全高应用页(不随页面滚动,内部自滚,如聊天/编辑器);⑤ 居中窄列(向导、auth)。
- [ ] **A7 · 底部粘性操作栏** ⬜
  长表单页的「保存/取消」栏:sticky 底部、上边框虚线、dirty 时才出现(或常驻?)—— 需拍板。
- [ ] **A8 · 响应式断点行为** 🟡
  统一各断点的降级规则:表格→卡片列表?两列→单列的断点;PageHeader actions 换行已实现。
  确认标准断点集(建议只用 `sm/md/lg/xl` 四档,禁用任意值)。

## B. 异步边界(Async Boundary)

- [ ] **B1 · 四态标准** ⬜(核心)
  每个数据区块(通常 = 一个 Card)必须显式处理 **loading / error / empty / success** 四态。
  逐一确认每态的标准形态:
  - loading:**Skeleton 优先**(形状贴近真实内容),Spinner 只用于按钮内和局部刷新;
  - error:Card 内 inline 错误(icon + 一句话 + Retry 按钮),**不是**整页 StatusPage;
  - empty:基于 `<Empty>` primitive —— icon + 标题 + 一句描述 + 主 CTA(可选);
  - 区分「真空」(没有数据 → 引导创建)和「筛选后空」(→ 清除筛选按钮)。
- [ ] **B2 · `<AsyncBoundary>` 封装** ⬜
  做一个标准组件把 react-query 的四态收敛:`<AsyncBoundary query={q} empty={...}>{data => ...}</AsyncBoundary>`,
  让每个 Card 不用手写 if/else。这是保证四态**长得一致**的机制,不只是规范。
- [ ] **B3 · 骨架屏套件** ⬜
  预制骨架:`TableSkeleton`(N 行)、`CardSkeleton`、`FormSkeleton`、`StatSkeleton`、`ChartSkeleton`,
  与真实组件同尺寸,避免加载完成跳动。route 级 loading.tsx 已有 ✅,这里指 Card 级。
- [ ] **B4 · 刷新中态(isFetching)** ⬜
  已有数据、后台刷新时:内容保持 + 右上角小 spinner / 顶部 2px 进度条 —— 二选一拍板;
  **禁止**刷新时整块退回骨架屏。
- [ ] **B5 · 乐观更新与回滚** ⬜
  哪些操作默认乐观(开关、点赞、排序),失败回滚 + error toast 的标准写法(react-query onMutate 模板)。
- [ ] **B6 · 分页/加载更多的加载态** ⬜
  翻页时表体保持 + 半透明遮罩?「加载更多」按钮态?与 E7 联动确认。

## C. 反馈与通知

- [ ] **C1 · 反馈渠道决策矩阵** ⬜(核心,先拍这张表)
  | 场景 | 渠道 |
  |---|---|
  | 操作成功(可不看) | Toast(success,自动消失) |
  | 操作失败(需要知道) | Toast(error)或表单内 inline error |
  | 页面级持续状态(配额不足、维护公告) | `<Alert>` 横幅 |
  | 阻断性问题 / 需要选择 | Dialog |
  | 字段级校验 | Field error(表单内) |
  逐格确认,成文后所有反馈按表选路,不再临场发挥。
- [ ] **C2 · Toast(sonner)规范** 🟡
  已装。确认:位置(右下?)、时长、四种 variant 的 icon 与色、带 action 的 toast(Undo 模式)、
  promise toast(`toast.promise` 用于「保存中→已保存」)、同类 toast 去重。
- [ ] **C3 · Alert 规范** 🟡
  组件已有。确认四种语义(info/success/warning/error)的 icon 映射(用 H2 的语义表)、
  可关闭性(dismissible 记忆到 localStorage?)、放置位置(PageHeader 下?Card 内顶部?)。
- [ ] **C4 · 确认弹窗三级制** ⬜
  ① 普通确认:AlertDialog,主按钮默认色;
  ② 破坏性确认:标题写明对象名,确认按钮 destructive 色 + 明确动词(「删除项目」不是「确定」);
  ③ 高危确认:要求输入资源名才能点确认(删组织、清数据)。
  成文 + 封装 `<ConfirmDialog>` 统一调用。
- [ ] **C5 · 按钮加载态** ⬜
  提交中:spinner 替换/前置 icon + disabled,**宽度不跳**(spinner 占 icon 位);
  确认是否封装 `<Button loading>` prop(建议是)。
- [ ] **C6 · Tooltip 强制规则** ⬜
  icon-only 按钮**必须**带 Tooltip(同时是 aria-label 来源);delay 统一;禁止 tooltip 里放交互内容。
- [ ] **C7 · 长任务与后台进度** ⬜(可后置)
  超过 ~2s 的任务:promise toast 起步;导出/批量类进通知中心(header 铃铛已有 UI 底子 🟡)。

## D. 表单

- [ ] **D1 · 技术栈** ✅ RHF + zod + resolvers 已成文。补充确认:统一 `zodResolver` + schema 旁路推导类型的文件组织(schema 与表单同文件?`schemas/` 目录?)。
- [ ] **D2 · Field 布局标准** 🟡(shadcn `field.tsx` 已有)
  确认:label 一律在**上方**;必填标记(`*` 红色 or「选填」反标注 —— 拍板);
  help text 在 input 下方、error 出现时替换还是并存;字段垂直间距统一值。
- [ ] **D3 · 表单栅格** ⬜
  Card 内表单默认单列;宽 Card 可两列(`grid md:grid-cols-2`),但**语义相关**的字段才同行;
  短字段(邮编、日期)的宽度档位(full / 1/2 / 1/3)—— 确认档位集合。
- [ ] **D4 · Section 分组** ⬜
  长表单按 section 分组:section 标题(小号 + muted)+ 虚线分隔(A5);
  超长表单何时拆分成多 Card / 多步向导(F7)—— 定一个字段数阈值。
- [ ] **D5 · 提交区规范** ⬜
  按钮位置(Card 内右下 / 粘性底栏 A7 的选择条件)、主次按钮顺序(主按钮在右)、
  提交中(C5)、成功后行为(toast + 停留 or 跳转 —— 按场景定型)、
  **dirty 守卫**:未保存离开时拦截(路由级 + 弹层关闭级)。
- [ ] **D6 · 服务端错误回填** ⬜
  API 校验错误 → `setError` 映射到字段的标准写法;非字段级错误显示在表单顶部 Alert。
- [ ] **D7 · 字段类型覆盖矩阵** —— 每种字段一个标准形态,demo 页全覆盖:
  - [ ] text / textarea(带字数统计)✅ 组件有 🟡 规范无
  - [ ] password(显隐 toggle + 可选强度条)⬜
  - [ ] number(input-group 步进器)🟡
  - [ ] select(单选,≤7 项)✅ / native-select 的使用场景 ⬜
  - [ ] combobox(可搜索单选,>7 项)🟡 组件有
  - [ ] combobox 多选(badge 显示已选 + async 远程搜索)⬜
  - [ ] radio group(≤4 项且需要一眼全见时替代 select)🟡
  - [ ] checkbox / checkbox group 🟡
  - [ ] switch(即时生效的设置项专用,**不进**提交式表单 —— 确认这条)🟡
  - [ ] slider(带数值显示)🟡
  - [ ] date picker(F1)⬜
  - [ ] date range picker(F1)⬜
  - [ ] time / datetime ⬜
  - [ ] OTP ✅ 组件有
  - [ ] mask input(电话、金额、卡号,F2)⬜
  - [ ] tags input(F4)⬜
  - [ ] file upload / dropzone(F6)⬜
  - [ ] color picker(theming 里已有一个 🟡 → 是否提炼为通用组件)
- [ ] **D8 · 表单载体决策** ⬜
  ≤4 字段的快捷创建 → Dialog;5+ 字段或含复杂控件 → Sheet;
  核心资源的完整编辑 → 独立页面。确认阈值并与 L1 对齐。

## E. 表格

- [ ] **E1 · 选型** ⬜:引入 **TanStack Table**(headless)+ shadcn `table.tsx` 渲染;
  封装一个项目级 `<DataTable>`(列定义驱动),这是所有列表页的唯一表格入口。
- [ ] **E2 · 结构三段式** ⬜(你已有明确偏好,需成文)
  Card 包裹,自上而下:**toolbar 区**(搜索 + 筛选器 + 右侧操作)→ 虚线 → **表体** → 虚线 → **pagination 区**。
- [ ] **E3 · Toolbar 规范** ⬜
  搜索框位置(左首)与宽度;筛选器用 faceted filter(Popover + Command,选中数显示 badge);
  「重置筛选」出现条件;右侧固定槽:列显隐(view options)、导出、主按钮(「新建」是放这还是 PageHeader.actions —— 拍板)。
- [ ] **E4 · 列规范** ⬜
  排序指示(可排序列的 header 样式);对齐:文本左、数字右、操作列右;
  列宽策略(操作列固定、内容列弹性);超长内容 truncate + Tooltip;
  **Cell 类型库**(封装成可复用 cell renderer):状态 badge(J2)、avatar+姓名、日期(I2 格式)、
  金额(右对齐 + mono?)、进度条、tag 列表、链接、boolean(check/横杠)。
- [ ] **E5 · 行规范** ⬜
  行选择(checkbox 列)+ 选中后浮出**批量操作条**(位置:表格顶部替换 toolbar? 底部浮条?—— 拍板);
  行 actions:统一右侧 `⋯` DropdownMenu,菜单项顺序(查看/编辑在上,删除在底部 + destructive 色 + 分隔线);
  行点击行为:进详情 vs 仅 checkbox —— 按场景定两种模式。
- [ ] **E6 · Pagination 规范** ⬜
  组成:左侧「共 N 条 / 已选 M 条」、右侧 page size 选择(10/20/50)+ 页码导航;组件 `pagination.tsx` 已有 🟡。
- [ ] **E7 · 表格四态** ⬜
  loading = 骨架行(保持列头);empty 区分真空/筛选空(B1);error 带 retry;翻页刷新态(B6)。
- [ ] **E8 · 服务端模式** ⬜
  服务端分页/排序/筛选 + react-query 的标准 hook(`useDataTableQuery`?);
  表格状态(页码、筛选)**同步进 URL**(N1),刷新/分享不丢状态。
- [ ] **E9 · 进阶形态**(可后置)⬜
  可展开行、树形表格、可编辑单元格、固定列、虚拟滚动 —— 先登记不做,需要时再立项。

## F. 组件补齐清单

> 原则:能用 shadcn 生态现成的(`pnpm dlx shadcn add -c apps/web`)不自研;自研的放 `apps/web/src/components/ui/` 同级风格。

- [ ] **F1 · DatePicker / DateRangePicker** ⬜:calendar ✅ 已有,缺 Popover+Input 封装;
  确认:展示格式(I2)、快捷区间(今天/近7天/近30天/本月)、与表单 Field 的接线、时区策略。
- [ ] **F2 · Mask Input** ⬜:选型(建议轻量自研 or `use-mask-input` 类库 —— 拍板);
  预置 mask:电话、金额(千分位)、银行卡、身份证/税号。
- [ ] **F3 · Combobox 多选 + async** ⬜:badge 化已选、远程搜索 loading 态、创建新项(creatable)开关。
- [ ] **F4 · Tags Input** ⬜:回车/逗号分词、去重、上限。
- [ ] **F5 · Number Stepper** 🟡:input-group 有底子,封装 +/- 按钮 + min/max/step。
- [ ] **F6 · File Upload / Dropzone** ⬜:拖入态、文件列表(进度条、失败重试、删除)、
  限制提示(类型/大小)、图片预览;上传接口抽象(不绑定具体后端)。
- [ ] **F7 · Stepper / Wizard** ⬜:横向步骤条 + 每步校验 + 可回退;向导页布局(A6-⑤)。
- [ ] **F8 · Timeline** 🟡:changelog 页有实现 → 提炼为通用组件(审计日志、动态流会复用)。
- [ ] **F9 · DescriptionList** ⬜:详情页 key-value 展示(label muted + value,栅格),配 copy 按钮位。
- [ ] **F10 · StatCard** 🟡:dashboard statistics 有底子 → 提炼:数值 + 同比箭头/badge + 迷你图(可选)。
- [ ] **F11 · CopyButton** ⬜:点击复制 + check 反馈 + tooltip,ID/token 展示的标配。
- [ ] **F12 · CodeBlock** ⬜:mono + 复制按钮 + 可选行号(API key、webhook 示例用)。
- [ ] **F13 · Avatar 家族** ✅:solid/gradient fallback、avatar group 已有 demo。
- [ ] **F14 · Command Palette(⌘K)** 🟡:cmdk 已装未接;确认:全局导航 + 动作注册模式。
- [ ] **F15 · PasswordInput** ⬜(D7 联动)。
- [ ] **F16 · Tree View** ⬜(可后置,组织架构/目录场景再立项)。

## G. Dashboard(gridstack)

- [ ] **G1 · GridBoard 基座** ✅:拖拽/缩放/主题化角部把手/统一 chrome 已成型。
- [ ] **G2 · Customize:显示/隐藏/重置** ✅ 已成型。
- [ ] **G3 · Widget 锁定(lock)** ⬜(你点名要的):单 widget 锁定位置尺寸;
  确认:锁定的视觉标记、锁定态与拖拽把手的交互、「全板锁定」开关是否需要。
- [ ] **G4 · 布局持久化** 🟡:确认 per-page 持久化(zustand persist,key 含页面 id + 版本号,
  widget 集变更时的迁移/失效策略)。
- [ ] **G5 · Widget 标准外壳** ⬜:每个 widget = Card + 标题行(拖拽手柄区域、右上 `⋯` 菜单:刷新/锁定/隐藏)
  + 自带 B1 四态(单 widget 失败不拖垮整板)。
- [ ] **G6 · Widget 注册表模式** ⬜:新 dashboard 页 = 声明一个 `widgets: WidgetDef[]`
  (id、标题、默认尺寸/位置、最小尺寸、渲染组件),模板消费者只写这张表。
- [ ] **G7 · 图表规范** 🟡:pie 时钟方向已成文 ✅;补:空数据图表态、tooltip 统一样式、
  图例位置、时间轴刻度格式(I2)、ChartContainer 强制使用。

## H. Icon 规范

- [ ] **H1 · 全局唯一 icon 体系** 🟡(header 已成文 → 推广到全局)
  全站 Solar `*-bold-duotone`(Iconify Tailwind class);尺寸档:`size-4`(行内/表格)、
  `size-4.5`(工具栏/header)、`size-5`(PageHeader tile、空态)—— 确认档位表。
- [ ] **H2 · 语义映射表** ⬜(核心,一次定死)
  固定动作→glyph 映射并成文:add / edit / delete / view / search / filter / sort / refresh /
  export / import / copy / settings / more(⋯)/ close / back / external-link / lock / unlock /
  drag / calendar / user / notification / success / warning / error / info…
  同一动作全站**只允许**用同一个 glyph。
- [ ] **H3 · lucide 的处置** ⬜(需要决策)
  shadcn ui 组件内部默认引 lucide(chevron、check 等)。拍板:
  方案 A —— ui/ 内部机械性 glyph(chevron/check/x)保留 lucide,业务层一律 Solar;
  方案 B —— 全量替换为 Solar。建议 A(升级 shadcn 组件时摩擦小),待确认。
- [ ] **H4 · 品牌 glyph** ✅:inline SVG + fill-current(GitHub/X 模式已成文)。
- [ ] **H5 · 空态/错误态插图** ⬜:纯 icon 放大(现 StatusPage 模式)还是引插图集 —— 拍板,保持全站一种。

## I. 排版、文案与格式化

- [ ] **I1 · 字号层级表** ⬜:页面 title(PageHeader)/ Card title / 正文 / 辅助文字 / 表格 cell
  各自的 text-* + 字重 + 颜色(foreground/muted)固定搭配,列表成文。
- [ ] **I2 · 格式化模块 `@/lib/format`** ⬜(核心)
  统一 formatter 并**禁止**散落的 `format(date, ...)`:
  日期(`yyyy-MM-dd`?)、日期时间、相对时间(几分钟前)、金额(货币符号、千分位、精度)、
  百分比、大数缩写(1.2k)、文件大小。全站格式从这一个模块出。
- [ ] **I3 · Microcopy 模板** ⬜
  空态文案句式(「还没有 X」+「创建第一个 X」)、错误句式(说人话 + 下一步动作)、
  确认弹窗句式(标题 = 动词短语,正文 = 后果说明);中英文案的大小写规则(英文 Sentence case)。
- [ ] **I4 · i18n 决策** ⬜(language-switcher 是占位)
  拍板:模板层是否内置 next-intl(建议:内置骨架 —— routing/messages 结构就位,默认只有一种语言,
  各 SaaS 按需增语言;否则后补 i18n 是全量返工)。
- [ ] **I5 · Mono 字体使用场景** ⬜:ID、代码、token、表格数字列(与 E4 联动)—— 圈定后成文。

## J. 颜色与状态语义

- [ ] **J1 · 语义状态色 token** ⬜(优先做,demo 全依赖它)
  现只有 destructive。新增 `--success` / `--warning` / `--info`(+ 各自 foreground),
  按 theming 的中性参数化规则接入 globals.css,亮暗两套;成文「状态色只从这四个 token 出,
  禁止 green-500 之类直写」。
- [ ] **J2 · Badge / 状态点标准** ⬜
  状态展示统一形态:soft 风格 badge(`bg-{token}/10 text-{token}`)+ 可选 status dot;
  预置 `<StatusBadge status="active|pending|failed|...">` 语义组件供表格/详情复用。
- [ ] **J3 · 图表色** ✅ chart-1..5 已成文;补:语义图表场景(成功率绿/失败红)何时脱离 chart-* 用 J1。

## K. 交互细节

- [ ] **K1 · 动效标准** ⬜
  统一 duration/easing 档位(如 150ms 微交互 / 250ms 弹层,easing 统一);
  何处**该**动:弹层进出、列表项增删、折叠展开;何处**不**动:页面切换(暂不做转场)。
  motion 已装 🟡,确认使用边界(CSS 优先,复杂编排才用 motion)。
- [ ] **K2 · 焦点与键盘** 🟡
  focus-visible 环样式全站一致(token 化);Dialog/Sheet 焦点陷阱(radix 自带 ✅);
  ⌘K(F14)、表格快捷键(可后置);Kbd 组件展示快捷键的规范。
- [ ] **K3 · 滚动规范** 🟡
  simplebar 已装:何时用自定义滚动条(Card 内固定高列表)vs 原生(页面级);
  sticky 表头(长表格)、滚动阴影提示(scroll shadow)是否标配 —— 拍板。
- [ ] **K4 · 禁用与只读** ⬜:disabled(不可用,50% 透明)与 readonly(可读可复制,无边框?)
  的视觉区分,表单/按钮/表格行三处统一。

## L. 弹层(Overlays)

- [ ] **L1 · 决策矩阵** ⬜(核心,先拍这张表)
  | 场景 | 载体 |
  |---|---|
  | 确认/警告(一句话+两按钮) | AlertDialog |
  | 短表单(≤4 字段)、单一决定 | Dialog |
  | 长表单、详情速览、多区块 | Sheet(右侧) |
  | 移动端底部操作 | Drawer(vaul) |
  | 轻量选择/筛选 | Popover |
  | 纯提示 | Tooltip / HoverCard |
- [ ] **L2 · 尺寸与结构** ⬜:Dialog 宽度档(sm/md/lg 具体值)、Sheet 宽度档;
  footer 按钮顺序(主按钮**右侧**,取消在左)、destructive 场景按钮色;标题+描述必填。
- [ ] **L3 · 关闭行为** ⬜:含 dirty 表单的弹层,点遮罩/ESC 时二次确认(与 D5 守卫联动);
  嵌套弹层规则(最多一层嵌套?Dialog 上只允许 AlertDialog?)。
- [ ] **L4 · Elevation** ✅:overlay 的 shadow/border token 已成文(theming.md)。

## M. 标准页面库

- [ ] **M1 · Auth 骨架** ⬜:login / register / forgot / reset 四页,布局 A6-⑤,
  位于 `(auth)` route group(shell 外);表单直接吃 D 的全部标准 —— 是 D 的第一个综合验收场。
- [ ] **M2 · Settings 页模板** ⬜:左侧子导航 + 右侧 Card 列(A6-③);
  含「危险区」段(destructive 边框 Card + C4-③ 高危确认)。
- [ ] **M3 · 列表页模板** ⬜:PageHeader + DataTable Card,E 的综合验收场。
- [ ] **M4 · 详情页模板** ⬜:PageHeader(titleSuffix 放 StatusBadge)+ 主内容/右侧 meta(A6-②)
  + DescriptionList(F9)+ Timeline(F8)。
- [ ] **M5 · 错误/404/loading** ✅ 已成型(StatusPage 体系)。
- [ ] **M6 · Changelog 页** ✅ 已成型。
- [ ] **M7 · 向导页模板** ⬜(F7 落地后):onboarding 三步示例。

## N. URL、状态与数据层

- [ ] **N1 · URL 即状态** ⬜(需要决策)
  列表筛选/分页/tab 进 searchParams 的标准;选型:`nuqs`(类型安全 searchParams)vs 手写 hook —— 拍板;
  规则:**可分享的状态进 URL,个人偏好进 zustand persist**。
- [ ] **N2 · react-query 约定** ⬜
  queryKey 工厂模式(`keys.project.list(filters)` 集中定义)、staleTime 默认档、
  mutation 后 invalidate 的标准写法、全局 error handler(401 跳登录、5xx toast)。
- [ ] **N3 · zustand 约定** 🟡:persist key 命名(`ytpl:*`?)、每 store 一文件已成文 ✅、
  版本迁移(settings 已有先例 → 提炼为通用模式)。
- [ ] **N4 · Demo 数据源** ⬜(需要决策)
  demo 页数据从哪来:静态 fixtures 模块(`apps/web/src/lib/fixtures/`)+ 人工延迟/失败开关
  (让 B 的四态可演示)—— 建议此方案,不引 faker/msw,待确认。
- [ ] **N5 · API 客户端约定** ⬜:fetch 封装(baseURL、错误归一化为统一 shape、zod 校验响应)
  —— 模板只放骨架 + 约定,不绑定具体后端。

## O. 质量门禁(每项确认时逐条过)

- [ ] **O1 · 暗色 parity**:每个 demo 亮/暗两态过目,无硬编码色(现有 CI 不查,靠 review + AGENTS 规则)。
- [ ] **O2 · 密度 parity**:compact 模式下表单/表格/Card 间距不破版。
- [ ] **O3 · 主题 parity**:切换 preset/brand color/radius 后组件跟随(token 化验收)。
- [ ] **O4 · a11y 基线**:icon-only 必有 aria-label(C6)、焦点可达(K2)、对比度 AA。
- [ ] **O5 · 响应式**:每个 demo 在 mobile 宽度过目(A8)。
- [ ] **O6 · AGENTS.md 同步**:确认一项 → 当次 commit 里写入规范条文。
- [ ] **O7 · 台账同步**:features.yaml 同 commit 更新(既有机制 ✅)。

---

## Demo 页组织(承载所有验收)

侧边栏现有 `UI` 分组扩展,一大类一页、页内用 PageHeader tabs(A3)分子域:

| 路由 | 覆盖 | 对应章节 |
|---|---|---|
| `/ui/layout` | 页面骨架 5 模板、Card 组织、虚线分隔、粘性操作栏 | A |
| `/ui/async` | 四态 × (卡片/表格/表单/统计),刷新态、乐观更新 | B |
| `/ui/feedback` | Toast 全 variant、Alert、三级确认、按钮加载、tooltip | C |
| `/ui/forms` | 字段矩阵全型态 × (默认/错误/禁用/只读),布局、分组、提交区 | D + F1-F6 |
| `/ui/tables` | DataTable 全功能 + 四态 + 批量操作 + URL 同步 | E |
| `/ui/overlays` | Dialog/Sheet/Drawer/Popover 各档位 + dirty 关闭守卫 | L |
| `/ui/icons` | 语义映射表全量陈列(可搜索)+ 尺寸档 | H |
| `/ui/typography` | 字号层级 + format 模块全函数展示 | I |
| `/ui/status` | 状态色 token、StatusBadge、状态点 | J |
| `/ui/gridstack` ✅ | + 锁定、widget 外壳、注册表(扩展现有页) | G |
| `/ui/avatars` ✅ `/ui/display-card` ✅ | 既有,保持 | F13 |
| `(auth)/login` 等 | 页面模板即 demo | M |

> demo 页同时是**回归基准**:改主题系统/升级 shadcn 后,把这些页过一遍即完成视觉回归。
