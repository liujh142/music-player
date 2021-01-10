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
    generateMusicList(list);
});
function generateMusicList(list){
    var ul = $('.music-list');
    list.forEach(function(value,index,array){
        var li = document.createElement('li');
        var text = document.createTextNode(value.title);
        li.appendChild(text);
        ul.appendChild(li);
    })
}

function loadMusic(musicObj){
    audio.src = 'http\:\/\/music\.163\.com\/song\/media\/outer\/url\?id\=' + musicObj.url;
    $('.title').innerText = musicObj.title;
    $('.author').innerText = musicObj.author;
    $('.cover').style.backgroundImage = 'url(' + musicObj.background + ')'

}
audio.onended = function(){
    currentIndex = (++currentIndex)%musicList.length;
    loadMusic(musicList[currentIndex]);
    audio.play();
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
    },1000);

    var li = $('.music-list').querySelectorAll('li')
    li.forEach(function(value,index){
        if(index == currentIndex){
            li[currentIndex].classList.add('active');
        }else{
            li[index].classList.remove('active')
        }
    })

    var icon = $('.play').querySelector('.iconfont');
    icon.classList.remove('icon-bofang')
    icon.classList.add('icon-zanting')

}
audio.onpause = function(){
    clearInterval(clock);

    var icon = $('.play').querySelector('.iconfont');
    icon.classList.add('icon-bofang')
    icon.classList.remove('icon-zanting')
}
$('.music-bar').onclick = function(e){
    console.log(e)
    var percent = e.offsetX / parseInt(getComputedStyle(this).width);
    audio.currentTime = audio.duration * percent;
    audio.play();
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
    audio.play()
}
//back
$('.back').onclick = function(){
    currentIndex = (musicList.length + (--currentIndex))%musicList.length;
    loadMusic(musicList[currentIndex]);
    audio.play();
}
//music-list
$('.music-list').addEventListener('click',function(e){
    var liList =  this.querySelectorAll('li');
    liList.forEach(function(value,index){

        if(value == e.target){
            currentIndex = index;
            loadMusic(musicList[currentIndex]);
            audio.play();
        }
    })
})