## 日历插件 API
1. 在 HTML 的 head 标签下加入组件的 js 和 css 文件。
  ```JavaScript
  <link rel="stylesheet" href="reset.css">
  <link rel="stylesheet" href="calendar.css">
  <script src="calendar.js"></script>
  ```
1. 在 HTML 中加入带 id 属性的 input，注意需要 readonly 属性。
  ```JavaScript
  <input type='text' id='calendar1' readonly>
  ```
1. 在 js 中调用 calendar 组件。
  1. 传入参数，调用日历组件。
    ```JavaScript
    document.querySelector('#calendar1').onclick = function() {
      calendarTool(元素选择器, 日期可选范围, 回调函数, 时段参数);
    };
    ```
  1. 第1个参数为 input 元素的选择器
    选择器为 string, 可以是id 或 class，但需要唯一名称，遵循 querySelector 语法, 
    例如：`#idName` 或 `.className`
  1. 第2个参数为日期可选范围，缺省值为 null。
    参数类型为 array, 内含可选范围的开始和结束两个 Date ,缺省值为 null。
    例如：
    ```JavaScript
    var chooseScope = [开始日期, 结束日期];
    var chooseScope = [new Date, new Date('2017-01-01')];
    ```
  1. 第3个参数为回调函数，缺省值为 null。
    例如：
    ```JavaScript
    var callBack = function() {
      console.log('我已回调，请主人放心。');
    };
    ```
  1. 第4个参数为时段参数，缺省值为 null。
    若时段参数设置为缺省值时，日历组件为日期单选模式，否则为时段选择模式。
    时段参数类型为 array，内包含最短时段和最长时段两个 Number。
    例如：
    ```JavaScript
    var period = [最少天数, 最多天数];
    var period = [2, 4];
    ```

## 功能简介：
1. 默认不启动，点击 input 后启动日历面板
2. 有单选日期模式和时段模式两种，通过 period 参数来选择
