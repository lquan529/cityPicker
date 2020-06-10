# cityPicker
cityPicker主要是用于PC的城市下拉选择插件，有selector和select两种应用场景模式。

## 版本
- 2.0.4

## 功能支持
- 支持联动
- 支持搜索功能
- 支持键盘选择功能
- 支持四级城市

## 浏览器支持
- Internet Explorer 7+
- Chrome for PC
- Safari for PC
- Firefox for  PC

## 参数
| 名称 | 类型 | 默认 | 描述 |
| --------   | -----:  | :----:  | :----:  |
| dataJson | Aarray | [] | 城市json数据 |
| selectpattern | Aarray | [{field:"userProvinceId",placeholder:"请选择省份"},{field:"userCityId",placeholder:"请选择城市"},{field:"userDistrictId",placeholder:"请选择区县"}] | 用于存储的字段名和默认提示 |
| shorthand | Boolean | flase | 城市名称简写功能 |
| storage | Boolean | true | 存储的值是数字还是中文 |
| autoSelected | Boolean | true | 是否自动选择第一项 |
| renderMode | Boolean | true | 是模拟的还是原生的 |
| keyboard | Boolean | false | 是否开启键盘操作事件 |
| code | Boolean | false | 是否输出城市区号值, 开启就是您要传字段名('name') |
| search | Boolean | true | 只在模式是selector才生效, 是否开启搜索功能 |
| level | Number | 3 | 多少列  默认是一列/级 (3) |
| onInitialized | Attachable | function(){} | 组件初始化后触发的回调函数 |
| onClickBefore | Attachable | function(){} | 组件点击显示列表触发的回调函数(除原生select) |
| onForbid | Attachable | function(){} | 存在class名forbid的只读点击的回调(状态为readonly) |
| onChoiceEnd | Attachable | function(){} | 选择结束后执行的回调

## 使用方法
#### 引入相关文件：
```html
<link rel="stylesheet" type="text/css" href="css/city-picker.css">
<script src="https://cdn.bootcss.com/jquery/1.8.1/jquery.js"></script>
<script type="text/javascript" src="js/citydata.js"></script>
<script type="text/javascript" src="js/cityPicker-2.0.4.js"></script>
```

#### HTML
> Dom的级列表都是用js动态生成，页面写Dom的时候只要一个class或者ID来调用插件就可以了
```html
<div class="city-picker-selector" id="city-picker-selector">
    <div class="selector-item storey province">
        <a href="javascript:;" class="selector-name reveal">北京市</a>
        <input type="hidden" name="userProvinceId" class="input-price val-error" value="110000" data-required="userProvinceId">
        <div class="selector-list listing hide">
            <ul>
                <li>北京市</li>
                <li>天津市</li>
                <li>河北省</li>
                <li>山西省</li>
            </ul>
        </div>
    </div>
    <div class="selector-item storey city">
        <a href="javascript:;" class="selector-name reveal">北京市</a>
        <input type="hidden" name="userCityId" class="input-price val-error" value="110100" data-required="userCityId">
        <div class="selector-list listing hide">
            <ul>
                <li>北京市</li>
            </ul>
        </div>
    </div>
    <div class="selector-item storey district">
        <a href="javascript:;" class="selector-name reveal">海淀区</a>
        <input type="hidden" name="userDistrictId" class="input-price val-error" value="110108" data-required="userDistrictId">
        <div class="selector-list listing hide">
            <ul>
                <li>东城区</li>
                <li>西城区</li>
            </ul>
        </div>
    </div>
</div>
```

#### JavaScript
模拟城市-无联动/无搜索/键盘操作
```js
var selector = $('#city-picker-selector').cityPicker({
    dataJson: cityData,
    renderMode: true,
    search: false,
    autoSelected: false,
    keyboard: true
});
```

模拟城市-联动/搜索
```js
$('#city-picker-search').cityPicker({
    dataJson: cityData,
    renderMode: true,
    search: true,
    autoSelected: true
});
```

原生城市-无联动
```js
var select = $('.city-picker-select').cityPicker({
    dataJson: cityData,
    renderMode: false,
    autoSelected: false
});
```

