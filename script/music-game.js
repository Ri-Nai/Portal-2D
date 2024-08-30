const track1 = document.getElementById('track1');
const track2 = document.getElementById('track2');
const scoreDisplay = document.getElementById('score');
const judgeDisplay = document.getElementById('judge');
const comboDisplay = document.getElementById('combo');
const videoElement = document.getElementById('cry');
videoElement.src = './resources/cry.webm';
let noteSpeed = 5;
let score = 0;
let maxCombo = 0;

// 读取谱面文件
const fs = require('fs');
const noteContent = fs.readFileSync('../assets/musicGame/haruhi-kage.txt', 'utf8');
const dataArray = noteContent.split(',');
const timeStamp = [];
const trackStamp = [];
for (let i = 0; i < dataArray.length; i++) {
    const value = parseInt(dataArray[i], 10); // 将字符串转换为整数
    if (i % 2 === 0) {
        trackStamp.push(value); // 偶数索引数据放入 array1
    } else {
        timeStamp.push(value); // 奇数索引数据放入 array2
    }
}

//定时播放视频
const delayTime = 1000;
  setTimeout(() => {
    videoElement.play().catch(error => {
        console.error('播放失败:', error);
    });
}, delayTime);


//音符生成函数
function releaseNote(trackStamp) {
    const note = document.createElement('div');
    note.className = 'note';
    note.style.right = '5vw';
    if(trackStamp == 1){
        note.style.bottom = '100px';
    }else{
        note.style.bottom = '50px';
    }
    document.body.appendChild(note);
    fall(note);
}

//音符下落函数
function fall(note){
    let position = 0;
    const interval = setInterval(()=>{
        if (position >= 1000){
            clearInterval(interval);
            note.remove();
        }  else {
            position += noteSpeed;
            note.style.right = position + 'px';
        }
    },50)
}

//检测点击
document.addEventListener('keydown',(event) =>{
    const note = document.querySelector('.note');
    const line = document.querySelector('.line');
    if (note) {
        const notePosition = note.getBoundingClientRect();
        const linePosition = line.getBoundingClientRect();
        let differPosition = notePosition - linePosition.left;
        if ((event.key === 'a' && notePosition.bottom > 60 && differPosition < 10 && differPosition > -5)
         || (event.key === 'd' && notePosition.bottom < 60 && differPosition < 10 && differPosition > -5)){
            score += 100;
            scoreDisplay.textContent = '得分:' + score;
            combo += 1;
            if (combo > maxCombo){
                maxCombo = combo;
            }
            comboDisplay.textContent = 'Combo:' + combo;
            judgeDisplay.textContent = 'Perfect';
            note.remove();
        } else if ((event.key === 'a' && notePosition.bottom > 60 && differPosition < 20 && differPosition > -10)
            || (event.key === 'd' && notePosition.bottom < 60 && differPosition < 20 && differPosition > -10)){
                score += 50;
                scoreDisplay.textContent = '得分:' + score;
                combo += 1;
                if (combo > maxCombo){
                    maxCombo = combo;
                }
                comboDisplay.textContent = 'Combo:' + combo;
                judgeDisplay.textContent = 'Good';
                note.remove();
            } else if((event.key === 'a' && notePosition.bottom > 60 && differPosition < 40 && differPosition > -20)
                || (event.key === 'd' && notePosition.bottom < 60 && differPosition < 40 && differPosition > -20)){
                    score += 0;
                    scoreDisplay.textContent = '得分:' + score;
                    combo = 0;
                    comboDisplay.textContent = 'Combo:' + combo;
                    judgeDisplay.textContent = 'Bad';
                    note.remove();
                } else if((event.key === 'a' && notePosition.bottom > 60 && differPosition > 40)
                    || (event.key === 'd' && notePosition.bottom < 60 && differPosition > 40)){
                        score += 0;
                        scoreDisplay.textContent = '得分:' + score;
                        comboDisplay.textContent = 'Combo:' + combo;
                    }
    }
})

// 遍历时间戳数组
for (var i = 0; i < timeStamp.length; i++) {
    var stamptime = timeStamp[i];
    var currentTime = new Date().getTime() / 1000; // 当前时间戳(秒)
    var differTime = stamptime - currentTime; // 延迟时间(秒)
    // 如果延迟时间小于0,表示该时间戳已过去,不需要执行
    if (differTime > 0) {
            setTimeout(releaseNote, delayTime * 1000);
    }
}