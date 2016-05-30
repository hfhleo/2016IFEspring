## 表格组件 API
1. 在 HTML 的 head 标签下加入组件的 js 和 css 文件。
  ```JavaScript
  <link rel="stylesheet" href="tableTool.css">
  <script src="task.js"></script>
  ```
1. 在 HTML 中加入带 id 属性的 div 。
  ```JavaScript
  <div id="createTable2"></div>
  ```
1. 在 js 中调用 table 组件。
  1. 定义表头,参数为 array
    内部 object 的参数为{label:表头显示名, name:表头实际含义 sort:是否需要排序(boolean)}
    ```JavaScript
    var tableTitle = [
      {label: "姓名", name: "name" , sort: false},
      {label: "英语", name: "english", sort: true},
      {label: "数学", name: "math" , sort: true},
      {label: "语文", name: "chinese" , sort: true},
      {label: "总分", name: "sum", sort: false},
    ];
    ```
  1. 定义表格内容
    内部 object 的参数 key 需要与之前表头参数 name 一一对应
    ```JavaScript
    var tableData = {
      xiaoMing: {
        name: "明明",
        chinese: 80,
        math: 90,
        english: 70,
        sum: 240,
        },
      xiaoHong: {
        name: "红红",
        chinese: 90,
        math: 60,
        english: 90,
        sum: 240,
        }
    };
    ```
  1. 传入参数，调用表格，参数依次为: id 名(string)，表头(array)，表格内容(Object)
    ```JavaScript
    createTable('#createTable2', tableTitle, tableData);
    ```
