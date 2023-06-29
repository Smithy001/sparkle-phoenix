/*
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


function getArgument(argName, defaultValue) {
    if (defaultValue === undefined) {
        defaultValue = null;
    }

    // Get the command line arguments
    const args = process.argv.slice(2);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
  
      if (arg.startsWith('-')) {
        if (arg.startsWith('--')) {
          if (arg.slice(2) === argName) {
            return true; // Flag found
          }
        } else {
          const nextArg = args[i + 1];
          if (arg.slice(1) === argName) {
            if (nextArg && !nextArg.startsWith('-')) {
              return nextArg; // Parameter found
            } else {
              return true; // Flag found
            }
          }
          if (nextArg && nextArg.startsWith('-')) {
            return null; // Argument not set
          }
          i++; // Skip the next argument as it has been processed
        }
      }
    }
  
    return defaultValue; // Argument not found
}

*/

/*
function getArgument(argName, defaultValue) {
    if (defaultValue === undefined) {
        defaultValue = null;
    }

    console.log(defaultValue);

    // Get the command line arguments
    const args = process.argv.slice(2);

    let foundFlag = false;
    let paramValue = defaultValue;
  
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
  
      if (arg.startsWith('-')) {
        if (arg.startsWith('--')) {
          if (arg.slice(2) === argName) {
            foundFlag = true; // Flag found
          }
        } else {
          const nextArg = args[i + 1];
          if (arg.slice(1) === argName) {
            if (nextArg && !nextArg.startsWith('-')) {
              paramValue = nextArg; // Parameter found
            } else {
              foundFlag = true; // Flag found
            }
          }
          if (nextArg && nextArg.startsWith('-')) {
            break; // Stop searching if the next argument is a new flag
          }
          i++; // Skip the next argument as it has been processed
        }
      }
    }
  
    return paramValue !== defaultValue ? paramValue : foundFlag;
}
*/

function getArgument(argName, defaultValue) {
    if (defaultValue === undefined) {
        defaultValue = null;
    }

    // Get the command line arguments
    const args = process.argv.slice(2);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith('-')) {
        const nextArg = args[i + 1];
        if (arg.slice(1) === argName) {
            if (nextArg && !nextArg.startsWith('-')) {
                return nextArg; // Parameter found
            } else {
                return true; // Flag found
            }
        }
      }
    }
  
    return defaultValue;
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