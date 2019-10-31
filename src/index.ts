#!/usr/bin/env node
import * as yargs from 'yargs';

/**
 * Initialises the command line parsing.
 */

// tslint:disable-next-line: no-unused-expression
yargs
  .commandDir('cmds', {
    exclude: /.*test\.js$/,
  })
  .demandCommand()
  .strict()
  .help()
  .version().argv;
