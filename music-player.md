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
###### 获取数据 and 播放
音频功能基本都依赖与audio API，所以我们首先需要使用new操作符创建一个audio构造函数，同时创建索引
```javascript
var audio = new Audio();
var currentIndex = 0;
var musicList = [];//用于保存获得到的数据；
function $(selector){
    return document.querySelector(selector)
}//因为使用的是原生js，这也方便获得元素
```
因为音乐列表需要通过服务器获得，所以需要使用ajax来获得资源  
为了保证执行顺序我们需要把ajax封装成一个函数，并在参数内设定一个回调函数确保得到数据后才正常执行
```javascript
//如果不使用http协议，请求会被浏览器阻止，可以使用http-server；
function getMusicList(callBack){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/music.json','true')//不写路径代表是从页面域名路径获取
    xhr.send();
    if((xhr.status >= 200 || xhr.status <= 300) || xhr.status = 304){
        callBack(JSON.parse(xhr.responseText))
    }else{
        console.log('error: music list not found');
    }
}
getMusicList(function(list){
    loadMusic(list[currentIndex])//在获得到数据后立即执行，所以默认选择第一项。如果数据库有保存用户之前的播放记录可以将currentIndex修改为记录中的index;
    musicList = list;//将获取到的数据保存给全局变量musciList,方便以后使用.
    generrateMusic(list);//用户界面音乐列表，因为需要在加载页面完成后就展示所以放在这里调用
})
function loadMusic(musicObj){
    audio.src = musicObj[url]
    //修改dom将标题和作者名显示
    $('title').innerText = musicObj.title;
    $('author').innerText = musicObj.author;
    //显示背景图片
    $('cover').style.backgroundImage = musicObj.img;
    
    //让处于播放状态的歌曲在music元素中高亮展示;
    var li = $('.music-list').querySelectorAll('li')
    li.forEach(function(value,index){
        if(index == currentIndex){
            li[currentIndex].classList.add('active');
        }else{
            li[index].classList.remove('active')
        }
    })
}
function generrateMusicList(list){
    list.forEach(fucntion(value,index,array){
        var li = document.createEelement('li');
        li.innerText = list.title;
        $('.musicList').appendChild(li);
    })
    
}
//在歌曲播放完后自动播放下一曲
audio.onended = function(){
    currentIndex = ++currentIndex % musicList.length;
    loadMusci(musicList[currentIndex]);
    audio.play();
}
```
###### 用户交互
播放功能实现，接下是用户交互功能播放/暂停、上一曲、下一曲、进度条  
播放/暂停
```javascript
$('.play').onclick = function(){
    var icon  = this.querySelector('font-icon');
    if(audio.paused){//audio.paused保存了audio是否处于暂停状态，ture暂停/false播放
        audio.play();//如果处于暂停状态用户点击按钮的目的就是希望播放音乐。
        //这个按钮会在播放状态时显示暂停，示意点击后暂停。
        icon.classList.add('font-pause');
        icon.classlist.remove('font-play');
    }elsr{
        audio.pause();
        icon.classList.add('font-play');
        icon.classList.remove('font-pause');
    }
}
```
上一曲/下一曲  
    每次点击back index都会-1当index为0，0-1我们就会获得错误的索引，所以需要解决这个问题
    所以我们需要让`index !<0`
    同时如果currentIndex为0的情况下，用户点击back需要播放的是`musicList`中最后一曲
