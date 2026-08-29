
---
title: "Linuxの初期設定一覧"
date: 2026-08-29
tags: ["Linux", "学習ノート"]
---

## 概要

ここ最近Linuxを新規導入することが増えました。VPSなり自宅サーバーなりですね。
もうこの手の記事は車輪の再開発ってレベルじゃないですが、自分の中でLinux導入時の手順と諸注意を記載していきます。

## ディストリビューションの選択

基本的には用途やGUIのありなしで考えていきます。GUIありかつ、私のように開発等メインならUbuntuやFedoraあたりが選択肢に入るでしょう。もう少しLinuxへの解像度が高いならArchLinuxとかopenSUSEとかになるんですかね？
VPSでのサーバー用途になるなら一旦WSLでのデフォルトとしてUbuntu Serverが入ってくるとは思います。ただ他にもDebianのような軽量もあるしAlmaLinuxとかもあるそうです。
とりあえず今回は自宅サーバーやVPSも揃えてUbuntu Serverを入れています。VPSの方は対応していなかったので24.04、自宅サーバーは26.04を入れています。

## OS導入

LinuxはVPSなら数回のクリック程度で導入できますが、LinuxはOS（のようなもの）なので自宅サーバーに入れる際はディスクイメージをサイトからダウンロードしてisoイメージをディスクに焼くか、変換してUSBメモリに入れる必要があります。
現在は一般的にはUSBメモリが一番簡単なため

- isoイメージ
- Rufusなどの焼くソフト
- USBメモリ（OS入れるため8GBは欲しい）
- OSを入れるための新規パソコン

あたりを必要とします。Linuxを触る以上当たり前ですが、各種操作をするために普段遣いのパソコンも必要とします。

あとはRufusなどの指示に従ってUSBメモリにOSを入れて、OSを入れるためのパソコンにUSBを挿入。BIOS画面を出してドライブ読み込み順を切り替えてLinuxインストーラーを起動します。

## Linuxのインストーラーの注意点

Ubuntu Serverを入れる時に悩んだのが名前の入力です。なぜか「Your name」「Your server's name」「Pick a username」の3種類の名前を入れる必要があり、意外にもここで何を書けばいいか分かりませんでした。
基準としては

- Your name:           なんでも良いが2byte文字は後々問題になる
- Your server's name:  パソコンにつける名前。どのサーバーか分かるようにすると良い。ユニークな名前も可能
- Pick a username:     実質的なアカウント名。分かりやすい名前にすると良い

です。ターミナルには常に{pick a username}@{Your server's name}が表示されるため短く、かつ直感が働くものが良いと思われます。

残りは基本的にはデフォルトで可能。唯一自宅サーバーはOpenSSHのチェック項目だけonにしておくと後々楽かもしれません。

## ターミナルにログオン出来たあと

結構やることは山積みなのでまずは列挙します。

- パッケージの最新化
- ユーザーの作成とsudo権限、SSH認証鍵の作成
- rootユーザー無効化やパスワード認証の無効化
- デフォルトユーザーの無効化(vpsのみ)
- SSH接続の簡略化
- ufwの設定
- タイムゾーン、スワップ、自動セキュリティの設定

### パッケージの最新化

```bash
sudo apt update && sudo apt upgrade -y
```

いつものコマンド。前者はソフトウェアの更新リストを作成、後者はその更新リストを元に更新をする。このコマンドはセット。

### ユーザーの作成 sudo権限付与 SSH認証鍵の作成

ここのマイルストーンは「自分のアカウントを作成しsudo権限を付与すること」「SSH接続を認証鍵で実行できること」の2つです。
パスワードではなく公開鍵認証方式にしていますが、なぜ比較的安全かについて説明すると長くなるため一旦割愛します。

自分のアカウントは自宅サーバーだと最初に設定しますが、VPSの場合は「ubuntu」などの初期ユーザーが作成されているかもです。
しかし、このデフォルトユーザー名は使われすぎて不正アクセスの対象にされやすいため新しくユーザーを作るのが無難とされています。

まずは自分のパソコン側で認証鍵を作りましょう。ここではWSL（Ubuntu)のコマンドを記載します。詳しくは調べてください

```bash
# xxxxxは任意の文字を入れてください。サービス名だと分かりやすいです。
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_xxxxx -C "xxxxx-vps"

# 公開鍵の中身をコピーしてください。間違えても「.pub」なしの秘密鍵をコピーしたりしないでください。
cat ~/.ssh/id_ed25519_xxxxx.pub
```

次にVPSや自宅サーバー側のターミナル操作です

```bash
# ユーザー作成が必要なら実施
adduser {user名}
usermod -aG sudo {user名}
su - user
group user # sudo ユーザーであるか確認

mkdir ~/.ssh # 自宅サーバーなら既に作られているかも
chmod 700 ~/.ssh
vi ~/.ssh/authorized_keys # ここに先ほどの公開鍵の中身をペースト。改行は入れないように
chmod 600 ~/.ssh/authorized_keys
```

コピペの方法やvi以外にテキスト入力方法はあるので各自の方法で実施しましょう。
次は認証鍵がちゃんと機能するか確認するために**現在のログイン済ターミナルは残したまま**新規のターミナルを立ち上げてログインしてみましょう

```bash
ssh -i ~/.ssh/id_ed25519_xxxxx {user名}@{ipアドレス}
```

