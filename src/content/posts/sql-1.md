---
title: "SQL学習シリーズ①：SELECT句"
date: 2026-07-21
tags: ["SQL", "学習ノート"]
---

## はじめに

SQLはやっぱりDBの基本ということでしっかり自分の中で消化するために本日から気が向いたらまとめて行きます。
今日はまずSELECT句からです。

前提としてPostgreSQLを想定しています。

## 本題

### 基本形
```sql
SELECT カラム名 FROM テーブル名;
SELECT * FROM users; -- 全カラムの取得
```

### カラムの別名(AS)
```sql
SELECT name AS 名前, age AS 年齢 FROM users;
```
ASで表示名を変える時に活用

### 重複除去(DISTINCT)
```sql
SELECT DISTINCT category FROM users;
```
部署名一覧を表示する時に重複を避けるなど

### 集約関数
```sql
SELECT COUNT(*) FROM users; -- 件数
SELECT MAX(age) FROM users; -- 最大値
SELECT MIN(age) FROM users; -- 最小値
SELECT AVG(age) FROM users; -- 平均
SELECT SUM(age) FROM users; -- 合計
```
複数行の値をまとめて1つの値にする関数

#### 注意
集約関数は単独で使うか`GROUP BY`とセットで使うのが基本
集約関数と通常のカラムを混在させる場合、`GROUP BY`していないカラムを一緒にSELECTするとエラーになる

```sql
SELECT department, MAX(salary)
FROM users
GROUP BY department;
```

### 計算式
```sql
SELECT price * quantity AS total FROM orders;
```
カラム同士の演算もSELECTの中に書ける
ゆえにテーブル設計としてカラムの計算結果等は含めないこと

### CASE式（条件分岐）
```sql
SELECT name,
  CASE
	 WHEN age >= 20 THEN '成人'
	 ELSE '未成年'
  END AS status
FROM users;
```
表示を出し分けるなら…？

### 文字列関数
```sql
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;
SELECT UPPER(name), LOWER(name) FROM users;
```
