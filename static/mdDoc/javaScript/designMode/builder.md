# 建造者模式

建造者模式（Builder）：将一个复杂对象的构建层和展示层相互分离。同样的构建过程可采用不同的的表示。

建造者模式和工厂模式都可以输出对象。但是工厂模式主要是为了创建对象实例或者类簇（抽象工厂），关心的是最终产出的是什么，而不关心创建的过程。
而建造者模式则是关心创建的过程，其实建造者模式是将复杂的类，将其划分为各个小类，再通过建造者将其合成大类。

```javaScript
//人类
let Human = function(param){
    //技能
    this.skill = param && param.skill || "保密";
    //兴趣爱好
    this.hobby = param && param.hobby || "保密";
}

Human.prototype = {
    getSkill:function(){
        return this.skill;
    },
    getHobby(){
        return this.hobby;
    }
}

let Name = function(name){
    (function(name,ctx){
        ctx.wholeName = name;
        let index = name.indexOf(" ");
        if(index!==-1){
            ctx.firstName = name.slice(0,index);
            ctx.lastName = name.slice(index);
        }
    })(name,this)
}

let Work = function(work){
    (function(work,ctx){
        switch(work){
            case 'code' :
                ctx.work = "工程师";
                ctx.workDescript = "醉心于编程";
                break;
            case 'UI':
            case "UE" :
                ctx.work = "设计师";
                ctx.workDescript = "设计更是一种艺术";
                break;
            case "teach":
                ctx.work = "教师";
                ctx.workDescript = "分享也是种快乐";
                break;
            default :
                ctx.work = work;
                ctx.workDescript = "未清楚您工作的描述";
        }
    })(work,this)
}

Work.prototype = {
    changWork:function(work){
        this.work = work;
    },
    changeDescript:function(descript){
        this.workDescript = descript
    }
}

/**
*应聘者建造者
**/
let Person = function(name,work){
    let _person = new Human();
    _person.name = new Name(name);
    _person.work = new Work(work);
    return _person
}

let person = new Person("jack Davi","code");
console.log(person.getSkill());
console.log(person.name.lastName);
console.log(person.work.workDescript);

```

建造者模式对于整体对象类的拆分无形中增加了结构的复杂性，如果对象粒度小，或者模块间复用率比较低，不建议使用建造者模式。