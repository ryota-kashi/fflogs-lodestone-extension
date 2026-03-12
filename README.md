# FFLogs & Achievements Lodestone Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**Final Fantasy XIV** のロードストーン・FFLogs を拡張する Chrome 拡張機能のツールセットです。  
用途に合わせて **3 種類** のエディションから選択してインストールできます。

---

## エディション一覧

| 名前 | 対象サイト | 主な機能 | バージョン |
| :--- | :--- | :--- | :--- |
| **[Lodestone Link](./lodestone-link)** | Lodestone | リンクボタン追加、一括検索、Best%表示(隠し設定) | v2.4.0（統合版） |
| **[Full Version](./full)** | Lodestone | FFLogs / Tomestone / Lalachievements 連携、Analysis連携 | v2.3.0 |
| **[Mini Version](./mini)** | Lodestone | Lalachievements ボタンのみ | v2.0.0 |
| **[Analysis Version](./analysis)** | FFLogs | xivanalysis へのワンクリック遷移（単体版） | v1.0.5 |

---

### 各エディションの詳細

#### 1. Lodestone Link (統合版・推奨)

- **マルチプラットフォーム連携**: FFLogs・Tomestone.gg・Lalachievements へのリンクボタンを追加
- **Best % 表示**: FFLogs API 連携により、最新コンテンツの戦闘成績をロードストーン上に直接表示
  - ※初期状態では非表示。設定画面のバージョン番号部分をクリックすると API キー入力欄が出現します。
- **一括抽出・検索**: ポップアップから、ページ内のキャラクター名を一括で抽出して FFLogs で検索可能
- **ブラウザの右クリックメニュー**: 選択したテキストを FFLogs やロードストーンで即座に検索
- **アイコン**: Mini版のシンプルで視認性の高いアイコンを採用

#### 2. Full Version

- **全ての機能**: Lodestone連携に加え、FFLogsレポートページに xivanalysis ボタンを追加する機能を含みます。
- **レガシー**: 全ての機能が最初から有効ですが、権限要求範囲が広くなります。

#### 3. Mini Version

- **シンプル**: Lalachievements ボタンのみを追加します。設定不要で動作します。

#### 4. xivanalysis for FFLogs (Analysis版)

- **単体ツール**: FFLogs レポートページに、レポートを直接分析できるボタンを追加します。

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
5. 使いたいエディションのフォルダ（`lodestone-link/`, `full/`, `mini/`, `analysis/`）を選択します。

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
