---
name: TechTalk
description: 青みのある黒の地に大見出しを置き、青い光を描いた生成画像と、自分で作った製品の本物の画面を見せる、一人の会社のプロダクトサイト
colors:
  signal-blue: '#2453d6'
  signal-blue-soft: '#e7edfc'
  white-ground: '#ffffff'
  cool-surface: '#f5f6f8'
  hairline: '#e5e7eb'
  hairline-strong: '#d0d4db'
  field-edge: '#858c99'
  text-strong: '#0b0d12'
  text-muted: '#474e5c'
  text-subtle: '#626977'
  button-fill: '#0b0d12'
  button-ink: '#ffffff'
  danger: '#b42318'
  danger-surface: '#fdecea'
  night-signal-blue: '#7fa2ff'
  night-signal-blue-soft: '#172038'
  night-ground: '#0b0d12'
  night-surface: '#13161d'
  night-hairline: '#20242d'
  night-hairline-strong: '#2f3440'
  night-field-edge: '#646b79'
  night-text-strong: '#f2f4f8'
  night-text-muted: '#b3bac7'
  night-text-subtle: '#8b93a2'
  night-button-fill: '#f2f4f8'
  night-button-ink: '#0b0d12'
  night-danger: '#ff9a8f'
  night-danger-surface: '#3a1c1b'
typography:
  display:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: 'clamp(2.25rem, 1rem + 5.4vw, 5.25rem)'
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: '-0.035em'
  headline:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: 'clamp(1.5rem, 1rem + 2.4vw, 2.5rem)'
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: '-0.02em'
  page-lede:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 400
    lineHeight: 1.6
  section-lede:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.7
  title:
    fontFamily: "'LINE Seed JP', system-ui, -apple-system, 'Hiragino Sans', sans-serif"
    fontSize: '1.25rem'
    fontWeight: 700
    lineHeight: 1.5
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
    letterSpacing: '0.02em'
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
  control: '8px'
  image: '16px'
  pill: '999px'
spacing:
  xs: '8px'
  sm: '16px'
  md: '24px'
  lg: '40px'
  xl: '64px'
  section: '80px'
  section-wide: '128px'
components:
  button-primary:
    backgroundColor: '{colors.button-fill}'
    textColor: '{colors.button-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 22px'
    height: '44px'
  button-primary-compact:
    backgroundColor: '{colors.button-fill}'
    textColor: '{colors.button-ink}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 14px'
    height: '36px'
  button-secondary:
    backgroundColor: 'transparent'
    textColor: '{colors.text-strong}'
    typography: '{typography.label}'
    rounded: '{rounded.pill}'
    padding: '0 22px'
    height: '44px'
  button-secondary-hover:
    backgroundColor: '{colors.cool-surface}'
  input:
    backgroundColor: '{colors.cool-surface}'
    textColor: '{colors.text-strong}'
    typography: '{typography.body}'
    rounded: '{rounded.control}'
    padding: '10px 12px'
  panel:
    backgroundColor: '{colors.cool-surface}'
    rounded: '{rounded.image}'
    padding: '28px'
  note-box:
    backgroundColor: '{colors.cool-surface}'
    textColor: '{colors.text-muted}'
    rounded: '{rounded.control}'
    padding: '20px 24px'
  step-number:
    textColor: '{colors.signal-blue}'
    typography: '{typography.label}'
    size: '40px'
  product-screen:
    backgroundColor: '{colors.cool-surface}'
    rounded: '{rounded.image}'
---

# Design System: TechTalk

## Overview

**Creative North Star: "光を背にした実物"**

一人の会社を、今の開発者向けプロダクトと同じ水準で見せるサイト。夜は青みのある黒、昼は冷たい白の地に、中央の大きな見出しと代表の 1 行を置き、その下から、技術の種が青い光を放つ製品になるまでを描いた横長の画像がせり上がる。自分で作った製品の本物の画面は、進め方の中で、届けているレポートの実例として見せる。見せるのは言葉で飾った実績ではなく、動いている実物と、それを作った本人。

