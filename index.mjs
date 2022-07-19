import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import {ask} from '@reach-sh/stdlib';
const stdlib = loadStdlib(process.env);

console.log(`Hello Alice`);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance);
console.log('Test accounts created...');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

console.log('Starting backends...');
const sharedFunctions = (Who) => ({
  reportCompletion: (result) => {
    const close = result;
    console.log(`${(close) ? 'Bob has been allowed into the shuffle' : 'Unauthorized entry attempted'}.`);
    return close;
  },
});
console.log('Shared Functions loaded...')
await Promise.all([
  backend.Alice(ctcAlice, {
    ...sharedFunctions,
    addressAlice : accAlice.getAddress(),  
    whitelist : await ask.ask(`Please enter the address you would like to add to the whitelist. \nPress enter to add ${accBob.getAddress()}.`, (addr) => {
      let ans = !addr ? accBob.getAddress() : addr;
      return ans;
    }),
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...sharedFunctions,
    addressBob : accBob.getAddress(),
    // implement Bob's interact object here
  }),
]);

console.log('Goodbye, Alice and Bob!');


