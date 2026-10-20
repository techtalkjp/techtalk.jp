---
name: TechTalk
description: 経営者と向かい合って話す、打ち合わせの机のようなコーポレートサイト
colors:
  paper: '#f8f6f2'
  sheet: '#ffffff'
  rule: '#e4e0d8'
  rule-strong: '#cfcac0'
  field-edge: '#8a857c'
  ink: '#1c1b18'
  ink-muted: '#4a4843'
  ink-subtle: '#6c6962'
  ink-blue: '#1d62ab'
  ink-blue-wash: '#e6eef7'
  alert-red: '#b42318'
  alert-red-wash: '#fbeae8'
  night-paper: '#161513'
  night-sheet: '#1e1d1a'
  night-rule: '#2f2d29'
  night-rule-strong: '#44413b'
  night-field-edge: '#77736b'
  night-ink: '#f1eee8'
  night-ink-muted: '#c4c0b7'
  night-ink-subtle: '#8f8b83'
  night-blue: '#7fb0e6'
  night-blue-wash: '#1d2a38'
  night-alert-red: '#f2998f'
  night-alert-red-wash: '#3a1f1c'
typography:
  display:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: 'clamp(1.875rem, 1rem + 4.6vw, 4.25rem)'
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: '-0.025em'
  headline:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1.75rem'
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: '-0.005em'
  lede:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1rem'
    fontWeight: 700
    lineHeight: 1.6
  body:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: '0.01em'
  label:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '0.875rem'
    fontWeight: 700
    lineHeight: 1.5
  caption:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '0.75rem'
    fontWeight: 400
  wordmark:
    fontFamily: "'LINE Seed JP', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 800
    letterSpacing: '-0.04em'
rounded:
  control: '6px'
  image: '12px'
spacing:
  xs: '8px'
  sm: '16px'
  md: '24px'
  lg: '40px'
  xl: '72px'
  section: '112px'
components:
  button-primary:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '0 18px'
    height: '40px'
  button-primary-compact:
    backgroundColor: '{colors.ink}'
    textColor: '{colors.paper}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '0 14px'
    height: '36px'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.ink}'
    typography: '{typography.label}'
    rounded: '{rounded.control}'
    padding: '0 18px'
    height: '40px'
  button-secondary-hover:
    backgroundColor: '{colors.sheet}'
  input:
    backgroundColor: '{colors.sheet}'
    textColor: '{colors.ink}'
    typography: '{typography.body}'
    rounded: '{rounded.control}'
    padding: '10px 12px'
  note-box:
    backgroundColor: 'transparent'
    textColor: '{colors.ink-muted}'
    rounded: '{rounded.control}'
    padding: '20px 24px'
  product-figure:
    backgroundColor: '{colors.sheet}'
    rounded: '{rounded.image}'
---

# Design System: TechTalk

## Overview

**Creative North Star: "打ち合わせの机"**

経営者と向かい合って座る机の上を、そのまま画面にしたサイト。紙（暖かみのある無彩色の地）の上に、話の順に要点が罫線で区切って置かれ、必要なところにだけ青いペンで印が付く。机の上には飾りを置かない。見せるのは話の中身と、話している本人。

密度は低めで、余白は話の間合いとして使う。各セクションは左に小さな見出し（いま何の話か）、右に本文の 2 段組で、罫線が話題の切れ目になる。カードの並びや大きな数字、装飾的な図版は使わない。本物の画面写真と代表の写真だけを置く。

部品は「静かで確か」。普段は目立たないが、押したとき・入力したとき・間違えたときには、はっきり応える。テーマは OS の設定に従い、明るい机と夜の机の 2 つを同じ構造で持つ。

**Key Characteristics:**

- 暖かみのある無彩色の階調と、アクセントの青 1 色だけ
- 罫線（1px）で区切る。面や影で区切らない
- 左にセクション名、右に本文の 2 段組（900px 以上）
- 書体は LINE Seed JP の 1 ファミリー（400 / 700、ワードマークだけ 800）
- 日本語の見出しは文節で折り返す

## Colors

紙とインクの無彩色に、青いペン 1 本。ライトとダークは同じ役割を同じ構造で持つ。

### Primary

- **ペンの青**（ink-blue / 夜は night-blue）: 本文中のリンク、進め方の番号、フォーカスの枠、ワードマークの句点、選択範囲。印を付ける場所にだけ使う。
- **青のにじみ**（ink-blue-wash / night-blue-wash）: 入力欄のフォーカス時の外側の輪。面の塗りには使わない。

