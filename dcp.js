#!/usr/bin/env node

const SCHEDULER_URL = new URL('http://scheduler.will.office.kingsds.network');

const workFunctionModule = require('./workFunction');
const fs = require('fs').promises;

/** Main program entry point */
async function main() {
  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');
  let startTime;

  const args = process.argv.slice(2);

  let fileNameReadPromises = [];
  let data;

  for (let i = 0; i < args.length; i++) {
    fileNameReadPromises.push(fs.readFile(args[i], 'utf8'));
  }

  try {
    data = await Promise.all(fileNameReadPromises);
  } catch (error) {
    console.log('problem finding file');
    console.log(error);
    process.exit(1);
  }

  const job = compute.for(
    data,
    workFunctionModule.workFunction,
  );

  job.on('accepted', () => { console.log(` - Job ${job.id} accepted`); startTime = Date.now(); });
  job.on('readystatechange', (arg) => { console.log(`new ready state: ${arg}`) });
  job.on('result', (ev) => {
    const time = Math.round((Date.now() - startTime) / 100) / 10;
    console.log(` - Received result for slice ${ev.sliceNumber} at ${time}s`);
    console.log(` * Wow! ${ev.result} is such a pretty colour!`);
  });

  job.public.name = 'one job - red';
  console.log(job.computeGroups);

  const ks = await wallet.get(); /* usually loads ~/.dcp/default.keystore */
  job.setPaymentAccountKeystore(ks);

  const results = Array.from(await job.localExec());
//  const results = Array.from(await job.exec());
  console.log('results=', results);


  debugger;

  for (let i = 0; i < results.length; i++) {
    await fs.writeFile(`./build/asm-output${i}.S`, results[i]);
  }
}
/* Initialize DCP Client and run main() */
require('dcp-client')
  .init(SCHEDULER_URL)
  .then(main)
  .catch(console.error)
  .finally(process.exit);

