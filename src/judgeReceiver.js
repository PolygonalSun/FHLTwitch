var judgeAddr = "ws://127.0.0.1:7602"
var judgeChannel = "justaminx";  // TODO: Remember to change this.
var activeJury = [];
var seekingVerdict = false;
var votesGuilty = 0;
var votesNotGuilty = 0;

var _stringOnTrial = "";

var displayStringOnTrial = () => { };
var voteGuilty = () => { };
var voteNotGuilty = () => { };

var sentenceString = (stringOnTrial) => {
    _stringOnTrial = stringOnTrial;
    displayStringOnTrial();
};

var gatherVotes = (channel, tags, message, self) => {
    const juror = tags['display-name'];

    if (seekingVerdict && activeJury.indexOf(juror) === -1 && (message === "1" || message === "2")) {
        activeJury.push(juror);

        switch (String(message)) {
            case "1":
                votesGuilty++;
                break;
            case "2":
                votesNotGuilty++;
                break;
        }
    }
}

var handleJudgeInput = (event) => {
    console.log(event.data);
};

var startVote = () => { // TODO: Do we need timer?
    votesGuilty = 0;
    votesNotGuilty = 0;
    seekingVerdict = true;
};

var endVote = () => {
    seekingVerdict = false;
};

// TMI Setup
InitializeTMI(judgeChannel, gatherVotes);

// Websocket Setup
InitializeRelay(judgeAddr, handleJudgeInput);