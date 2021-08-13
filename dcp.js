#!/usr/bin/env node

const SCHEDULER_URL = new URL('http://scheduler.will.office.kingsds.network');
//const SCHEDULER_URL = new URL('http://scheduler.staging.office.kingsds.network');
//const SCHEDULER_URL = new URL('https://scheduler.distributed.computer');

const workFunctionModule = require('./workFunction');
const fs = require('fs').promises;
debugger;

/** Main program entry point */
async function main() {
  debugger;
  const compute = require('dcp/compute');
  const wallet = require('dcp/wallet');
  let startTime;

  const job = compute.for(
    [  `
  int fac(int n) {
    if (n < 1) return 1;
    return n * fac(n - 1);
  }
`
],
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

  debugger;

  const results = Array.from(await job.localExec());
//  const results = Array.from(await job.exec());
  console.log('results=', results);

  await fs.writeFile('./test.o', results[0]);
}

/* Initialize DCP Client and run main() */
require('dcp-client')
  .init(SCHEDULER_URL)
  .then(main)
  .catch(console.error)
  .finally(process.exit);