地は平らで、区切りは 1px の細い線と、一段だけ明るい面（surface）の 2 つだけ。アクセントの青は「光」と「印」にだけ使い、ボタンの塗りには使わない。光は 1 画面目の画像の中にだけあり、CSS では描かない。塗りのボタンは文字色と同じ無彩色を反転させたピルで、1 画面に 1 つ。見出しは LINE Seed JP の 700 を大きく詰めて組み、本文は控えめな灰色で短く置く。

テーマは OS の設定に従い、夜と昼の 2 つを同じ役割・同じ構造で持つ。

**Key Characteristics:**

- 青みのある無彩色の階調（夜は黒、昼は白）と、明るい青 1 色だけ
- 区切りは 1px の線と、一段明るい面。影を持つのはプロダクトの画面だけ
- 1 画面目は中央揃えの大見出し、リード、ピルのボタン 2 つ、代表の 1 行、せり上がる生成画像
- 書体は LINE Seed JP の 1 ファミリー（400 / 700、ワードマークだけ 800）
- 日本語の見出しは文節で折り返す

## Colors

青みを帯びた無彩色の階調に、明るい青を 1 色。夜と昼は同じ役割を同じ名前の対で持つ（夜は `night-` を付けたもの）。

### Primary

- **信号の青**（signal-blue / night-signal-blue）: 本文中のリンク、進め方の番号の輪、代表の「いま手がけている仕事」の枠の見出し、ワードマークの句点、フォーカスの枠、選択範囲、チェックボックス。印を付ける場所にだけ使う。
- **青のにじみ**（signal-blue-soft / night-signal-blue-soft）: 入力欄のフォーカス時の外側の輪。

### Neutral

- **地**（white-ground / night-ground）: ページの地。ヘッダーも同じ色の不透明な面で、下端に線を引く。
- **一段明るい面**（cool-surface / night-surface）: 入力欄、代表の「いま手がけている仕事」の枠、送信完了の知らせ、お受けしていない依頼の注記、画面の台紙。地から一段だけ持ち上げたい面。
- **細い線**（hairline / night-hairline）: ヘッダーとフッターの区切り、一覧の行と列の区切り、面の縁。
- **濃い線**（hairline-strong / night-hairline-strong）: 枠線だけのボタン、写真の縁、進め方の段をつなぐ線、スクロールバー。
- **入力欄の縁**（field-edge / night-field-edge）: 入力欄の枠だけに使う。地との差を 3:1 以上にする。
- **強い文字**（text-strong / night-text-strong）: 見出しと本文。
- **抑えた文字**（text-muted / night-text-muted）: リード文、一覧の答えの側、注記、ページ内ナビ。
- **淡い文字**（text-subtle / night-text-subtle）: 会社概要の項目名、肩書き、フッター、言語の切り替え、プレースホルダー。地に対して 4.5:1 以上を保つ。
- **ボタンの塗り**（button-fill / button-ink と夜の対）: 強い文字の色を反転させた塗り。夜は白いピルに黒い文字、昼は黒いピルに白い文字。
- **警告の赤**（danger / danger-surface と夜の対）: 入力エラーと送信失敗だけ。

### Named Rules

**The 青は光と印 Rule.** アクセントは青 1 色だけ。光（1 画面目の生成画像の中）と印（リンク、番号、枠の見出し、句点、フォーカス）にだけ使い、ボタンや面を青で塗らない。2 色目の強調色を足さない。

**The 光は 1 か所 Rule.** 青い光は 1 画面目の生成画像の中にだけ描く。CSS では光もグラデーションも描かず、文字、ボタン、面、背景全体のどれにも掛けない。例外は、プロダクトの画面の中で実物の見た目に合わせたものだけ。

## Typography

**Display / Body Font:** LINE Seed JP（system-ui、-apple-system、Hiragino Sans にフォールバック）

