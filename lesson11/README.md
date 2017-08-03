## this 指向
### 1. 有对象就指向调用对象

```javascript
var myObject = {value: 100};
myObject.getValue = function(){
  console.log(this.value) // 100
  console.log(this) // {value: 100, getValue: [Function]} 其实就是myObject本身
  return this.value;
};
console.log(myObject.getValue()); // 100
```

### 2. 没调用对象就指向全局对象

```javascript
var myObject = {value: 100};
myObject.getValue = function(){
  var foo = function(){
    console.log(this.value); // undefined
    console.log(this); // 浏览器下输出window，NodeJS端输出global
  };
  foo();
  return this.value;
}
console.log(myObject.getValue()); // 100
```

### 3. 用`new`构造就指向新对象

```javascript
var SomeClass = function(){
  this.value = 100;
}
var myCreate = new SomeClass();
console.log(myCreate.value); // 100
```

### 4. 通过`apply`或`call`或`bind`来改变`this`的指向

```javascript
var myObject = {value: 100};
var foo = function(){
  console.log(this);
};
foo(); // 浏览器下输出window，NodeJS端输出global
foo.apply(myObject); // {value: 100}
foo.call(myObject); // {value: 100}

var newFoo = foo.bind(myObject);
newFoo(); // {value: 100}
```

