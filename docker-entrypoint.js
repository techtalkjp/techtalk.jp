#!/usr/bin/env node

import { spawn } from 'node:child_process'

const env = { ...process.env }

;(async () => {
  // enable swapfile
  await exec('fallocate -l 512M /swapfile')
  await exec('chmod 600 /swapfile')
  await exec('mkswap /swapfile')
  await exec('echo 10 | tee /proc/sys/vm/swappiness')
  await exec('swapon /swapfile')
  await exec('echo 1 | tee /proc/sys/vm/overcommit_memory')

  // If running the web server then migrate existing database
  if (process.argv.slice(2).join(' ') === 'pnpm run start') {
    await exec('npx prisma migrate deploy')
  }

  // launch application
  await exec(process.argv.slice(2).join(' '))
})()

function exec(command) {
  const child = spawn(command, { shell: true, stdio: 'inherit', env })
  return new Promise((resolve, reject) => {
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} failed rc=${code}`))
      }
    })
  })
}