## 事件
cityPick不同级列表选择后的监听事件。choose-xxx监听xxx不同列表的name
```js
// 省份选择的回调
$('#city-picker-selector').on('choose-province.citypicker', function(event, tagert, values) {
    console.log(values);
});

// 城市选择的回调
$('#city-picker-selector').on('choose-city.citypicker', function(event, tagert, values) {
    console.log(values);
});

// 区县选择的回调
$('#city-picker-selector').on('choose-district.citypicker', function(event, tagert, values) {
    console.log(values);
});

// 街道选择的回调
$('#city-picker-selector').on('choose-street.citypicker', function(event, tagert, values) {
    console.log(values);
});
```

## 方法
setCityVal(val)

| 参数 | 类型 | 描述 |
| --------   | -----:  | :----:  |
| val | Array | 默认赋值显示的城市数据 |

```js
var selector = $('#city-picker-selector').cityPicker();
    // 用name设置
    selector.setCityVal('广东省, 广州市, 天河区');
    // 用ID设置
    selector.setCityVal('440000, 440100, 440106');
```

### 获取值
getCityVal()

### 状态
changeStatus(status)

| 参数 | 类型 | 描述 |
| --------   | -----:  | :----:  |
| status | String | 参数disabled、current |

`注意：原生select是没有readonly的，如果设置这个是不起作用`

### 绑定
bindEvent()

### 销毁
unBindEvent()

## Demo
[https://lquan529.github.io/cityPicker/](https://lquan529.github.io/cityPicker/)

## Log
- 2020.6.10 —— 版本更新为: v2.0.4  
修复setCityVal城市是天津这些一二级城市名字重复出错问题，  
更新中山市城市数据缺失问题

- 2018.8.1 —— 版本更新为: v2.0.3  
修复设置参数storage为false的时候，还是存储数字的问题

- 2018.4.15 —— 版本更新为: v2.0.2  
增加setCityVal设置城市报错的问题

- 2018.4.6 —— 版本更新为: v2.0.1  
修复shorthand参数设置为简写的时候，四级城市报错问题  
增加setCityVal接口设置城市可以支持Id和Name设置两种方式设置默认城市

- 2018.2.26 —— 版本更新为: v2.0.0  
增加四级(街道)城市联动，插件代码逻辑优化以适应扩展到四级  
注意：第四级街道数据是用getJson的方式去获取的，不加在原来的数据源上

- 2018.1.31 —— 版本更新为: v1.1.9  
样式优化，组件的一些逻辑调整

- 2018.1.19 —— 版本更新为: v1.1.8  
修复setCityVal()在jquery 1.10.0版本以下城市显示正常的，而1.11.0版本以上显示是反向的问题  
重新优化了getCityVal()选择后取值还是原来旧的值得问题  
增加一个新的回调onChoiceEnd，作用是城市选择后，再执行的回调函数

- 2018.1.17 —— 版本更新为: v1.1.7  
修复setCityVal()设置城市参数反过来的问题

- 2018.1.5 —— 版本更新为: v1.1.6 
修复了getCityVal()，获取的值还是上次的问题  
重新优化了setCityVal()，让设置默认值变得简单

- 2017.11.14 —— 版本更新为: v1.1.5  
增加城市数据压缩版本  
修复搜索时不选择按下回车键报错问题

- 2017.9.12 —— 版本更新为: v1.1.4  
增加getCityVal 获取值的接口


- 2017.8.23 —— 版本更新为: v1.1.3  
修复storage为false的时候，选择和设置默认值的时候显示出错的问题


- 2017.8.04 —— 版本更新为: v1.1.2  
增加绑定事件bindEvent、销毁事件unBindEvent和只读禁止接口changeStatus；  
修复了点击选择后，没有添加选中样式的问题；  
增加显示列表的动画；  
优化了一些逻辑代码，选择的回调返回的参数storage更名为values, 用数组的方式返回ID和名称

- 2017.07.11 —— 版本更新为: v1.1.1  
增加支持键盘选择事件以及控制键盘事件是否开启的参数  
修复在IE低版本点击不了的报错问题