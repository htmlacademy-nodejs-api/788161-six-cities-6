import chalk from 'chalk';
import { Command } from './command.interface.js';


export class HelpCommand implements Command {
  public getName(): string {
    return '--help';
  }

  public async execute(..._parameters: string[]): Promise<void> {
    console.info(`
    ${chalk.yellow('Программа для подготовки данных для REST API сервера.')} 
        ${chalk.bold('Пример')}
            cli.js --<command> [--arguments]
        ${chalk.bold('Команды:')}
            --version:                   # выводит номер версии проекта из файла package.json
            --help:                      # выводит список поддерживаемых приложением команд
            --import <path>:             # импортирует данные о предложениях об аренде из TSV файла в базу данных
            --generate <n> <path> <url>  # генерирует заданное количество предложений об аренде в TSV файл
    `);
  }
}
