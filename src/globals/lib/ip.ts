#!/usr/bin/env node

import { promisify } from 'util';
import { exec as _exec } from 'child_process';

const execPromisified = promisify(_exec);

async function exec(command: string): Promise<string | undefined> {
  try {
    const { stdout, stderr } = await execPromisified(command);
    if (stderr) {
      console.error(`stderr: \n${stderr}`);
      return undefined;
    }
    if (stdout) {
      process.env.HOST = stdout.trim();
      return stdout;
    }
    return undefined;
  } catch (error: any) {
    console.error(`error: \n${error.message}`);
    return undefined;
  }
}
exec('dig +short myip.opendns.com @resolver1.opendns.com');
