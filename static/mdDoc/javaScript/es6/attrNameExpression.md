
# 属性名表达式

1. 标识符作为属性名

```javascript

    obj.foo = true;

```
2. 表达式作为属性名

```javascript

    obj['a'+'b'] = true;
    //相当于
    obj['ab'] = tue;
    
```
3. ES6 允许字面量定义对象时，用表达式作为对象的属性名，即把表达式放在方括号内。

```javascript

    let key = 'foo';
    
    let obj = {
        [key]:true,
        ['a'+'b']:123
    }

```
    
4. 表达式定义方法名

```javascript

    let obj = {
        ['say'+'Something'](){
            return 'Hello snail'
        }
        
    }
   
```
     
注意，属性名表达式与简洁表示法，不能同时使用，否则会报错。

```javascript

    //wrong
    let foo = 'abc';
    let o = {[foo]};
    
    //correct
    let foo = 'abc';
    let o = {[foo]:foo}
    
```
    
注意，属性名表达式如果是一个对象，默认情况下会自动将对象转换为字符串\[object object\],这点要特别注意

```javascript

    let user = {name:'jack',age:18};
    
    let o = {[user]:"tom"}
    
    console.log(o) // {[object object]:'tom'}
    
```
    