### Neutral

- **紙**（paper / night-paper）: ページの地。ヘッダーも同じ色で、透かしやぼかしは使わない。
- **一枚紙**（sheet / night-sheet）: 入力欄、画面写真の台紙、送信完了の知らせなど、地から一段持ち上げたい面。
- **罫線**（rule / night-rule）: セクションの区切り、一覧の行の区切り、注記の枠。
- **濃い罫線**（rule-strong / night-rule-strong）: 枠線だけのボタン、写真の縁。
- **入力欄の縁**（field-edge / night-field-edge）: 入力欄の枠だけに使う。地との差を 3:1 以上にして、どこに書けばいいかを見分けられるようにする。
- **インク**（ink / night-ink）: 見出しと本文。塗りのボタンの地にもなる。
- **薄いインク**（ink-muted / night-ink-muted）: リード文、一覧の答えの側、注記の本文。
- **淡いインク**（ink-subtle / night-ink-subtle）: セクション名、日付、補足、キャプション。地に対して 4.5:1 以上を保つ。
- **警告の赤**（alert-red / alert-red-wash ほか）: 入力エラーと送信失敗だけ。

### Named Rules

**The 青いペン 1 本 Rule.** アクセントは青 1 色だけ。2 色目の強調色、グラデーション、色付きの面を足さない。青は「印」なので、広い面を塗らない。

**The 罫線で区切る Rule.** 話題の切れ目は 1px の罫線で示す。背景色の切り替えや影で段を作らない。

## Typography

**Display / Body Font:** LINE Seed JP（system-ui、-apple-system、Hiragino Sans にフォールバック）

**Character:** 1 ファミリーで、太さだけで階層を作る。丸みのある骨格が、話し言葉の文面を硬くしすぎない。使う文字だけに絞った WOFF2 を自前で配信し、400 と 700 は preload する。

### Hierarchy

- **Display**（700、clamp(1.875rem → 4.25rem)、1.25）: ページの冒頭の 1 行だけ。トップのキャッチと経歴ページの名前。
- **Headline**（700、28px、1.5、最大 22em）: 各セクションの見出し。全セクションで共通。
- **Lede**（400、18px → 760px 以上で 20px、1.6）: 冒頭の見出しの下のリード文。
- **Title**（700、16px、1.6）: 一覧の行の見出し（こんなとき、進め方の各段）。
- **Body**（400、16px、1.7、字間 0.01em）: 本文。リード文は最大 36em、注記は最大 30〜40em。
- **Label**（700、14px、1.5）: セクション名、ボタン、フォームのラベル。
- **Caption**（400、12px）: 画面写真のキャプション。

### Named Rules

**The 文節で折る Rule.** 日本語の見出しは文節ごとに `display: inline-block` の塊にし、単語の途中で折り返さない。本文には `word-break: auto-phrase` と `line-break: strict` を掛ける。英語の訳文には塊を使わない。

**The 太さで分ける Rule.** 階層はサイズと太さで作る。書体を足したり、斜体や全大文字にしたりしない。

## Layout

- **コンテナ:** 最大幅 70rem（左右の余白 24px を含めて 1120px）、中央寄せ。
- **セクション:** 上下の余白 72px、900px 以上で 112px。上端に罫線。900px 以上で左 220px（セクション名）、右に本文の 2 段組、間隔 48px、1 行目をベースラインで揃える。
- **一覧の行:** 760px 以上で「見出し：本文 ＝ 1：1.2」の 2 列、行の上下 24〜28px、行ごとに罫線。
- **問い合わせ:** 960px 以上で説明とフォームを 0.9：1.1 の 2 列。
- **ヘッダー:** 上部に固定（地と同じ色、下端に罫線）。860px 以下ではページ内ナビが 2 段目に回り、狭い幅では折り返す。横スクロールにはしない。
- **余白の刻み:** 8px を基準に、8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 72 / 112px を使う。
- **ブレークポイント:** 640 / 760 / 860（ナビ）/ 900（2 段組）/ 960（問い合わせ）px。

## Elevation & Depth

基本は平ら。奥行きは罫線と、紙（paper）と一枚紙（sheet）のわずかな明るさの差で示す。影を持つのは自社プロダクトの画面写真だけで、机の上に置いた 1 枚の写真として扱う。

### Shadow Vocabulary