```javascript
$('.back').onclick = function(){
    //muscilist.length + --currentIndex这也保证了得到的数永远不会小于0;
    //假设歌曲数量为5，当前currenIndex为2自减后为1相加后等于6。再余5就会等于1;
    currentIndex = (muscilist.lenght  + --currentIndex)%musicList.length;
    loadMusic(musicList[currentIndex]);//调用loadMusic来改变audio的src;
    //改变audio.src后立即播放
    audio.play();
}
$('.forward').onclick = function(){
    currentIndex = ++currentIndex%musicList.length;
    loadMusic(music[currentIndex]);
}
```
进度条/播放时间  
进度条的功能包括：  
在播放时进度条会自动向前走;
点击进度条会跳转到歌曲的对应时间;
```javascript
//audio.ontimeupdate事件，当歌曲播放时间改变时触发
audio.ontimeupdate = function(){
    $('.progress-now').style.width = (this.currentTime / this.duration) * 100 + '%'
    //  var min = Math.floor(this.duration / 60) + '';
    //  var sec = Math.floor(this.duration % 60) + '';
    //  sec = sec.length == 2 ? sec  : '0' + sec;
    //  $('.time').innerText = min + ':'  + 'sec';
}
//audio.onplay事件，当歌曲播放时触发
audio.onplay = function(){
    //使用setInterval是因为这也动画触发效果会更平滑，可能直接写在ontimeupdata事件中
    clock = setInterval(function(){
        var min = Math.floor(this.duration / 60) + '';
        var sec = Math.floor(this.duration % 60) + '';
        sec = sec.length == 2 ? sec  : '0' + sec;
        $('.time').innerText = min + ':'  + 'sec';
    },1000)
    

    var icon = $('.play').querySelector('.iconfont');
    icon.classList.remove('icon-bofang')
    icon.classList.add('icon-zanting')
}
//audio.pause 当歌曲暂停时触发
audio.onpause = function(){
    clearInterval(clock);
}
//点击进度条跳转到对应的时间
$('.progress').oncilck = function(e){
    //事件函数的e参数内部会保存事件触发时的一些状态，其中offsetX保存着点击位置
    var percent = e.offsetX / parseInt(getComputedStyle(this).width);
    audio.currentTime = audio.duration * percent;
    audio.play;
}
```
###### 点击音乐列表播放对应歌曲
```javascript
因为元素musicList下面的li元素是在通过修改dom来创建的，所以我们需要使用事件代理
$('musiclist').addEventLisener('click',function(e){
    var liList = this.querySelectorAll('li');
    liList.forEach(function(value,index){
        if(value = e.target){
            currentIndex = index;
            loadMusic(musicList[currentIndex]);
            audio.play;
        }
    })
})
```
### audio/video API
##### audio方法
###### addTextTrack()
向音频/视频添加新的文本轨道
###### canPlayType()
检测浏览器是否能播放指定的音频/视频类型
###### load()
重新加载音频/视频元素
###### play()
开始播放音频/视频
###### pause()
暂停当前播放的音频/视频
##### HTML5 Audio/Video 属性
- currentSrc    返回当前音频/视频的 URL
- currentTime   设置或返回音频/视频中的当前播放位置（以秒计）
- defaultMuted  设置或返回音频/视频默认是否静音
- defaultPlaybackRate   设置或返回音频/视频的默认播放速度
- duration  返回当前音频/视频的长度（以秒计）
- ended 返回音频/视频的播放是否已结束
- error 返回表示音频/视频错误状态的 MediaError 对象
- loop  设置或返回音频/视频是否应在结束时重新播放
- src   设置或返回音频/视频元素的当前来源
- volume    设置或返回音频/视频的音量

#### audio事件
- abort 当音频/视频的加载已放弃时
- canplay   当浏览器可以播放音频/视频时
- canplaythrough    当浏览器可在不因缓冲而停顿的情况下进行播放时
- durationchange    当音频/视频的时长已更改时
- emptied   当目前的播放列表为空时
- ended 当目前的播放列表已结束时
- error 	当在音频/视频加载期间发生错误时
- loadeddata    当浏览器已加载音频/视频的当前帧时
- loadedmetadata    当浏览器已加载音频/视频的元数据时
- loadstart     当浏览器开始查找音频/视频时
- play      当音频/视频已开始或不再暂停时
- playing   当音频/视频在已因缓冲而暂停或停止后已就绪时
- progress  当浏览器正在下载音频/视频时
- ratechange    当音频/视频的播放速度已更改时
- seeked    当用户已移动/跳跃到音频/视频中的新位置时
- seeking   	当用户开始移动/跳跃到音频/视频中的新位置时
- stalled       当浏览器尝试获取媒体数据，但数据不可用时
- volumechange  当音量已更改时

### 技术总结
1. 在写html结构时先分析ui
2. ajax获取资源如果不使用http协议会被浏览器拦截
3. 音频文件放在本地可能会导致无法调整`currentTime`，设置完成后归零
4. 在需要进行列表循环时要分析索引，`++currentIndex%musicList.length`
5. 如果页面没有设置favicon，浏览器会默认请求这个资源。所以最好是设置favicon