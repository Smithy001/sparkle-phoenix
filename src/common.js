function getArgument(name) {
    // Get the command line arguments
    const args = process.argv.slice(2);

    // Parse the arguments
    const options = {};

    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];

        options[key] = value;
    }

    // Access the value for a specific argument
    return options['-'+name];
}

function getPlayerCount() {
    var playerCount = getArgument('players');
    if (!playerCount) {
        playerCount = 2;
    }
    return playerCount;
}

// Export the functions
module.exports = {
    getArgument: getArgument,
    getPlayerCount: getPlayerCount
};