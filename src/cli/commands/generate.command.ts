
import got from 'got';
import chalk from 'chalk';
import { MockServerData } from '../../shared/models/mock-server-data.type.js';
import { Command } from './command.interface.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/index.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { getErrorMessage } from '../../shared/helpers/common.js';

export class GenerateCommand implements Command {
  public initialData: MockServerData;

  constructor(initialData: MockServerData) {
    this.initialData = initialData;
  }

  private async write(filePath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filePath);
    for (let index = 0; index < offerCount; index++) {
      await tsvFileWriter.write(tsvOfferGenerator.generate());
    }
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }


  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(chalk.green(`File ${filepath} was created!`));
    } catch (error: unknown) {
      console.error(chalk.red('Can\'t generate data'));

      console.error(chalk.red(getErrorMessage(error)));
    }
  }
}
