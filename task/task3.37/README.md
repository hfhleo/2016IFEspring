//===============> 浮出组件API <===============
1. 在 html 添加组件的代码
  ```HTML
  <link rel="stylesheet" href="riseTool.css">
  <script src="task.js"></script>
  ```
1. 在html中找到需要添加浮出层的元素，设置唯一的 className，或 id
  ```
  <div class='someClassName'></div>
  ```
1. 在 js 中调用：
  ```JavaScript
  var riseObject = {
    node: '.someClassName',
    title: "这里是弹窗的标题",
    body: "这里是弹窗的内容",
    yes: "这里是弹窗的确认选项",
    no: "这里是弹窗的取消选项"
    funYes: null, //这里是点击确认后的回调函数
    funNo: null, //这里是点击取消后的回调函数
  };
  riseTool(riseObject);
  ```

