var myObject = { value: 100 };
var foo = function() {
    console.log(this);
};
foo(); // 浏览器下输出window，NodeJS端输出global
foo.apply(myObject); // {value: 100}
foo.call(myObject); // {value: 100}

var newFoo = foo.bind(myObject);
newFoo(); // {value: 100}