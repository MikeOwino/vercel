import mri from 'mri';
import chalk from 'chalk';
import logo from '../util/output/logo';
import { handleError } from '../util/error';
import getScope from '../util/get-scope.ts';
import { getPkgName } from '../util/pkg-name.ts';

const help = () => {
  console.log(`
  ${chalk.bold(`${logo} ${getPkgName()} whoami`)}

  ${chalk.dim('Options:')}

    -h, --help                     Output usage information
    -A ${chalk.bold.underline('FILE')}, --local-config=${chalk.bold.underline(
    'FILE'
  )}   Path to the local ${'`vercel.json`'} file
    -Q ${chalk.bold.underline('DIR')}, --global-config=${chalk.bold.underline(
    'DIR'
  )}    Path to the global ${'`.vercel`'} directory
    -d, --debug                    Debug mode [off]
    -t ${chalk.bold.underline('TOKEN')}, --token=${chalk.bold.underline(
    'TOKEN'
  )}        Login token

  ${chalk.dim('Examples:')}

  ${chalk.gray('–')} Shows the username of the currently logged in user

    ${chalk.cyan(`$ ${getPkgName()} whoami`)}
`);
};

const main = async client => {
  const { output } = client;

  const argv = mri(client.argv.slice(2), {
    boolean: ['help'],
    alias: {
      help: 'h',
    },
  });

  argv._ = argv._.slice(1);

  if (argv.help || argv._[0] === 'help') {
    help();
    return 2;
  }

  let contextName = null;

  try {
    ({ contextName } = await getScope(client, { getTeam: false }));
  } catch (err) {
    if (err.code === 'NOT_AUTHORIZED' || err.code === 'TEAM_DELETED') {
      output.error(err.message);
      return 1;
    }

    throw err;
  }

  if (process.stdout.isTTY) {
    process.stdout.write('> ');
  }

  console.log(contextName);
};

export default async client => {
  try {
    await main(client);
  } catch (err) {
    handleError(err);
    process.exit(1);
  }
};
