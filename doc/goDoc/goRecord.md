# Relative Record

1. 数字与金钱格式相互转换

    a. **使用方式:**

    在要使用转换功能的input标签处，在其class属性中添加snail-money-covert类。例如：
    \<input type="text" class="snail-money-covert form-control" name="amount" /\>

    b. **具体逻辑：**

    - 在输入框获取焦点的时候，会将金钱格式转换为数字
    - 在输入框失去焦点的时候，会将数字转为金钱格式
    - 如果转换不成功，则还是显示输入的值，不做改变
    - 在调用datasetToForm 时，会自动将数字转换为金钱格式 写入指定的input中
    - 在调用formToDataset或者formToJson时，会自动将金钱格式转为数字，写在dataset或json中。
    - 如果在对input直接操作时，要人为调用num2Money 或者money2Num 进行转换