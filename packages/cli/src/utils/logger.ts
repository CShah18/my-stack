import chalk from 'chalk';
import ora, { Ora } from 'ora';

export class Logger {
  public info(message: string): void {
    console.log(`${chalk.blue('ℹ')} ${message}`);
  }

  public success(message: string): void {
    console.log(`${chalk.green('✔')} ${message}`);
  }

  public warn(message: string): void {
    console.log(`${chalk.yellow('⚠')} ${message}`);
  }

  public error(message: string): void {
    console.error(`${chalk.red('✖')} ${message}`);
  }

  public banner(title: string, subtitle?: string): void {
    console.log(`\n${chalk.bold.magenta('⚡ ' + title)}`);
    if (subtitle) {
      console.log(chalk.gray(subtitle));
    }
    console.log('');
  }

  public spinner(message: string): Ora {
    return ora({
      text: message,
      color: 'cyan',
    }).start();
  }

  public table(headers: string[], rows: string[][]): void {
    if (rows.length === 0) {
      console.log(chalk.gray('  No items found.'));
      return;
    }

    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)),
    );

    const headerLine = headers
      .map((h, i) => chalk.bold(h.padEnd(colWidths[i]! + 2)))
      .join('');
    console.log('  ' + headerLine);
    console.log('  ' + chalk.gray('-'.repeat(headerLine.length)));

    for (const row of rows) {
      const line = row
        .map((cell, i) => (cell ?? '').padEnd(colWidths[i]! + 2))
        .join('');
      console.log('  ' + line);
    }
    console.log('');
  }
}

export const logger = new Logger();
