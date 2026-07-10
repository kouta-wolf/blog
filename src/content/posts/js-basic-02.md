---
title: "JavaScript基礎思い出しシリーズ②：アロー関数"
date: 2026-07-10
tags: ["JavaScript", "学習ノート"]
---

## はじめに

javascriptでは関数の書き方が3つほどあります。それぞれ**関数宣言**、**関数式**、**アロー関数**です。
まずは書き方から学びました。

## 関数式とアロー関数の書き方

前提として以下は返り値を全て10にしつつ、出力方式も簡易表示にしています。
このままだと動作しない可能性があることにご注意ください。

なお、この記事の`this`の出力例は**ブラウザのコンソール（非モジュール）で実行した場合**を前提にしています。Astroなどの ES モジュール環境や strict モードではトップレベルの`this`が`undefined`になり、`player.arrow()`は`TypeError`になる点にご注意ください。

```javascript
// --- 関数宣言 ---
function normalFunction(m, n) {
  return m * n;
}

// --- 関数式 ---
const normalFunction2 = function (m, n) {
  return m * n;
}

const obj = {
  normalFunction3: function (m, n) { // object内なら関数式のconstを省略できる
    return m * n;
  }
};

normalFunction(5, 2) // => 10
normalFunction2(5, 2) // => 10
obj.normalFunction3(5, 2) // => 10

// --- アロー関数 ---
const arrowFunction = (m, n) => {
  return m * n;
}

// 引数が1つなら()を省略可能
const arrowFunction2 = m => {
  return m * 2;
} 

// 引数が無いなら()だけを記載
const arrowFunction3 = () => {
  return 5 * 2;
}

const arrowFunction4 = (m, n) => m * n; // {}を省略すれば "return"も省略できる

arrowFunction(5, 2) // => 10
arrowFunction2(5) // => 10
arrowFunction3() // => 10
arrowFunction4(5, 2) // => 10
```

基本的に関数を書くならどれかを選んでおけば間違いないです。
ただし細かい仕様の違いがあることに留意してください。

## thisの存在

javascriptには`this`という機能があります。
実はこの`this`によって関数式とアロー関数が別の機能を持つということを紐解けます。
機能の解説をしても分かりづらいのでコード例です。

```javascript
const player = {
  name: "ヒーロー",

  normal: function () { // オブジェクト内の省略した関数式の記法
    console.log("normalのthis.name = ", this.name);
  },

  arrow: () => { // オブジェクト内の省略したアロー関数の記法
    console.log("arrowのthis.name = ", this.name);
  }
};

player.normal(); // => "ヒーロー"
player.arrow();  // => ""（ブラウザのコンソールで実行した場合）
```

thisの機能は主にメソッドが関連付けられているオブジェクトを読みます。
つまり`player.normal()`を見た時`player`がオブジェクト、`normal()`がメソッドになります。そうなると`this`の正体は`player`となり`player.name`は"ヒーロー"になります。

さて、`player.arrow()`もまた`this`を使っているため`this`が`player`であるかと思いきや実はそうではありません。
アロー関数は`this`を自分で持たず、**書かれた場所の外側の`this`をそのまま使います。** ここでは外側がグローバルなので、ブラウザでは`this`は`window`になります。

ここで少し注意点です。`player.arrow()`の結果が`""`（空文字）になるのは、**`window.name`が「初期値が空文字」という特殊な組み込みプロパティ**だからです。グローバルの`this`自体は`undefined`でも空文字でもなく、あくまでオブジェクトである点に気をつけてください。`name`以外のプロパティを読むと、後述のように`undefined`になります。

これを前提として再度同じコード例に注釈を書いてみましょう。

```javascript
const player = { // const playerは変数宣言であり、関数宣言ではない。
  name: "ヒーロー",

  normal: function () { 
    console.log("normalのthis.name = ", this.name);
  },

  arrow: () => { 
    console.log("arrowのthis.name = ", this.name); // thisはあるけど、外側のconst playerは関数じゃない。
  }
};

player.normal(); // normal()のthisはメソッド左のオブジェクト=playerなので"ヒーロー"が出力される
player.arrow();  // アロー関数のthisは外側であるグローバルを参照する。ブラウザではthis===windowになる
```

一見このままだとarrowの方が機能弱くない？と思われるかもしれませんが、この挙動だと実は嬉しいことがあります。
特に関数がネストしていく時にとても有用になります。

```javascript
const counter = {
  count: 0,

// 通常の関数の場合
  startNormal: function () {
    console.log(this.count); // この時点ではthisはcounterだということを分かっている。

    setTimeout(function () {
      console.log(this.count); // ここに移った時、thisは単独で呼ばれるためwindowになる。window.countは無いのでundefined。
    }, 500);
  },

// アロー関数の場合
  startArrow: function () {
    console.log(this.count); // この時点ではthisはcounterだということを分かっている。
    setTimeout(() => {
      console.log(this.count) // ここで呼ばれた時、アロー関数はthisを持たないため一番近い関数である上の関数を参照する。つまりthisはcounterになる。
    }, 500);
  },
};

counter.startNormal(); // => 0.5秒後に undefined （setTimeout内のthisはwindowになり、window.countは存在しないため）
counter.startArrow();  // => 0.5秒後に 0
```

この挙動によって次から次へと継承のような形に出来るため普通の関数式のみならずアロー関数も必要で、それぞれ使い分けが大事になります。


## まとめ

thisの存在が中々難しいです。とりあえずはアロー関数も通常関数も両方書けるように努めます。