**Character:** 1 ファミリーで、大きさと太さだけで階層を作る。大見出しは 700 を大きく、字間を詰めて組み、プロダクトサイトの張りを出す。丸みのある骨格が、話し言葉の文面を硬くしすぎない。使う文字だけに絞った WOFF2 を自前で配信する。

### Hierarchy

- **Display**（700、clamp(2.25rem → 5.25rem)、1.15、字間 -0.035em）: ページの冒頭の見出しだけ。トップのキャッチ（中央揃え、2 行）と、経歴・プライバシーの名前。
- **Headline**（700、clamp(1.5rem → 2.5rem)、1.3、字間 -0.02em、最大 20em）: 各セクションの見出し。全セクションで共通。
- **Page lede**（400、18px → 760px 以上で 20px、1.6）: Display の下のリード文。トップは最大 44em、ほかのページは 32em。
- **Section lede**（400、16px → 760px 以上で 18px、1.7、最大 34em、抑えた文字）: セクション見出しの下のリード文。
- **Title**（700、18〜20px、1.5）: 一覧の各項目の見出し（こんなとき、進め方の各段）。
- **Body**（400、16px、1.7、字間 0.01em）: 本文。段落は最大 30〜36em。
- **Label**（700、14px、字間 0.02em）: ボタン、フォームのラベル、枠の見出し、注記の見出し。ナビとフッターのリンクは同じ 14px の 400。
- **Caption**（400、12px）: プロダクトの画面の中の小さな文字だけ。

### Named Rules

**The 文節で折る Rule.** 日本語の見出しは文節ごとに inline-block の塊にし、単語の途中で折り返さない。本文には `word-break: auto-phrase` と `line-break: strict` を掛ける。英語の訳文には塊を使わない。

**The 見出しに語らせる Rule.** セクション見出しの上に小さなラベル（いま何の話か）を置かない。見出しそのものが話題を言う。

**The 太さで分ける Rule.** 階層はサイズと太さで作る。書体を足したり、斜体や全大文字にしたりしない。

## Layout

- **コンテナ:** 最大幅 75rem（左右の余白 24px を含めて 1200px）、中央寄せ。
- **1 画面目:** 中央揃えの 1 列。上の余白 72px（900px 以上で 104px）。見出し → 24px → リード → 36px → ボタン 2 つ（間隔 12px）→ 40px → 代表の 1 行（写真、名前、1 文）→ 24px（900px 以上で 8px）→ 生成画像。画像はコンテナの外に置き、幅いっぱい（最大 1600px、中央寄せ）に広げる。
- **セクション:** 1 列、左揃え。上下の余白 80px、900px 以上で 128px。セクション同士は余白だけで区切り、線を引かない。
- **3 列の一覧:** こんなとき・進め方は、900px 以上で同じ幅の 3 列。こんなときは列の間に縦の線、進め方は番号の輪を横の線でつなぐ。狭い幅では 1 列に積み、こんなときは行の線、進め方は縦の線でつなぐ。
- **代表:** 写真と名前の行の下に、900px 以上で「理由の文 : いま手がけている仕事の枠 = 1 : 1.1」の 2 列。
- **問い合わせ:** 960px 以上で説明とフォームを 0.9 : 1.1 の 2 列。名前と会社名は 560px 以上で横に並べる。
- **会社概要:** 640px 以上で項目名 160px と値の 2 列、行ごとに下に線。
- **ヘッダー:** 上部に固定、高さ 64px。860px 以下ではページ内ナビが 2 段目に回り（108px）、360px 未満では 3〜4 段に折り返す（190px）。横スクロールにはしない。
- **余白の刻み:** 8px を基準に、8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64 / 72 / 80 / 104 / 128px を使う。
- **ブレークポイント:** 560（フォームの欄）/ 640 / 760 / 860（ナビ）/ 900（列）/ 960（問い合わせ）px。

## Elevation & Depth

地は平ら。奥行きは 1px の線と、地から一段明るい面（surface）で示す。線は `border` か `inset 0 0 0 1px` の内側の線で引く。影を持つのは進め方のプロダクトの画面だけで、台紙に載せた 1 枚の実物として扱う。光は CSS では描かない。

