/**
 * 'app' command tests.
 */
import * as yargs from 'yargs';
import { Arguments } from 'yargs';

it('returns help output', async () => {
  // Initialize parser using the command module
  const parser = yargs.command(require('./app')).help();

  // Run the command module with --help as argument
  const output = await new Promise((resolve: (output: string) => void) => {
    parser.parse('--help', (err: Error, argv: Arguments, output: string) => {
      resolve(output);
    });
  });

  // Verify the output is correct
  expect.stringContaining('app  Manages applications');
});
