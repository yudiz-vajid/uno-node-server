#!/usr/bin/env node
/* eslint-disable import/prefer-default-export */
import { networkInterfaces } from 'os';
import { promisify } from 'util';
import { exec as _exec } from 'child_process';

const execPromisified = promisify(_exec);

// eslint-disable-next-line consistent-return
export async function getIp(command = 'dig +short myip.opendns.com @resolver1.opendns.com'): Promise<string | undefined> {
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
  } catch (error: any) {
    const MAC = Object.values(networkInterfaces())
      .flat()
      ?.find(_interface => _interface?.mac !== '00:00:00:00:00:00')?.mac;
    if (!MAC) {
      console.error(`error: \n${error.message}`);
      console.error(`${_.now()} unable to fetch ip/MAC.`);
      console.error(`${_.now()} terminating process!!!!!!!.`);
      process.exit(1);
      return undefined;
    }
    process.env.HOST = MAC;
    return MAC;
  }
}