### Shadow Vocabulary

- **画面の影**（`--shadow-image`）: 1px の縁取りと、下へ落ちる柔らかい影（昼は 2 段、夜は 1 段の深い影）。プロダクトの画面だけに使う。
- **写真の輪**（`0 0 0 1px var(--border-strong)`）: 代表の丸い写真の縁。

### Named Rules

**The 影は画面だけ Rule.** 一覧、面、注記、フォームに落ち影を付けない。持ち上げたいときは一段明るい面と 1px の線で済ませる。

## Shapes

角丸は 3 値と円。押すボタンはピル（999px）、入力欄・注記・スキップリンクは 8px、大きな面と画面は 16px。代表の写真、進め方の番号の輪、ワードマークの句点は円。それ以外の形（斜め、切り欠き、ブロブ）は使わない。プロダクトの画面の中は、実物（Artifact Share）の角丸に合わせる。

## Components

### Buttons

丸いピルで、押すと応える。

- **Shape:** ピル（999px）。高さ 44px、左右 22px。ヘッダーだけ高さ 36px・左右 14px にし、押せる範囲は `::before` で上下に広げて 44px にする。
- **Primary:** ボタンの塗り（文字色を反転した無彩色）に、ラベル書体。1 画面に 1 つだけ（ヘッダーと 1 画面目の「相談する」、フォームの送信）。hover で地の色を 16% 混ぜて少し沈める。
- **Secondary:** 透明の地に濃い線の内側の縁。hover で一段明るい面が出て、縁が淡い文字の色になる。
- **Hover / Focus / Active:** 150ms ease-out で変える。フォーカスは 2px の青い枠（3px 離す）。押下で 0.97 倍に縮む。無効時は不透明度 0.6。
- **強制カラーモード:** 背景と影が消えるので、実線の枠を描く。

### Inputs / Fields

- **Style:** 一段明るい面に、入力欄の縁の 1px の内側の線。角丸 8px、余白 10px 12px、文字は 16px（iOS で拡大されない大きさ）。
- **Focus:** 縁が 1.5px の青になり、外側に 4px の青のにじみ。
- **Error:** 縁が 1.5px の赤になり、欄の下に 14px の赤い文で原因を書く。送信失敗は赤の面（danger-surface）に角丸 8px で知らせる。
- **Optional:** 任意の欄にだけ、ラベルの横に淡い文字で「任意」と添える。
- **Checkbox:** 18px、`accent-color` を青に。ラベルごと 44px の高さで押せる。

### Panels（代表のいま手がけている仕事、送信完了）

- **Corner Style:** 16px。
- **Background:** 一段明るい面に、細い線の内側の縁。影は付けない。
- **Internal Padding:** 24〜32px（いま手がけている仕事の枠は 24px、760px 以上で 28px）。中の一覧は行を細い線で区切る。
- **Heading:** 14px / 700 の青い文字だけで、枠も塗りも付けない。

### Note Box

お受けしていない依頼の注記。一段明るい面、細い線の縁（強制カラーモードでも残るよう border で描く）、角丸 8px、余白 20px 24px、最大 44em。見出しも本文も 14px。

### Lists（こんなとき・進め方・会社概要・経歴・いま手がけている仕事）

区切りは塗りではなく線。こんなときは 3 列を縦の線で、会社概要、経歴、いま手がけている仕事は行を横の線で分ける。進め方の番号は、青の 1px の輪（40px の円）に青の桁揃えの数字（tabular-nums）で示し、段と段を濃い線でつなぐ。番号は順序があるときだけ使う。

### Navigation

