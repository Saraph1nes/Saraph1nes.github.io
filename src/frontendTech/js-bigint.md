# BigInt

## 安全整数

- **`Number.MAX_SAFE_INTEGER`** 9007199254740991，即 `2^53 - 1` -
- **`Number.MIN_SAFE_INTEGER`** -9007199254740991

这个范围内的值可以执行安全运算，因此称为”安全整数“。

> JavaScript 使用 IEEE 754 双精度浮点数（64 位）来表示所有数字。在这种表示法中，有 53 位用于表示整数部分，因此最大的安全整数是 2^53 - 1。

## 最大的数

`Number.MAX_VALUE` （约为 1.798e+308）是 JavaScript 中最大的浮点数值。这个值受到 IEEE 754 双精度浮点数的实现限制，该标准定义了数字的最大上限。如果一个数大于 `Number.MAX_VALUE`，它将被表示为 `Infinity`。

## BigInt

BigInt 是一种内置对象，它提供了一种方法来表示大于 `2^53 - 1` 的整数, 它可以表示任意大的数值。

```javascript
// 声明方式
9007199254740991n;
BigInt(9007199254740991);
BigInt('9007199254740991');
BigInt('0x1fffffffffffff');
BigInt('0b11111111111111111111111111111111111111111111111111111');
new BigInt(1); // TypeError: B BigInt is not a constructor

// 当使用 BigInt 时，带小数的运算会被取整
5n / 2n; // 2n
BigInt(Number.MAX_SAFE_INTEGER) + 1n; // 9007199254740992n

// 可以与普通 number 比较 但是不能运算
1n + 1; // TypeError: Cannot mix BigInt and other types,
+1n; // TypeError: Cannot convert a BigInt value to a number
0n === 0; // false
0n == 0; // true
1n < 2; // true

typeof 1n === 'bigint'; // true
Boolean(0n); // false
Boolean(12n); // true
Number(1n); // 1
parseInt(1n); // 1
Object(1n); // BigInt {1n}
typeof Object(1n); // object
```

