class MusicGameView extends View {
    constructor() {
        super();
        this.track1 = document.getElementById('track1');
        this.track2 = document.getElementById('track2');
        this.scoreDisplay = document.getElementById('score');
        this.judgeDisplay = document.getElementById('judge');
        this.comboDisplay = document.getElementById('combo');

        this.videoElement = document.getElementById('cry');
        this.videoSrc = './resources/cry.webm';

        this.noteSpeed = 5;
        this.score = 0;
        this.maxCombo = 0;

        document.addEventListener('keydown', this.onKeyDown);

        this.loaded = false;
        this.init();
    }

    async init() {
        const noteContent = await window.$game.dataManager.loadJSON('../assets/musicGame/haruhi-kage.txt', 'utf8');
        const dataArray = noteContent;

        this.timestamp = [];
        this.trackStamp = [];

        dataArray.forEach((value) => {
            trackStamp.push(value.track);
            timeStamp.push(value.timestamp);
        });

        this.loaded = true;

        this.videoElement.src = this.videoSrc;

        //定时播放视频
        const delayTime = 1000;
        setTimeout(() => {
            videoElement.play().catch(error => {
                console.error('播放失败:', error);
            });
        }, delayTime);
    }

//检测点击
document.addEventListener('keydown',(event) =>{
    const note = document.querySelector('.note');
    const line = document.querySelector('.line');
    if (note) {
        const notePosition = note.getBoundingClientRect();
        const linePosition = line.getBoundingClientRect();
        let differPosition = notePosition.left - linePosition.left;
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
    //检测点击
    onKeyDown(event) {
        const note = document.querySelector('.note');
        const line = document.querySelector('.line');
        if (note) {
            const notePosition = note.getBoundingClientRect();
            const linePosition = line.getBoundingClientRect();
            let differPosition = notePosition - linePosition.left;
            if ((event.key === 'a' && notePosition.bottom > 60 && differPosition < 10 && differPosition > -5)
                || (event.key === 'd' && notePosition.bottom < 60 && differPosition < 10 && differPosition > -5)) {
                score += 100;
                scoreDisplay.textContent = '得分:' + score;
                combo += 1;
                if (combo > maxCombo) {
                    maxCombo = combo;
                }
                comboDisplay.textContent = 'Combo:' + combo;
                judgeDisplay.textContent = 'Perfect';
                note.remove();
            } else if ((event.key === 'a' && notePosition.bottom > 60 && differPosition < 20 && differPosition > -10)
                || (event.key === 'd' && notePosition.bottom < 60 && differPosition < 20 && differPosition > -10)) {
                score += 50;
                scoreDisplay.textContent = '得分:' + score;
                combo += 1;
                if (combo > maxCombo) {
                    maxCombo = combo;
                }
                comboDisplay.textContent = 'Combo:' + combo;
                judgeDisplay.textContent = 'Good';
                note.remove();
            } else if ((event.key === 'a' && notePosition.bottom > 60 && differPosition < 40 && differPosition > -20)
                || (event.key === 'd' && notePosition.bottom < 60 && differPosition < 40 && differPosition > -20)) {
                score += 0;
                scoreDisplay.textContent = '得分:' + score;
                combo = 0;
                comboDisplay.textContent = 'Combo:' + combo;
                judgeDisplay.textContent = 'Bad';
                note.remove();
            } else if ((event.key === 'a' && notePosition.bottom > 60 && differPosition > 40)
                || (event.key === 'd' && notePosition.bottom < 60 && differPosition > 40)) {
                score += 0;
                scoreDisplay.textContent = '得分:' + score;
                comboDisplay.textContent = 'Combo:' + combo;
            }
        }
    };

    compute(t) {
        this.timestamp.forEach((stamptime) => {
            var currentTime = t.timestamp; // 当前时间戳(秒)
            var differTime = stamptime - currentTime; // 延迟时间(秒)
            // 如果延迟时间小于0,表示该时间戳已过去,不需要执行
            if (differTime > 0) {
                setTimeout(releaseNote(trackStamp[i]), delayTime * 1000);
            }
        })
    }

    //音符生成函数
    releaseNote(trackStamp) {
        const note = document.createElement('div');
        note.className = 'note';
        note.style.right = '5vw';
        if (trackStamp == 1) {
            note.style.bottom = '100px';
        } else {
            note.style.bottom = '50px';
        }
        document.body.appendChild(note);
        fall(note);
    }

    //音符下落函数
    fall(note) {
        let position = 0;
        const interval = setInterval(() => {
            if (position >= 1000) {
                clearInterval(interval);
                note.remove();
            } else {
                position += noteSpeed;
                note.style.right = position + 'px';
            }
        }, 50);
    }
}
