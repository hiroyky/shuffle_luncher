# shuffle_luncher

## About

Slackシャッフル ランチ ボットをAWSサーバレスアーキテクチャで作る
https://qiita.com/hiroyky/items/d0db77a4903f5941d0eb

## Introduce
### Build
```
git clone git@github.com:hiroyky/shuffle_luncher.git
cd shuffle_luncher
npm install
npm run build
```

### Deploy
[aws-cliがインストール](https://docs.aws.amazon.com/ja_jp/streams/latest/dev/kinesis-tutorial-cli-installation.html)されて実行できることが前提です．
```
./deploy/deploy.sh <デプロイ時のS3バケット名> <SlackのチャンネルID>
```

| 値 | 内容 |
|:---|:----|
| デプロイ時のS3バケット名 | デプロイするパッケージを保存するバケット名 |
| SlackのチャンネルID | Slackボットを動かしたいslackチャンネルIDを指定. URL:https://xxxx.slack.com/messages/YYYY/ のYYYYの部分を指定 |
