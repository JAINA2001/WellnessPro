var tHours = 0;
var tMinutes = 0;
var tSeconds = 0;

$(document).ready(function () {
    initializeTimer();

    $('button[data-time-span]').each(function () {
        $(this).click(onSetTimer);
    });

    $('#restartButton').click(onResetTimer);
    $('#startButton').click(onStartTimer);
    $('#stopButton').click(onStopTimer);
});

function initializeTimer() {
    resetButtons();
    chrome.extension.sendMessage({
        funcName: "getRemainingSeconds"
    }, function (response) {
        chrome.storage.sync.get(["last-time-span"], function (items) {
            var lastTimeSpan = items["last-time-span"];

            if (lastTimeSpan) {
                $('button[data-time-span]').each(function () {
                    if ($(this).data("time-span") == lastTimeSpan) {
                        $(this).addClass('btn-danger');
                    }
                });
                setTimeSpan(lastTimeSpan);
            }

            if (response.seconds) {
                renderTimer(response.seconds);
            } else {
                onResetTimer();
            }
        });
    });
}

function resetButtons() {
    $('button[data-time-span]').each(function () {
        $(this).removeClass('btn-danger');
    });
}

function onSetTimer(e) {
    var timeSpan = $(this).data("time-span");

    chrome.storage.sync.set({
        "last-time-span": timeSpan,
    }, function () {
        //  A data saved callback
    });

    setTimeSpan(timeSpan);

    resetButtons();
    $(this).addClass('btn-danger');

    onResetTimer();
}

function setTimeSpan(timeSpan) {
    tHours = parseInt(timeSpan.split(':')[0]);
    tMinutes = parseInt(timeSpan.split(':')[1]);
    tSeconds = parseInt(timeSpan.split(':')[2]);
    renderTimer(tHours * 3600 + tMinutes * 60 + tSeconds)
}

function onStartTimer() {
    chrome.extension.sendMessage({
        funcName: "startTimer"
    });
};

function onStopTimer() {
    chrome.extension.sendMessage({
        funcName: "stopTimer"
    });
};

function onResetTimer() {
    chrome.extension.sendMessage({
        funcName: "resetTimer",
        hours: tHours,
        minutes: tMinutes,
        seconds: tSeconds
    });
    renderTimer(tHours * 3600 + tMinutes * 60 + tSeconds)
}

function renderTimer(seconds) {
    var hoursValue = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);

    var minutesValue = Math.floor(seconds / (60));
    seconds = seconds % (60);

    $('#hoursValue').text(formatTime(hoursValue));
    $('#minutesValue').text(formatTime(minutesValue));
    $('#secondsValue').text(formatTime(seconds));
};

function formatTime(intergerValue) {
    return intergerValue > 9 ? intergerValue.toString() : '0' + intergerValue.toString();
}

chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.eventName == "timerTick") {
            renderTimer(request.seconds);
        }
    }
);