- **写真の影**（`--shadow-image`）: 1px の縁取りと、下へ落ちる柔らかい 2 段の影。画面写真の台紙だけに使う。
- **ボタンの照り**（`inset 0 1px 0 rgb(255 255 255 / 0.12)`）: 塗りのボタンの上端に 1px の照り返し。

### Named Rules

**The 影は写真だけ Rule.** カード、注記、フォームに影を付けない。持ち上げたいときは sheet の面と罫線で済ませる。

## Shapes

角丸は 2 値だけ。操作するもの（ボタン、入力欄、注記の枠）は 6px、画像は 12px。代表の写真だけは円形にする。ワードマークの句点も円。それ以外の形（斜め、切り欠き、ブロブ）は使わない。

## Components

### Buttons

静かで確か。普段は小さく平らだが、押すと 0.97 倍に縮んで応える。

- **Shape:** 控えめな角丸（6px）。見た目の高さは 40px（ヘッダーだけ 36px）、押せる範囲は `::before` で上下に広げて 44px にする。
- **Primary:** インクの地に紙色の文字、ラベル書体（14px / 700、字間 0.02em）。1 画面に 1 つだけ。
- **Secondary:** 透明の地に濃い罫線の縁（内側 1px）。hover で一枚紙の面が出る。
- **Hover / Focus / Active:** 背景色を 150ms で変える。フォーカスは 2px の青い枠（3px 離す）。押下で縮む。無効時は不透明度 0.6。
- **強制カラーモード:** 背景と影が消えるので、実線の枠を描く。

### Inputs / Fields

- **Style:** 一枚紙の面に、入力欄の縁（field-edge）の 1px の内側の線。角丸 6px、余白 10px 12px、文字は 16px（iOS で拡大されない大きさ）。
- **Focus:** 縁が 1.5px の青になり、外側に 4px の青のにじみ。
- **Error:** 縁が 1.5px の赤になり、欄の下に 14px の赤い文で原因を書く。フォームの先頭にも知らせを出し、送信後は最初のエラーの欄にフォーカスを移す。
- **Optional:** 任意の欄にだけ、ラベルの横に淡いインクで「任意」と添える。

### Lists（こんなとき・進め方・会社概要・掲載記事）

このサイトの主役の部品。罫線で区切った行に、左に見出し、右に本文を置く。番号は手順に順序があるときだけ（進め方）、青の桁揃えの数字（tabular-nums）で示す。

### Navigation

- **Header:** ワードマーク、ページ内ナビ（14px、薄いインク）、言語の切り替え、塗りのボタン「相談する」。いま読んでいるセクションのリンクは、インクの色にして 8px 下に 1px の下線を引く（`aria-current="location"`）。
- **Footer:** 小さいワードマークと、14px の淡いインクのリンク。各リンクは上下に余白を持たせて 44px の高さにする。
- **Skip link:** フォーカスされたときだけ左上に、塗りのボタンと同じ見た目で出る。

### Product Figure

自社プロダクトの画面写真。一枚紙の台紙に角丸 12px、写真の影、下に罫線で区切った 12px のキャプション。画面写真はライト UI しかないので、ダークでは明るさを少し落として浮かせない。

### Wordmark

「TechTalk」を 800 の太さで字間を詰め（-0.04em）、末尾に青い円の句点を打つ。色を変えたり、句点を外したりしない。

## Do's and Don'ts

### Do:

- **Do** 色を足す前に、既存のトークン（`app/ui/global-styles.ts`）で済まないか考える。
- **Do** 話題の切れ目には 1px の罫線（rule）を引く。
- **Do** 押せるものは見た目の大きさにかかわらず 44px の範囲を確保する。
- **Do** ライトとダークの両方で、本文 4.5:1、入力欄の縁 3:1 を確かめる。
- **Do** 画像には width と height を書き、本物の画面写真か本人の写真だけを使う。
- **Do** アニメーションは `prefers-reduced-motion: no-preference` のときだけ動かす（送信完了の知らせの fade-up と、ボタンの押下）。

### Don't:

- **Don't** 青以外のアクセント色やグラデーションを使わない。
- **Don't** 固定・大きなレイヤーに blur、backdrop-filter、mask を使わない（iOS Safari でスクロール中の描画が遅れる）。
- **Don't** 同じ大きさのカードを並べる構成や、大きな数字の実績パネルを使わない。
- **Don't** テーマの切り替え UI を置かない。OS の設定に従うだけにする。
- **Don't** 角丸に 6px と 12px（と写真の円）以外の値を使わない。
