var remainingSeconds;
var interval;
var isRunning = false;

function startTimer() {
    if (!isRunning) {
        interval = setInterval(onTick, 1000);
        isRunning = true;
    }
}

function stopTimer() {
    clearInterval(interval);
    isRunning = false;
}

function resetTimer(hours, minutes, seconds) {
    stopTimer();
    remainingSeconds = hours * 3600 + minutes * 60 + seconds;
}

function startAlarm(times) {
    for (let i = 0; i < times; i++) {
        setTimeout(beep, i * 230);
    }

    var options = {
        type: 'basic',
        iconUrl: 'pomodoro_x128.png',
        title: "Pomodoro notification",
        message: "Alarm!"
    };

    var callBack = function () { };

    chrome.notifications.create('pomodoro-timer-alarm', options, callBack);
}

function beep() {
    var snd = new Audio("js/alert.mp3");
    snd.play();
}

function onTick() {
    if (remainingSeconds > 0) {
        remainingSeconds--;
    } else {
        remainingSeconds = 0;
        stopTimer();
        startAlarm(3);
    }

    chrome.extension.sendMessage({
        eventName: "timerTick",
        seconds: remainingSeconds
    });
}

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.funcName) {
            case "startTimer":
                startTimer();
                break;
            case "stopTimer":
                stopTimer();
                break;
            case "resetTimer":
                resetTimer(request.hours, request.minutes, request.seconds);
                break;
            case "getRemainingSeconds":
                sendResponse({
                    seconds: remainingSeconds,
                    isRunning: isRunning
                });
            default:
                break;
        }
    }
);