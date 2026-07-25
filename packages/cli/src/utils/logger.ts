import pc from 'picocolors';
import ora, { Ora } from 'ora';

export class Logger {
  public info(message: string): void {
    console.log(`${pc.blue('ℹ')} ${message}`);
  }

  public success(message: string): void {
    console.log(`${pc.green('✔')} ${message}`);
  }

  public warn(message: string): void {
    console.log(`${pc.yellow('⚠')} ${message}`);
  }

  public error(message: string): void {
    console.error(`${pc.red('✖')} ${message}`);
  }

  public banner(title: string, subtitle?: string): void {
    console.log(`\n${pc.bold(pc.magenta('⚡ ' + title))}`);
    if (subtitle) {
      console.log(pc.gray(subtitle));
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
      console.log(pc.gray('  No items found.'));
      return;
    }

    const colWidths = headers.map((h, i) =>
      Math.max(h.length, ...rows.map((r) => (r[i] ?? '').length)),
    );

    const headerLine = headers
      .map((h, i) => pc.bold(h.padEnd(colWidths[i]! + 2)))
      .join('');
    console.log('  ' + headerLine);
    console.log('  ' + pc.gray('-'.repeat(headerLine.length)));

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
