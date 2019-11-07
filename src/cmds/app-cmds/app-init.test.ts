import * as yargs from 'yargs';
import { Arguments } from 'yargs';
import { InMemoryWorkspace } from '../../workspace/impl';

it('should invoke app creation', async () => {
  // Initialize parser using the command module
  const parser = yargs.command(require('./app-init')).help();

  let workspace;
  //console.log( {InMemoryWorkspace, workspace});

  jest.mock('../../workspace/WorkspaceFactory', () => ({
    WorkspaceFactory: {
      create: () => {
        workspace = new InMemoryWorkspace();
        return workspace;
      },
    },
  }));

  const output = await new Promise((resolve: (output: string) => void) => {
    parser.parse(
      'init -f --namespace testns testapp',
      (err: Error, argv: Arguments, output: string) => {
        resolve(output);
      },
    );
  });
  expect(workspace.exists('testns', 'testapp')).toBeTruthy();
  console.log(output);
});