- **Header:** ワードマーク、ページ内ナビ（14px、抑えた文字）、言語の切り替え（14px、淡い文字）、塗りのピル「相談する」（36px）。ナビの並びはページの上からの順（こんなとき / 進め方 / 代表）にそろえ、現在地の印がスクロールで前にだけ進むようにする。いま読んでいるセクションのリンクは、強い文字の色にして 1px の下線を引く（`aria-current="location"`）。地と同じ色の不透明な面で、透かしやぼかしは使わない。
- **Footer:** 上に細い線、小さいワードマークと 14px の淡い文字のリンク。各リンクは上下 10px の余白で 44px の高さにする。外部リンクには小さな右上向きの矢印（Lucide の SVG を埋め込んだもの）を添える。
- **Skip link:** フォーカスされたときだけ左上に、塗りのボタンの配色で出る。

### Product Screen（進め方）

進め方の 2 番目の手順で届けるレポートの実例。Artifact Share で技術検証レポートのサンプルを開いた画面を、ブラウザの枠ごと HTML で描いたもの。3 段の一覧の後に置く（上の余白 64px、900px 以上で 80px）。一段明るい面の台紙に角丸 16px と画面の影。光もせり上がりも付けない。下に左揃えの説明を置く（画面との間 20px、行の間 8px）。太字の 1 行、抑えた文字の説明、サンプルと artifactshare.com への外部リンク（間隔 24px）の順。

中身の配色・並び・文言・数値は実物とサンプルに合わせ、実物にない機能や数値は描かない。寸法は枠の幅から決めた単位で書き、画面写真のように全体を縮める。

### Generated Image（1 画面目）

1 画面目の代表の 1 行の下に置く、横長（1600×560）の生成画像。技術の種が切り出され、青い光を放つ製品になるまでを描いたもので、サイトの青い光はこの中にだけある。夜用と昼用の 2 枚を `<picture>` で `prefers-color-scheme` に合わせて出し分け、四辺はページの地の色に溶かしてあるので枠も角丸も影も付けない。飾りなので `alt=""`。1 画面目の画像なので `fetchpriority="high"` で読み込み、表示時に 48px 下から 0.9s でせり上がる（`cubic-bezier(0.16, 1, 0.3, 1)`、動きを減らす設定では動かさない）。来歴は画像の横の `.json` に残す。

### Wordmark

「TechTalk」を 800 の太さで字間を詰め（-0.04em）、末尾に青い円の句点（0.3em）を打つ。ヘッダーは 20px、フッターは 16px。色を変えたり、句点を外したりしない。

## Do's and Don'ts

### Do:

- **Do** 色を足す前に、既存のトークン（`app/ui/global-styles.ts`）で済まないか考える。
- **Do** 区切りには 1px の線（hairline）か、一段明るい面（surface）を使う。
- **Do** 押せるものは見た目の大きさにかかわらず 44px の範囲を確保する。
- **Do** 夜と昼の両方で、本文 4.5:1、入力欄の縁 3:1 を確かめる。
- **Do** 画像には width と height を書く。プロダクトの画面は本物（写真か、それを忠実に描いた HTML）、人物は本人の写真だけを使う。生成画像は夜用と昼用を対で作り、来歴を残す。
- **Do** アニメーションは `prefers-reduced-motion: no-preference` のときだけ動かす（1 画面目の画像のせり上がり、送信完了の fade-up、ボタンの押下）。

### Don't:

- **Don't** 青以外のアクセント色を使わない。青でボタンや広い面を塗らない。
- **Don't** CSS でグラデーションや光を描かない（プロダクトの画面の中で実物に合わせるものを除く）。青い光は 1 画面目の生成画像の中にだけ置く。
- **Don't** 固定・大きなレイヤーに blur、backdrop-filter、mask を使わない（iOS Safari でスクロール中の描画が遅れる）。
- **Don't** 塗りや影の付いたカードを並べない。並べるときは線で区切る。大きな数字の実績パネルも使わない。
- **Don't** セクション見出しの上に小さなラベルを置かない。
- **Don't** テーマの切り替え UI を置かない。OS の設定に従うだけにする。
- **Don't** 角丸にピル・8px・16px・円以外の値を使わない（プロダクトの画面の中を除く）。
