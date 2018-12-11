＃Architecture

- mBaaS(Hosting, Database, Authentication): [firebase](https://console.firebase.google.com/)
- Framework: [Polymer](https://www.polymer-project.org/)

# Contribute

## Setup

```
npm install -g polymer-cli@next --unsafe-perm
npm install -g firebase-tools
npm install
```

## build & deploy

以下の npm start をすると、3000 ポートで起動し、ソースを変更するとオートリロードします。起動してうまく表示されないときは 8081 ポートで一度アクセスするとうまくいきます。

```
npm start // local check
polymer build // JS transpile etc
firebase deploy // deploy to firebase
```

## Facebook 認証の環境構築

Facebook 認証は https じゃないと動かないので、次の手順が必要。

1. ngrok をインストール

Mac の場合

```
brew cask install ngrok
```

2. ngrok で https の URL をメモ

```
brew cask install ngrok
```

3. 準備

以下の「準備」に従って、Facebook 認証を設定する。

https://firebase.google.com/docs/auth/web/facebook-login?hl=ja

4. firebase の設定

firebase の Authentication-ログイン方法の「承認済みドメイン」に 2 でメモした https の URL を追加する。

5. facebook の設定

- 設定-ベーシック-アプリドメイン　に 2 でメモした https の URL を追加する。
- Facebook ログイン-設定-有効な OAuth リダイレクト URI に 2 でメモした https の URL+"/\_\_/auth/handler"を追加する。

# BuddyUp イベント開催手順　（コミュニティ生成）

1 コミュニティを台帳に登録する
このワークシートの「コミュティ一覧」　タブに記載する
Slack にコミュニティ用 Ch を切る
2 Buddyup のソースをクローン ↓
https://github.com/itagakishintaro/buddyup
１ 画面内「Clone or Download」から URL をコピー
２ 適当なフォルダを作成
３　 FJ-WAN の場合、プロキシ認証のため、以下のコマンドをたたく
　　 git config --global http.proxy http://okamura.kana%40jp.fujitsu.com:password@nmb.proxy.nic.fujitsu.com:8080
４ 配下で　 git clone https://github.com/itagakishintaro/buddyup.git
3 firebase のアプリを作る
https://console.firebase.google.com/
はじめに
[+] をクリックする　 → 　プロジェクトを作成　プロジェクト名は「buddyup[コミュニティ名]」にする　　　例： buddyupONEJAPAN
作成したプロジェクトをクリック
Project Overview 欄の　「歯車マーク」をクリック
メンバーを追加で下記を追加 (オーナー)
itagaki.shintaro@gmail.com
sumioka.motoshi@gmail.com
「開発」をクリック
Authentication
「ログイン方法を設定」をクリック
メールアドレスとパスワードを有効に　（上だけ）
自分の名前か、sumioka.motoshi@gmail.com を設定
google アカウントを有効に
Database
Realtime Database の欄で。（Cloud Firestore ではない！！！）
「データベースを作成」をクリック
テストモードで開始
有効にする
Storage
「スタートガイド」をクリック
Hosting
「使ってみる」をクリック
4 ソースコードを変更する
.firebaserc
プロジェクトＩＤを変更する　例：　 buddyup-204005 　　 → 　　 buddyup-23skf
src/my-app.js
作成したプロジェクトに入り、冒頭アプリ追加の部分にある</>からスニペットの Config の内容をコピー
コピーした Config の内容をソースの./src/my-app.js の 248 行目 Config にコピー
5 firebase のツール類をインストールする　（https://github.com/itagakishintaro/buddyup/blob/master/Readme.md）
nodejs, npm をインストールする　（nodejs は、javascript のエンジン、npm はパッケージ管理ツール）
https://nodejs.org/ja/ ※ nodejs をインストールすると両方インストールされる
必要に応じて npm のプロキシ設定をする https://qiita.com/Shogo_TODA/items/dfbc5104f6b35612e838
下記のコマンドを実行する
npm install -g polymer-cli@next --unsafe-perm
npm install -g firebase-tools
npm install
※　ダメなら、 --unsafe-perm 　をつけたり、sudo でやってみよう
6 手元で動作確認する
下記のコマンドを実行する
polymer serve
ローカルで動いているかブラウザで確認する
http://localhost:8081
7 firebase にデプロイする
下記のコマンドを実行する
polymer build (polymer serve 　は実行しっぱなしで別プロンプトで実行してもよいし CtrlC してもよい)
firebase login （社内からはできてない、社外ネットワークからログイン）
firebase deploy (同じく社外ネットワークから推奨)　(成功すると Hosting url にデプロイして Web 上にできたアプリの URL が記載されている)
インターネット上で動いているか、ブラウザやスマホなどで確認する
8 コミュニティ一覧に追加する
firebase deploy の出力で Hosting url 　の欄に書かれた URL を「コミュニティ一覧」タブの URL 欄に記載する
9 確認
ログインする
設定＞プロフィール画像の変更　 → 　できる
交流会の登録をする　 → 　できる
交流会に参加する　 → 　参加がＣＡＮＣＥＬに変わる（変わらなかったらリロード）
自分のチャットに入る　 → 　入れる
プロフィール一覧を表示する　 → 　自分が出てくる
自分の名前をクリックする　　 → 　タグが表示される
ユーザ一覧を表示する　 → 　まだ出てこない（笑）
