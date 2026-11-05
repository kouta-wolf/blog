---
title: "Rustの所有権についてまとめた"
date: 2026-11-05
category: "学習ノート"
tags: ["Rust"]
---

## はじめに
Rustでの勉強を言語化するためにまとめたノートです。
自分が分かるようにだけ書いているので細かい仕様を確認したい方はドキュメント見たほうが早いです。
また間違いがあると思うのでご注意ください。


## Rustの変数は明示しない限りはイミュータブル
現時点で`let x = ~~~ `のxは不変（イミュータブル)であり、x自体の中身はいじれないです。

```Rust
let x = 1;
x = 2; // コンパイルエラー
```

そのためlet の後に可変にする`mut`をつけることによって解決します

```Rust
let mut x = 1;
x = 2;
println!("{}", x); // 2
```


## RubyとRustの違い

RubyやPythonは複数の変数が同じオブジェクトを共有できます

```Ruby
x = "Hello, World!"
y = x # yとxが同じオブジェクト（Hello, World!を指す）
```

一方のRustでは簡単には行きません

```Rust
let x = String::from("Hello, World!"); 
let y = x; // Hello, World!の所有権がxからyへ移る。以降xは使用不可となる。
println!("{}", x); // コンパイルエラー: value borrowed here after move
```

## なぜこんな仕様になるのか
RubyやPython等と違い、CやRustにはGC（ガベージコレクション）がありません。
Rubyでは実行中に使用していないオブジェクトを探して自動的に解放しますが、GC実行はRubyの任意のタイミングで起こるため思わぬところで処理を誘発します。
Cは`free`などと明示してメモリ解放をしますが、メモリリークや二重解放でバグを誘発する可能性があり常に意識する必要があります。
これらの問題を解決するためにRustではGCがない代わりに変数のスコープを抜けたらメモリ解放をします。仮にxとyが同時にスコープを抜けると同じメモリを2回解放し二重解放となるため、Rustではデータの所有者は常に一つとして防ぐため、代入を扱うと所有者が移動するようにできています。


## コードの解決
上のコンパイルエラーを解決する上で、1つはyにxのデータをコピーする方法がありますが、当たり前ですがメモリ効率が悪くなります。

```Rust
let x = String::from("Hello, World!");
let y = x.clone();
println!("{}", y);
```

そこでRustでは明示的に『参照』を指示することによってデータの利用を可能とします。

```Rust
let x = String::from("Hello, World!");
let y = &x; // 参照をする記号アンパサンド& を用いる
println!("{}", y); // Hello, World!
```


## 参照からデータを変更する場合は参照と可変を組み合わせる
最初に答えを書きます。

```Rust
fn main() {
    let mut x = String::from("Hello");
    let y = &mut x;
    y.push_str(", World!");
    println!("{}", x); // Hello, World!
}
```

`&mut`はこのように参照と可変を組み合わせることで、別の変数でも元のデータをいじることが可能となります。
ただし制約上、&mutは同時に一つしか作れないことだけは注意しないと行けません。

```Rust
fn main() {
    let mut x = String::from("Hello");

    let y = &mut x;
    let z = &mut x; // コンパイルエラー: cannot borrow `x` as mutable more than once at a time

    y.push_str(", World!");
    z.push_str("!!");
}
```

また&と&mutも同時には使えません。

```Rust
fn main() {
    let mut x = String::from("Hello");

    let y = &x;      // 不変参照
    let z = &mut x;  // コンパイルエラー: cannot borrow `x` as mutable because it is also borrowed as immutable

    println!("{}", y);
    z.push_str(", World!");
}
```

ただし「同時に」というのがミソで、参照が終わっていれば新しく作れるという仕様もあります

```Rust
fn main() {
    let mut x = String::from("Hello");

    let y = &mut x;
    y.push_str(", World!"); // y はここで使用済み

    let z = &mut x;         // 正常に動作
    z.push_str("!!");

    println!("{}", x);      // Hello, World!!!
}
```

まとめると「参照するだけならいくつでも参照できるが、記載するなら1つだけ」というのを覚えておくといいかも
