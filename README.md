# FFLogs & Achievements Lodestone Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**Final Fantasy XIV** のロードストーン・FFLogs を拡張する Chrome 拡張機能のツールセットです。  
用途に合わせて **3 種類** のエディションから選択してインストールできます。

---

## エディション一覧

| エディション           | 対象サイト | 主な機能                                              | バージョン |
| ---------------------- | ---------- | ----------------------------------------------------- | ---------- |
| [Full](./full)         | Lodestone  | FFLogs / Tomestone / Lalachievements 連携、Best% 表示 | v2.0.7     |
| [Analysis](./analysis) | FFLogs     | xivanalysis へのワンクリック遷移                      | v1.0.2     |
| [Mini](./mini)         | Lodestone  | Lalachievements ボタンのみ                            | v1.0.0     |

---

### 1. Full Version — [FFLogs Lodestone Link](./full)

> フル機能のパワーユーザー向けエディション

- **マルチプラットフォーム連携**: FFLogs・Tomestone.gg・Lalachievements へのリンクボタンを追加
- **Best % 表示**: FFLogs API 連携により、最新コンテンツの戦闘成績をロードストーン上に直接表示
- **xivanalysis ボタン**: FFLogs レポート画面から xivanalysis へワンクリックで遷移
- **表示カスタマイズ**: 各機能のオン/オフをオプション画面で個別に制御可能
- **隠し設定**: 初期状態はシンプル構成、特定操作で高度な設定を開放

### 2. Analysis Version — [xivanalysis for FFLogs](./analysis)

> FFLogs に特化した軽量分析ツール

- **xivanalysis ボタン**: FFLogs レポートページにワンクリックで xivanalysis を開くボタンを追加
- **動的更新**: 戦闘の切り替えに応じてリンク先が自動で更新
- **設定不要**: インストールするだけで動作、API キーや設定画面は不要

### 3. Mini Version — [Lodestone Achievements Mini](./mini)

> アチーブメントだけ確認したいライトユーザー向け

- **Achievements ボタン**: キャラクター名の下に Lalachievements へのリンクを追加
- **設定不要**: インストールするだけで即動作
- **最軽量**: 必要最小限のリソースのみで動作

---

## インストール方法

### 手動インストール（デベロッパーモード）

1. このリポジトリをクローンまたはダウンロードします。
   ```bash
   git clone https://github.com/ryota-kashi/fflogs-lodestone-extension.git
   ```
2. Chrome で `chrome://extensions/` を開きます。
3. 右上の **「デベロッパーモード」** を ON にします。
4. **「パッケージ化されていない拡張機能を読み込む」** をクリックします。
5. 使いたいエディションのフォルダ（`full/`、`analysis/`、`mini/`）を選択します。

> [!NOTE]
> 複数のエディションを同時にインストールできますが、Full版 と Analysis版 は FFLogs レポートページで xivanalysis ボタンが重複する場合があります。

---

## リポジトリ構成

```
fflogs-lodestone-extension/
├── full/           # Full Version（FFLogs Lodestone Link）
│   ├── manifest.json
│   ├── content.js
│   ├── options.html / options.js
│   ├── styles.css
│   └── icons/
├── analysis/       # Analysis Version（xivanalysis for FFLogs）
│   ├── manifest.json
│   ├── content.js
│   ├── styles.css
│   └── icons/
├── mini/           # Mini Version（Lodestone Achievements Mini）
│   ├── manifest.json
│   ├── content.js
│   ├── styles.css
│   └── icons/
└── README.md       # このファイル
```

---

## 技術仕様

- **Manifest Version**: 3（Chrome Manifest V3）
- **対応ブラウザ**: Google Chrome
- **対応ドメイン**:
  - Lodestone: `jp` / `na` / `eu` / `de` / `fr`
  - FFLogs: `www.fflogs.com` / `ja.fflogs.com`

---

## ライセンス

[MIT License](./LICENSE)
