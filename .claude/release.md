# Release card — yTemplate

<!-- 由 release skill 生成于 2026-07-10;发版流程见 user 级 release skill,本卡只记录项目特异性事实。 -->

## 版本文件(bump 时全部同步)

- `package.json`

## 门禁

- `pnpm check && pnpm build`(check = biome check + tsc --noEmit)
- smoke:—(`next build` 全量预渲染即端到端产物验证)

## CHANGELOG

- `CHANGELOG.md`,Keep a Changelog,英文
- 应用内 changelog:`src/lib/changelog.ts`(单语英文;release 带 title/summary,change 带 kind/title/text,text 不以标题开头)

## 发布渠道

- 渠道:B(`gh release create vX.Y.Z --notes-file <(CHANGELOG 对应小节)`)
- `.github/workflows/ci.yml` 只是 push/PR 门禁(lint + typecheck + build),不做 tag 触发发布;发版前确认最新 CI run 是绿的

## 本项目特有注意事项

- **分支策略**:日常开发在 `dev`,发版时 merge 进 `main`(默认分支,沿用 "Merge branch 'dev': <summary>" 风格),tag 打在 main 上;发完回到 dev。
- 用户常驻 `next dev`(端口 3005):Next 16 拒绝同项目第二个 dev 实例,验证页面直接 curl 3005 的 SSR 产物即可。