これでパスワードを求められずログインできればOKです。

### root無効化とパスワード無効化

マイルストーンは「rootユーザーにSSHログインで入れないこと」「パスワードログインができないこと」の2つです。
認証鍵方式にしているのにパスワードログインのようなチャレンジレスポンスの窓口があるとブルートフォースアタックの試される可能性があるためそれを弾きます。
rootユーザー無効化については既にLinux側が無効にしていているかもしれませんが確認が大事です。

rootユーザーにSSHログインできてしまうと、ありとあらゆる操作が出来てしまうため基本は無効にしているのが当然です。

```bash
# 現状の確認 Lの場合は問題なし。PやNPの場合は要確認
sudo passwd -S root

# rootログインの許可を消す
vi /etc/ssh/sshd_config
# PermitRootLogin noみたいにコメントアウトしていればコメントアウトを消す

# エラーが無いか確認 何も表示されないならOK
sudo sshd -t

# 反映確認
sudo sshd -T | grep -i permitrootlogin # noとなっていればOK

# 再起動
sudo systemctl restart ssh

# 別ターミナルからssh接続してPermission deniedされるか確認
ssh -v root@{ipアドレス} # -vをつけると認証方式まで見える
```

続いて作成したユーザーのパスワードログインを拒否するようにします
ただここは注意点があります。特にSSH認証鍵で入れることを確認しておかないと詰むのでご注意ください。
もう一つは26.04の場合、設定項目が複数分散されており、どれか1つがyesな状態だと上手くオフになりません。
その点も加味して確認します。

```bash
# パスワードのログイン許可を消す
vi /etc/ssh/sshd_config
# PasswordAuthentication yesをnoにしてコメントアウトを消す

# 現状の確認
sudo sshd -T | grep -i passwordauthentication # yesの場合は以下をチェック
sudo grep -ri passwordauthentication /etc/ssh/
# 大体は50-cloud-init.confにyesがあって変更しない限りはyesのまま

sudo vi /etc/ssh/sshd_config.d/50-cloud-init.conf
#PasswordAuthentication yes としてコメントアウトしておく

# 現状の再確認
sudo sshd -T | grep -i passwordauthentication # noの場合はOK
# ただしどうしてもyesになる場合はコメントアウトしたyesの下にnoの設定値を入れる

# エラーが無いか確認 何も表示されないならOK
sudo sshd -t

# 反映
sudo systemctl reload ssh

# 確認。今のターミナルを閉じずにsshログインを試す
ssh {user名}@{ip}
# パスワード入力を求められなければOK
```

### デフォルトユーザーの無効化（VPSのみ）

vpsの場合はデフォルトユーザーが存在するかもしれません。私の場合はubuntuでした。ただしユーザーを削除するのではなく、認証鍵を無効化という方式にしておくと後から手戻りが発生した時に元に戻しやすいです。

```bash
sudo usermod -L ubuntu
sudo mv /home/ubuntu/.ssh/authorized_keys /home/ubuntu/.ssh/authorized_keys.disabled

# 別ターミナルで拒否されれば成功
ssh -i ~/.ssh/~~~.key ubuntu@{vpsのipアドレス}
```

記載していませんでしたが、vpsの場合は初期に認証鍵を作っているかもしれません。その場合は公開鍵を自分のパソコンの.ssh/ディレクトリに入れといてから実験してください。

### 本体側での接続を簡略化（オプション）

現時点でもssh入力できますが、いちいちコマンド入力の詳細が面倒なのでこれを簡略化します。ファイルを作るのはSSH側じゃなくてこちらのパソコン側です。

```bash
vi ~/.ssh/config
```

```
Host hoge
  HostName {IPアドレス}
  User {user名}
  Port 22
  IdentityFile ~/.ssh/id_ed25519_xxxxx
  IdentitiesOnly yes
```

中身をこのようにしておくと`ssh hoge`で接続できるようになります。
あとPort 22を別のPortにしたほうがいいのではという意見もありますが、wireguardなどのvpsを入れる時に面倒になるため、その予定がある方は変えないでおいでください。

### ufwの設定（ファイアウォール）

ここでのマイルストーンは「Port22以外の外から来るものは全部拒否」です。故に順番を間違えると詰むのでご注意を。

```bash
sudo ufw status # 現状確認。inactiveでOK

# 外から来るものを全部拒否。中から出るものは全部許可
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSHを許可 これを下より先に実施してください。やらないと詰みます
sudo ufw allow 22/tcp

# ufw有効化
sudo ufw enable
# yで進めてください。SSHを許可していればまず締め出されません

# 確認
sudo ufw status verbose # 22/tcpがOKか確認

# 別ターミナルからSSH接続を確認
ssh hoge
```

ここまでが設定の基本です。残りは使いやすくするための施策です。

### タイムゾーン確認、スワップ、自動セキュリティ更新

```bash
# タイムゾーン、一応確認
timedatectl # Asia/Tokyoじゃないなら以下を入力
sudo timedatectl set-timezone Asia/Tokyo

# スワップ作成。少ないメモリの場合を補うため(2GB想定)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 自動セキュリティ更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## まとめ

ubuntu 26.04での設定のため他のディストリビューションだと結構違うかもしれません。ただ注意するところは同じなはなずなので自分もこれを活用しようと思います。
