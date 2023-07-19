import chalk from 'chalk'

const logging = {
  success: (args1: String, args2: any = '') => {
    console.log(chalk.bold.green(`\n[SUCCESS] [${new Date().toLocaleString()}]`), chalk.greenBright(args1))
    console.log(args2)
  },
  info: (args1: String, args2: any = '') => {
    console.log(chalk.bold.blue(`\n[INFO] [${new Date().toLocaleString()}]`), chalk.blueBright(args1))
    console.info(args2)
  },
  warning: (args1: String, args2: any = '') => {
    console.log(chalk.bold.yellow(`\n[WARNING] [${new Date().toLocaleString()}] `), chalk.yellowBright(args1))
    console.warn(args2)
  },
  error: (args1: String, args2: any = '') => {
    console.log(chalk.bold.red(`\n[ERROR] [${new Date().toLocaleString()}] `), chalk.redBright(args1))
    console.error(args2)
  }
}

export default logging
