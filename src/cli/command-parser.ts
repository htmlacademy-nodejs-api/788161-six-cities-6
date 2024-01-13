type ParsedCommand = Record<string, string[]>;

export class CommandParser {
  static parse(cliArguments: string[]): ParsedCommand {
    const parsedCommand: ParsedCommand = {};
    let currentCommand = '';

    for (const argument of cliArguments) {
      if (argument.startsWith('--')) {
        parsedCommand[argument] = []; // {"--help" : []}, curr = "--help"
        currentCommand = argument;
      } else if (currentCommand && argument) {
        parsedCommand[currentCommand].push(argument);
      }
    }

    //console.log('parsedCommand', parsedCommand);
    return parsedCommand;
  }
}
