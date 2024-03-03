#!/usr/bin/env node

import { readdir } from 'node:fs/promises';
import { CLIApplication } from './cli/cli-application.js';
import { resolve } from 'node:path';
import { Command } from './cli/commands/command.interface.js';
import chalk from 'chalk';
import { Dirent } from 'node:fs';

const COMMAND_CONFIG = {
  DIR_PATH: './src/cli/commands',
  FILE_EXTENTION: '.command.ts'
};

async function getFilesByPattern(directoryPath: string, pattern: string): Promise<string[]> {
  try {
    const dirContent: Dirent[] = await readdir(resolve(directoryPath), { withFileTypes: true });

    return dirContent
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(pattern))
      .map((dirent) => resolve(directoryPath, dirent.name));
  } catch (error) {
    console.error('Error reading directory:', error);
    return [];
  }
}

async function bootstrap() {
  const cliApplication = new CLIApplication();
  const commandFiles = await getFilesByPattern(COMMAND_CONFIG.DIR_PATH, COMMAND_CONFIG.FILE_EXTENTION);
  const commands: Command[] = [];
  for (const fileName of commandFiles) {
    const importedModule = await import(fileName);
    for (const key in importedModule) {
      const CommandClass = importedModule[key];

      try {
        commands.push(new CommandClass());
      } catch (error) {
        console.error(chalk.red(`No command found in ${chalk.bold(fileName)}`));
      }

    }
  }
  cliApplication.registerCommands(commands);
  cliApplication.processCommand(process.argv);
}

bootstrap();
