var audio = new Audio();
var currentIndex = 0;
var musicList = [];

function $(selector){
    return document.querySelector(selector);
}

//ajax
function getMusicList(callBack){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/music.json');
    xhr.send();

    xhr.addEventListener('load',function(){
        if((xhr.status >= 200 || xhr.status <= 300) || xhr.status == 304){
            callBack(JSON.parse(this.responseText));
        }else{
            console.log('获取数据失败')
            console.log('not found musicList')
        }
    })
}


getMusicList(function(list){
    loadMusic(list[currentIndex]);
    musicList = list;
});

function loadMusic(musicObj){
    audio.src = musicObj.url;
    $('.title').innerText = musicObj.title;
    $('.author').innerText = musicObj.author;
}

//music-progess;
audio.ontimeupdate = function(){
    // console.log(this.currentTime)
    $('.progress-now').style.width = (this.currentTime/this.duration) * 100 + "%"
    // var min = Math.floor(this.currentTime/60);
    // var sec = Math.floor(this.currentTime%60) + '';
    // sec = sec.length == 2 ? sec : '0' + sec;
    // $('.time').innerText = min + ':' + sec;
}
audio.onplay = function(){
     clock = setInterval(function(){
        var min = Math.floor(audio.currentTime / 60)
        var sec = Math.floor (audio.currentTime % 60) + '';
        sec = sec.length == 2 ? sec : "0" + sec;
        $('.time').innerText = min + ':' + sec;
    },1000)
}
audio.onpause = function(){
    clearInterval(clock);
}

//music-control
$('.play').onclick = function(){
   if(audio.paused){
       audio.play();
       var icon = this.querySelector('.iconfont');
       icon.classList.remove('icon-bofang')
       icon.classList.add('icon-zanting')
    }else{
       audio.pause();
       var icon = this.querySelector('.iconfont');
       icon.classList.add('icon-bofang')
       icon.classList.remove('icon-zanting')
   }
}

//forward
$('.forward').onclick = function(){
    currentIndex = (++currentIndex)%musicList.length;
    loadMusic(musicList[currentIndex]);
    audio.play();
}
//back
$('.back').onclick = function(){
    currentIndex = (musicList.length + (--currentIndex))%musicList.length;
    loadMusic(musicList[currentIndex]);
    audio.play();

}