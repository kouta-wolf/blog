---
title: "SQL学習シリーズ④：GROUP BY句"
date: 2026-07-30
tags: ["SQL", "学習ノート"]
---

## はじめに

`SELECT WHERE ORDER BY LIMIT`と来たら次は`GROUP BY`ですね。主にデータの集約に使われます。

## 基本構文

```sql
SELECT company, COUNT(DISTINCT name) FROM users GROUP BY company;
```

対象とするカラムにA社が5個、B社が12個みたいな状況が起きている時に合体させることができます。

## 注意事項

基本的に表示するカラムが集約されている必要があります。そのため上の場合にSELECT内にまとめられないカラムを仕込んでいるとエラーを起こします。
まとめたい場合はGROUP BYに集約関数以外のカラムも記載するようにしてください。

また`WHERE`句でも記載しましたが`GROUP BY`句は`WHERE`句の後に読むため集約系をWHEREで扱うことができません。そんな時のために`HAVING`句が存在します。

## HAVING句

やることは集約したことに対してのさらなる条件下です。

```sql
SELECT company, COUNT(DISTINCT name) FROM users GROUP BY company HAVING COUNT(name) > 2;
```

前述したとおりに`WHERE`句を考慮した上でちょっと扱うオン難しいなって時に使うものです。多少遅くなるのは否めませんので、私がまだ未勉強なパフォーマンス部分でいずれこのあたり話したりしますかね？

とりあえず今日はこんな感じで

