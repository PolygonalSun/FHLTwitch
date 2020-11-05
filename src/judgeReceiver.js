var judgeAddr = "ws://127.0.0.1:7602"
var judgeChannel;
var activeJury = [];
var seekingVerdict = false;
var votesGuilty = 0;
var votesNotGuilty = 0;
var timeLeft;
var timer;

var totalGuilty = 0;
var totalNotGuilty = 0;

var _offender = "";
var _stringOnTrial = "";

/**
 * Callback for doing something when string is put on trial
 */
var displayStringOnTrial = () => { };
/**
 * Callback for doing something when found guilty
 */
var sentenceGuilty = () => { };
/**
 * Callback for doing something when found not guilty
 */
var sentenceNotGuilty = () => { };
/**
 *
 * Callback for doing something when the vote tally changes
 */
var onVotesChanged = () => { };

/**
 * Set user and string data, then use callback
 * @param offender User who created string
 * @param stringOnTrial the string body
 */
var sentenceString = (offender, stringOnTrial) => {
    _offender = offender;
    _stringOnTrial = stringOnTrial;
    displayStringOnTrial();
};

/**
 * Gather votes when seeking a verdict
 * @param channel Twitch channel
 * @param tags metadata from messages
 * @param message message body
 * @param self the user of this script, usually the channel owner
 */
var gatherVotes = (channel, tags, message, self) => {
    const juror = tags['display-name'];

    if (seekingVerdict && activeJury.indexOf(juror) === -1 && (message === "1" || message === "2")) {
        activeJury.push(juror);

        switch (String(message)) {
            case "1":
                console.log(juror + " votes Guilty");
                votesGuilty++;
                break;
            case "2":
                console.log(juror + " votes Not Guilty");
                votesNotGuilty++;
                break;
        }
        onVotesChanged();
    }
}

/**
 * Take sender data and perform specific sentencing actions
 * @param event Websocket data from sender
 */
var handleJudgeInput = (event) => {
    const judgeData = JSON.parse(event.data);

    if (judgeData.Type === "setjudge") {
        judgeChannel = judgeData.Username;
        console.log("Set judge to " + judgeChannel);
        InitializeTMI(judgeChannel, gatherVotes);
        onVotesChanged(); // Call to reset to initial numbers
    }
    if (judgeChannel && judgeData.Type === "vote") {
        if (judgeData.StatusOfVote) {
            startVote(judgeData.Timeout);
        }
        else {
            endVote();
        }
    }
    else if (judgeChannel && !seekingVerdict && judgeData.Type === "joke") {
        sentenceString(judgeData.Name, judgeData.Joke);
    }
    else if (judgeChannel && judgeData.Type === "verdict" && _stringOnTrial.length > 0) {
        if (judgeData.Verdict) {
            totalGuilty++;
            sentenceGuilty();
        }
        else {
            totalNotGuilty++;
            sentenceNotGuilty();
        }
    }
};

/**
 * Start the voting process
 * @param timeoutInSeconds How long to wait (in seconds) before stopping a vote
 */
var startVote = (timeoutInSeconds) => {
    votesGuilty = 0;
    votesNotGuilty = 0;
    seekingVerdict = true;
    onVotesChanged();
    timeLeft = timeoutInSeconds;
    timer = setInterval(() => {
        if (--timeLeft === 0) {
            clearInterval(timer);
        }
    }, 1000);
};

/**
 * End the voting process
 */
var endVote = () => {
    // If vote ended prematurely, cancel the timer
    if (timer) {
        clearInterval(timer);
    }

    seekingVerdict = false;
    activeJury = [];
    timeLeft = 0;
};

// Websocket Setup
InitializeRelay(judgeAddr, handleJudgeInput);