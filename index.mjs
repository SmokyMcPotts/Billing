import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
import {ask} from '@reach-sh/stdlib';
const stdlib = loadStdlib(process.env);

if (process.argv.length < 3 || ['Alice', 'Bob'].includes(process.argv[2]) == false) {
  console.log('Usage: reach run index [Alice|Bob]');
  process.exit(0);
}
const userName = process.argv[2];
console.log(`Hello ${userName}`);

const startingBalance = stdlib.parseCurrency(100);

const [ accAlice, accBob ] =
  await stdlib.newTestAccounts(2, startingBalance);
console.log('Test accounts created...');

console.log('Launching...');
const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());

console.log('Starting backends...');
const sharedFunctions = (who) => ({
  reportCompletion: () => {
    console.log(`${(userName == 'Bob') ? 'You have' : 'Bob has'} been allowed into the shuffle.`)
  },
  reportMismatch: () => {
    console.log(`${(userName == 'Bob') ? 'You are not able to join this shuffle. \nPlease contact the creator' : 'Invalid access attempt made'}.`)
  },
});
await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    ...sharedFunctions,
    whitelist : await ask.ask(`Your address is ${accAlice.getAddress()}. \nPlease enter the address you would like to add to the whitelist. \nPress enter to add ${accBob.getAddress()}.`, (addr) => {
      let ans = !addr ? accBob.getAddress() : addr;
      return ans;
    }),
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    addressBob : accBob.getAddress(),
    ...stdlib.hasRandom,
    ...sharedFunctions,
    // implement Bob's interact object here
  }),
]);

console.log('Goodbye, Alice and Bob!');
