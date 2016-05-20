## file contruction
. ├── app 
|   ├── index.html
|   ├── page
|   |   ├── header
|   |   ├── newForm
|   |   ├── formList
|   |   └── displayData
|   ├── sass
|   ├── css
|   ├── img
|   ├── controllers 
|   |   ├── page1 
|   |   |   ├── FirstCtrl.js 
|   |   |   └── SecondCtrl.js 
|   |   └── page2 
|   |   └── ThirdCtrl.js 
|   ├── directives 
|   |   ├── page1 
|   |   |   └── directive1.js 
|   |   └── page2 
|   |   ├── directive2.js 
|   |   └── directive3.js 
|   ├── filters 
|   |   ├── page1 
|   |   └── page2 
|   └── services 
|   ├── CommonService.js 
|   ├── cache 
|   |   ├── Cache1.js 
|   |   └── Cache2.js 
|   └── models 
|   ├── Model1.js 
|   └── Model2.js 
├── lib 
└── test

## 命令规划：
headerPre: 'h-';
newFormPre：‘n-’;
formListPre: 'l-';
displayData: 'd-';

## 工作流程：
HTML部分
  index.html
  formList.html
  newForm.html
  displayData.html

CSS 部分
  index.html
  formList.html
  newForm.html
  displayData.html

JS 部分

小组件（复用）
  浮框页
  日历
