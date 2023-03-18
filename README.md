<h1 align="center">Welcome to chatalog 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> CLI and node service that assist studying the effects of LLM synthesizing programs

### 🏠 [Homepage](https://github.com/CPunisher/chatalog)

## Install

```sh
pnpm install
```

## Usage

### Node Service

To use ChatGPT API, you should access [https://chat.openai.com/api/auth/session](https://chat.openai.com/api/auth/session) to get your access token.

Then export it to `ACCESS_TOKEN` environment varaible, and launch your node service

```sh
export ACCESS_TOKEN = ""
pnpm run node-service
```

### CLI

```sh
pnpm run cli
Usage: chatalog [options] [command]

Options:
  -h, --help                                    display help for command

Commands:
  generate-template [options] <directories...>
  send-message [options]
  help [command]                                display help for command
```

To generate questions with the specific template

```sh
pnpm run cli generate-template -t $(pwd)/templates/1_all_name_content.js -o ./output/templates ~/kd_bench/adjacent-to-rend ~/kd_bench/graph-coloring
```

To generate answers by requesting ChatGPT api, you should first launch your node service, then run

```sh
pnpm run cli send-message -t http://0.0.0.0:4000/message -o ./output/messages -s template1.json template2.json
``

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
```
