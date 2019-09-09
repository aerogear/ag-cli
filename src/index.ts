import * as yargs from 'yargs';

// tslint:disable-next-line: no-unused-expression
yargs
  .strict()
  .commandDir('cmds')
  .demandCommand()
  .help()
  .version().argv;
