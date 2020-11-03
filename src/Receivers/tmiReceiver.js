// Function to Initialize TMI and set user callbacks
var InitializeTMI = (channelName, messageCallback) => {
    // TMI Setup
    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        channels: [channelName]
    });

    client.connect();

    // If callback for message type is define, set up the call.
    if (messageCallback) {
        client.on('message', (channel, tags, message, self) => {
            messageCallback(channel, tags, message, self);
        });
    }
};