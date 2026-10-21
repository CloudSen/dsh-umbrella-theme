# dsh-umbrella-theme

An Umbrella Corporation theme for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) — black and red, no characters, and an umbrella mark that is always clearly present.

English | [中文](#中文)

## What it changes

- **A full alias-token palette.** 113 `--dsw-*` alias tokens are overridden in *both* schemes, plus the 9 `--shiki-token-*` syntax tokens, so the sidebar, composer, menus, dialogs, tooltips, diff view and code blocks all follow the theme rather than a handful of surfaces.
- **Dark and light.** The theme follows the app's Appearance setting (System follows the OS). Dark is the black-and-red page with terminal-green prose; light is the same identity in grey and white, with near-black prose, deep-green code highlighting and the Umbrella red kept for buttons, tabs and marks.
- **The mark, in four places.** Registrations into `sidebar.brand.mark`, `conversation.hero.brand.mark`, `sidebar.footer.action` (a biohazard emblem beside the account row) and `shell.overlay` (a faint HUD frame: grid, corner brackets, a hairline rule and the wordmark).
- **A watermark that spins like a coin.** A 720 px umbrella canopy sits centred behind the conversation and rotates about its own vertical centre line — the axis that splits the mark into left and right halves — so it turns edge-on and comes back rather than orbiting the screen. The background copy is canopy-only, with no hub at the apex.
- **Red card tabs.** The Chat / Trajectory tabs are square-cornered, borderless red cards, and the macOS New Session pill is filled with Umbrella red.
- **Reduced motion respected.** Both spins stop under `prefers-reduced-motion: reduce`.

The umbrella mark is drawn from geometry in code — no Capcom asset is bundled. It is white and red in both schemes, and the background copy is deliberately faint so it never competes with prose.

## Install

```sh
dsh plugin --profile <profile> add dsh-umbrella-theme
```

In the Web UI you can install it from **Plugins** instead, or from the dsh-market **Themes** tab. Requires DSH `>=0.2.1-rc.1 <0.3.0-0`.

## Appearance

Switch the app's Appearance setting to change scheme; the theme carries both. Dark is the deep black-and-red page, light the grey-and-white one. Either way the Umbrella red is reserved for brand surfaces — buttons, tabs, marks — and code highlighting stays green.

## Disclaimer

Unofficial fan work. *Resident Evil*, *Umbrella Corporation* and the Umbrella logo are the intellectual property of Capcom. This theme is not affiliated with, endorsed by, or licensed by Capcom, and it bundles none of their assets — the mark is a re-creation drawn from geometry in this repository's code. MIT covers the source code only.

## License

MIT — see [LICENSE](LICENSE).

---

## 中文

「保护伞公司」主题，为 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 而做——黑红配色、没有任何人物，而且保护伞标志始终清晰可辨。

### 主题做了什么

- **完整调色板覆盖**：深浅两套外观各覆盖 113 个 `--dsw-*` 别名 token，外加 9 个 `--shiki-token-*` 语法 token。侧边栏、输入框、菜单、弹窗、提示、diff 视图、代码块全部跟随主题，而不是只改几个面。
- **明暗双外观**：跟随应用「外观」设置（系统 = 跟随操作系统）。暗色是黑红页面、正文为终端绿；浅色是同一身份的灰白版本——近黑正文、深绿代码高亮，保护伞红留给按钮、标签与标志。
- **标志出现在四处**：注册进 `sidebar.brand.mark`、`conversation.hero.brand.mark`、`sidebar.footer.action`（用户信息右侧的生化危机标识）与 `shell.overlay`（淡淡的 HUD：网格、四角边框、一条细线和 wordmark）。
- **像硬币一样自转的水印**：720px 伞面居中置于对话背后，绕**自己的垂直中线**（把标志平分为左右两半的那条）自转，因此会转到侧面再转回来，而不是绕屏幕中心公转。背景那一份只有伞面，顶端没有轴心圆。
- **直角红色卡片标签页**：Chat / Trajectory 标签是无边框直角红卡片，macOS 的 New Session 按钮填充保护伞红。
- **尊重减弱动效**：`prefers-reduced-motion: reduce` 下两个自转都会停止。

标志由代码中的几何图形绘制，仓库里不含任何 Capcom 素材；两种外观下都是白+红，背景那一份刻意很淡，不与正文抢注意力。

### 安装

```sh
dsh plugin --profile <profile> add dsh-umbrella-theme
```

也可以在 Web 界面的 **Plugins** 页安装，或从 dsh-market 的**主题 Tab**一键安装。要求 DSH `>=0.2.1-rc.1 <0.3.0-0`。

### 免责声明

非官方粉丝作品。*生化危机*、*保护伞公司* 及保护伞标志的知识产权属于 Capcom。本主题与 Capcom 无隶属、背书或授权关系，也不包含其任何素材——标志是本仓库代码中用几何图形复刻绘制的。MIT 仅覆盖源码。
