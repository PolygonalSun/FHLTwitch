var judgeSocket = new WebSocket("ws://127.0.0.1:7602");
var activeJury = [];
var seekingVerdict = false;
var votesGuilty = 0;
var votesNotGuilty = 0;

var _stringOnTrial = "";

var displayStringOnTrial = () => {};
var subscribeFunction = () => {};
var cheerFunction = () => {};
var voteGuilty = () => {};
var voteNotGuilty = () => {};

var sentenceString = (stringOnTrial) => {
    _stringOnTrial = stringOnTrial;
    displayStringOnTrial();
};

var startVote = () => { // TODO: Do we need timer?
    votesGuilty = 0;
    votesNotGuilty = 0;
    seekingVerdict = true;
};

var endVote = () => {
    seekingVerdict = false;
};

var init = (channelName) => {
    // TMI Setup
    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        channels: [ channelName ]
    });
    
    client.connect();
    
    client.on('message', (channel, tags, message, self) => {
        // "Alca: Hello, World!"
        //console.log(`${tags['display-name']}: ${message}`);
        const juror = tags['display-name'];

        if (seekingVerdict && activeJury.indexOf(juror) === -1 &&(message === "1" || message === "2")) {
            activeJury.push(juror);

            switch(String(message)) {
                case "1":
                    voteGuilty++;
                    break;
                case "2":
                    voteNotGuilty++;
                    break;
            }
        }
        
    });

    // Websocket Setup
    judgeSocket.addEventListener("message", (event) => {
        console.log(event.data);
    });
};

init("polygonalsun");