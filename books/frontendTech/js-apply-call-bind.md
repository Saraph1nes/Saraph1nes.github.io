# apply、call、bind

## apply

`apply`是JavaScript函数对象的一个方法，它允许你在调用函数时将一个数组或类数组对象作为参数传递进去。语法如下：

```javascript
function.apply(thisArg, [argsArray])
```

- `thisArg`: 在函数执行时指定的 `this` 值。
- `argsArray`: 一个数组或者类数组对象，其中的元素将作为参数传递给函数。

##  call

`call`与`apply`类似，也是用于调用函数，但是参数的传递方式略有不同。语法如下：

```javascript
function.call(thisArg, arg1, arg2, ...)
```

- `thisArg`: 在函数执行时指定的 `this` 值。
- `arg1, arg2, ...`: 传递给函数的参数列表。

## bind

`bind`方法会创建一个新函数，称为绑定函数。当调用这个绑定函数时，绑定函数会以创建它时传入`bind`方法的第一个参数作为`this`值，后续的参数将作为实际参数传递给原函数。`bind`并不会立即执行，而是返回一个绑定了指定`this`的新函数。语法如下：

```javascript
function.bind(thisArg, arg1, arg2, ...)
```

- `thisArg`: 在函数执行时指定的 `this` 值。
- `arg1, arg2, ...`: 传递给函数的参数列表。

## 区别

- `apply`和`call`的区别仅在于参数的传递方式，一个是数组，一个是逐个传递。
- `bind`方法会创建一个新函数，并永久绑定指定的`this`值，而`apply`和`call`则是立即调用原函数。

| 方法  | 语法                                      | 参数传递方式         | 立即执行 | 返回新函数     |
| ----- | ----------------------------------------- | -------------------- | -------- | -------------- |
| apply | `function.apply(thisArg, argsArray)`      | 数组或类数组对象     | 是       | 否             |
| call  | `function.call(thisArg, arg1, arg2, ...)` | 逐个传递             | 是       | 否             |
| bind  | `function.bind(thisArg, arg1, arg2, ...)` | 逐个传递（延迟执行） | 否       | 是，返回新函数 |

## 举例说明

#### 使用apply

```javascript
function greet(name) {
  console.log(`Hello, ${name}! I am ${this.title}`);
}

const context = { title: 'ChatGPT' };
const args = ['User'];

greet.apply(context, args);
```

#### 使用call

```javascript
function greet(name) {
  console.log(`Hello, ${name}! I am ${this.title}`);
}

const context = { title: 'ChatGPT' };

greet.call(context, 'User');
```

#### 使用bind

```javascript
function greet(name) {
  console.log(`Hello, ${name}! I am ${this.title}`);
}

const context = { title: 'ChatGPT' };
const boundGreet = greet.bind(context);

boundGreet('User');
```

