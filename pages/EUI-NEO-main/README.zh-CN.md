# EUI-NEO

<p align="center">
  <img src="assets/icon.svg" width="104" alt="EUI-NEO 图标">
</p>

<p align="center">
  <a href="README.md">English</a>
</p>

EUI-NEO 是一个由 C++17、OpenGL 和 GLFW 驱动的声明式桌面 UI 系统。
它把界面结构、视觉样式、交互回调、动画目标和渲染状态组织到同一套 DSL 模型中，
让复杂桌面界面拥有清晰的描述方式和稳定的运行边界。

官网与文档入口：

- [EUI-NEO 官网](../eui-neo.html)
- [文档中心](../eui-neo-docs.html)
- [GitHub 仓库](https://github.com/sudoevolve/EUI-NEO)

## 界面预览

|  |  |
| --- | --- |
| ![控件预览](docs/pic/1.jpg) | ![风格预览](docs/pic/2.jpg) |
| ![动画预览](docs/pic/3.jpg) | ![组合页面预览](docs/pic/4.jpg) |
| ![示例 1](docs/pic/示例1.jpg) | ![示例 2](docs/pic/示例2.jpg) |

## 系统亮点

- 声明式 DSL：围绕 `Row`、`Column`、`Stack`、`Rect`、`Text`、`Image`、`Polygon` 组织页面。
- Runtime 统一接管布局、输入、焦点、滚动、动画、脏区渲染和 framebuffer cache。
- 组件语言覆盖控件、弹层、选择器、数据表、图表和主题 token。
- 目标状态动画支持 frame、color、text color、opacity、radius、border、shadow、blur 和 transform。
- 以 C++17、OpenGL、GLFW 为底座，面向桌面图形界面。

## 文档入口

请使用文档中心：

- [EUI-NEO 文档中心](../eui-neo-docs.html)

更多说明请查看文档中心。
