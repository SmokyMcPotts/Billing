import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import {ask} from '@reach-sh/stdlib';
const stdlib = loadStdlib(process.env);

console.log(`Hello Alice`);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance);
console.log('Test accounts created...');
const aliceAddress = accAlice.getAddress();
console.log(`Your account address is ${aliceAddress}.`);

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());
console.log('Starting backends...');

await Promise.all([
  backend.Alice(ctcAlice, {
    addressAlice : accAlice.getAddress(),  
    whitelist : await ask.ask(`Please enter the address you would like to add to the whitelist. \nOr press enter to add ${accBob.getAddress()}.`, (addr) => {
      let ans = !addr ? accBob.getAddress() : addr;
      return ans;
    }),
    reportCompletion: (result) => {
      console.log(`${(result) ? 'Bob has been allowed into the shuffle' : 'Unauthorized entry attempted'}.`);
    },
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    addressBob : accBob.getAddress(),
    // implement Bob's interact object here
  }),
]);

console.log('Goodbye, Alice');

