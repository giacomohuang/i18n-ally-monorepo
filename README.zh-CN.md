<p align="center">
<img src="https://github.com/lokalise/i18n-ally/blob/master/screenshots/full-logo-new.png?raw=true" alt="logo" width="450"/>
</p>

<p align='center'>
<a href="https://github.com/lokalise/i18n-ally/blob/master/README.md">English</a> | 简体中文
</p>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/lokalise.i18n-ally.svg?color=blue&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/d/lokalise.i18n-ally.svg?color=4bdbe3" alt="Visual Studio Marketplace Downloads" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/i/lokalise.i18n-ally.svg?color=63ba83" alt="Visual Studio Marketplace Installs" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally" target="__blank"><img src="https://vsmarketplacebadge.apphb.com/trending-monthly/lokalise.i18n-ally.svg?color=a1b858" alt="Marketplace Trending Monthly" /></a>
<br/>
<a href="https://github.com/lokalise/i18n-ally/wiki" target="__blank"><img alt="Wiki" src="https://img.shields.io/static/v1?label=docs&message=wiki&color=e3897b"></a>
<a href="https://github.com/lokalise/i18n-ally" target="__blank"><img src="https://img.shields.io/github/last-commit/lokalise/i18n-ally.svg?color=c977be" alt="GitHub last commit" /></a>
<a href="https://github.com/lokalise/i18n-ally/issues" target="__blank"><img src="https://img.shields.io/github/issues/lokalise/i18n-ally.svg?color=a38eed" alt="GitHub issues" /></a>
<a href="https://github.com/lokalise/i18n-ally" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/lokalise/i18n-ally?style=social"></a>
</p>

<p align='center'>
<b>v2.0</b> 已更新，伴随新的 <a href='https://github.com/lokalise/i18n-ally/wiki/Migration-v1.x'>可视化编辑器</a> 和 <a href='https://github.com/lokalise/i18n-ally/wiki/Review-System'>审阅系统</a> 🎉
</p>

<p align='center'>
<b>Fork 版本 v2.14.0</b> 增加了 Monorepo 项目支持。
</p>

<p align='center'><i>
<a href="https://github.com/lokalise/i18n-ally/wiki/Migration-v1.x">从 v1.x 迁移到 v2.0</a>
</i></p>
<br>

<p align='center'><b>
🚧 请注意，中文文档仅供参考，非实时更新。可能会与英文版有所出入，如有歧义，一切请以<a href="https://github.com/lokalise/i18n-ally/blob/master/README.md">英文文档</a>为主。
</b></p>

<br>


<p align="center">
<a href='https://github.com/lokalise/i18n-ally/wiki/Supported-Frameworks' target="__blank">
<img src="https://github.com/lokalise/i18n-ally/blob/screenshots/supported-frameworks.png?raw=true" alt="Supported Frameworks" width="500"/>
</a>
</p>

-----

<details>
<summary align='center'><b>⚡️ 截图和功能</b></summary>

<h3 align='center'>内联提示</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/annotation-animated.gif?raw=true)

<h3 align='center'>悬浮窗和快捷操作</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/hover.png?raw=true)

<h3 align='center'>统一管理所有翻译</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/review-sidebar.png?raw=true)

<h3 align='center'><a href='https://github.com/lokalise/i18n-ally/wiki/Editor-UI'>可视化编辑器</a> 和 <a href='https://github.com/lokalise/i18n-ally/wiki/Review-&-Collaboration-System'>审阅系统</a></h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/review-editor.png?raw=true)

<h3 align='center'>从代码中提取文案</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/extract.png?raw=true)

<h3 align='center'>缺失文案报告</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/problems.png?raw=true)

<h3 align='center'>机器翻译</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/quick-actions.png?raw=true)

<h3 align='center'>JSON 和 YAML 的内联提示</h3>

![](https://github.com/lokalise/i18n-ally/blob/screenshots/annotation-locale.png?raw=true)

<h3 align="center"> 其他功能 </h3>

- 支持多目录工作区
- 支持远程开发 (Remote Development)
- 支持大多数流行框架
- 插件自身多语言支持 [翻译列表](https://github.com/lokalise/i18n-ally#-multilingual-support)

</details>

-----

## Monorepo 项目

这个 fork 版本支持通过 `i18n-ally.projects` 配置 Monorepo 工作区。每个项目都可以独立设置根目录、语言目录、语言、框架、解析器和路径匹配规则。i18n Ally 会根据当前打开文件的路径自动选择匹配项目，让翻译分析、提取、补全和语言文件加载都限定在当前应用或包内。

```json
{
  "i18n-ally.projects": [
    {
      "name": "web",
      "root": "apps/web",
      "localesPaths": ["src/locales"],
      "sourceLanguage": "en",
      "displayLanguage": "zh-CN",
      "enabledFrameworks": ["vue"],
      "enabledParsers": ["json", "yaml"]
    },
    {
      "name": "admin",
      "root": "apps/admin",
      "localesPaths": ["locales"],
      "sourceLanguage": "en",
      "displayLanguage": "ja",
      "enabledFrameworks": ["react-i18next"],
      "pathMatcher": "{locale}/{namespaces}"
    }
  ]
}
```

## 📖 文档

[查看维基](https://github.com/lokalise/i18n-ally/wiki)!


## 💭 常见问题

[常见问题](https://github.com/lokalise/i18n-ally/wiki/FAQ).


## 📜 支持文件格式

[支持的文件格式](https://github.com/lokalise/i18n-ally/wiki/Supported-Locale-Formats).


## ❤️ 感谢

本插件最初来源于 [think2011/vscode-vue-i18n](https://github.com/think2011/vscode-vue-i18n)，非常感谢 [@think2011](https://github.com/think2011) 的启发。

Vue SFC 的支持来自于 vue-i18n 的作者 [kazupon](https://github.com/kazupon) 的 [kazupon/vue-i18n-locale-message](https://github.com/kazupon/vue-i18n-locale-message)。感谢提供的帮助!

同时也十分感谢所有这些很棒的 [贡献者](https://github.com/lokalise/i18n-ally/graphs/contributors) 和看到这里的你。


## 📄 License

[MIT License](https://github.com/lokalise/i18n-ally/blob/master/LICENSE) © 2021 年至今 [Lokalise Inc.](https://github.com/lokalise)

MIT License © 2019-2020 [Anthony Fu](https://github.com/antfu)

MIT License © 2018-2019 [think2011](https://github.com/think2011)
