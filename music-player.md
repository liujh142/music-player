# 音乐播发器
原生js实现音乐播放器
### HTML结构
在写html结构时，第一时间要分析UI效果来设计html结构。  
![music-player-ui](http://m.qpic.cn/psc?/V534a6R1474JQl2rA0ky3JEBYR4VX4Yr/ruAMsa53pVQWN7FLK88i5ogt.Bm*BCA1fd1XnZPxrI47etDMzXCjY1hlg.XPoI4rHKnJ6a4cRZPU9*GArCv3KM3gdVlKXasqojdo664xVdI!/b&bo=*Ac4BAAAAAADB.U!&rf=viewer_4)

从效果图中可以得知整个页面可以分为两个部分，一个是背景图片部分覆盖整个页面;一个是音乐播放部分用来控制音乐的播放。  
```
<body>
    <div class = 'background-cover'>
    </div>
    <div class = 'music-box'></div>
</body>
```
将页面分为`background-cover`和`music-box`后，分析`music-box`结构。这个模型大致可以分为上下两个模块，一个是音乐控制面板；一个是音乐列表。
> 命名要考虑语义化，英语不好可以使用翻译软件。ps：记得好好背单词

将控制面板区域命名为`music-panel`，音乐列表区域命名为`music-list`
```
<div class = 'music-box'>
    <div class = "music-panel"></div>
    <div class = "music-list"></div>
</div>
```
继续往下分析，可以得知控制面板大致也能分为三个区域，一个区域用于控制；一个区域显示音乐的一些信息；一个为进度条。  
控制区域有三个按钮来控制快进、播放、暂停。`music-control`  
音乐信息区域分别为音乐名称，歌手等信息。`musci-info`  
进度条区就只有一条进度条和时间显示。`music-progress`  

```
<div calss = 'music-panel'>
    <div class = 'music-control'>
            <span class="back">
                <i class="iconfont icon-hanhan-01-01"></i>
            </span>
            <span class="play">
                <i class="iconfont icon-bofang"></i>
            </span>
            <span class="forward">
                <i class="iconfont icon-hanhan-01-011" ></i>
            </span>
    </div>
    <div class = 'music-info'>
            <div class="title"></div>
            <div class="author"></div>        
    </div>
    <div class = 'music-progress'>
            <div class="music-bar">
                <div class="progress-now"></div>
            </div>
            <div calss = "time">0:00</div>
    </div>
</div>
```

### css样式
###### 背景图片
背景图片覆盖全图,需要设置body的宽高为100%后，将背景图片的宽高设置为等同body。
```css
*{
    list.style = 'none';
    margin = 0;
    padding = 0;
}
body{
    /*不用设置宽度，块级元素默认撑满整个窗口*/
    height: 100vh;
}
.background-cover{
    position:absolute;
    content:'';
    display:block;
    width : 100%;
    height:100%;
    /*如果需要滤镜处理可以加上filter*/
    filter:contrast(40%)
}
```
###### music-box
这个盒子是偏上居中的；宽度确定；字体大小设置;字体颜色设置.由于页面简单使用绝对定位实现绝对居中。  
```css
.music-box{
    position:absolute;
    top:40%
    right:50%;
    transform:translate(-50%,50%);/*因为绝对定位是参照元素的右上角进行定位的，所以要减掉上右百分之50来实现绝对居中*/
    width : 340px;
    font-size : 16px;
    color: #f06d6a;     
}
```
###### music-panel、music-control、music-info、music-progress
制作完成整个`musci-panel`;
因为`control`和`musci-info`是水平排列的所以我们可以给control添加浮动，当然使用flex和gred也行但是这里用float是最简单的方式
```css
.music-panel{
    padding : 20px 20px 5px 20px;
    border:1px solid #f06d6a;
    box-shadow: 0px 2px 5px 0px  rgba(0, 0, 0, 0.1), 0px 2px 10px 0px rgba(0, 0, 0, 0.05)/*添加阴影突出立体感*/
    background-color:rgba(255,255,255,0.9);
    overflow:hidden;
}
.music-control{
    float:left;
    margin-top:20px;
    font-size:22px;
    cursor:pointer;//设置指针
}
.music-control sanp i {//设置控制图标大小
    font-size : 22px;
    margin-right:22px;
}
.music-info{
    margin-left:120px;//实现左右布局
}
.music-info .title{
    font-size:18px
}
.music-info .author{
    font-size:12px
}
//制作进度条
.music-progress{
    width:260px;//设置进度条长度
}
.musci-progress .musci-bar{
    height:3px;
    background-color: rgba(0,0,0,0.2);//
    cursor:pointer;
}
.progress-now{
    position:relative;
    background-color:#f06d6a;
    height:3px;
    width:0;//通过js来操作进度条宽度来实现进度条效果
}
.time{
    text-align:right;
}
```
###### music-list
音乐列表需要等到获取到数据再创建
```css
    .music-list li{
        position:relative;
        padding:4px 10px;
        border: 1px solid rgba(255,255,255,0.8);
        border-top : none;
        cursor:pointer;
    }
    .active{ 音乐列表被选中状态
        background-color: rgba(255,255,255,0.5);
    }
```
### 功能实现
### AJAX
### audio API
### 服务器
### 技术总结