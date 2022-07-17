import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/wl.main.mjs';
import {ask} from '@reach-sh/stdlib';

//identify possible roles, assign via run commmand
if (process.argv.length < 3 || ['Alice', 'Bob'].includes(process.argv[2]) == false) {
    console.log('Usage: reach run wl [Alice|Bob]');
    process.exit(0);
}
 
const userName = process.argv[2];

//accounting stuff
const stdlib = loadStdlib();
const suStr = stdlib.standardUnit;
const toAU = (su) => stdlib.parseCurrency(su);
const toSU = (au) => stdlib.formatCurrency(au, 4);
const startingBalance = toAU(1000);

const accountBob = await stdlib.newTestAccount(startingBalance);
const accountAlice = await stdlib.newTestAccount(startingBalance);
const addressBob = accountBob.getAddress();
const addressAlice = accountAlice.getAddress();
const balance = async (who) => 
        stdlib.formatCurrency(await stdlib.balanceOf(who), 3);
const balAlice = await balance(accountAlice);
const balBob = await balance(accountBob);
//additional new account stuff

console.log(`Hello ${userName}, your account address is ${userName == 'Bob' ? addressBob : addressAlice}. please wait while we prepare`);
console.log(`Your current balance is ${userName == 'Bob' ? balBob : balAlice} ${suStr}.`);

//commmon interact
const commonInteract = (userName) => ({
    requestDenied: () => {console.log(`${userName == 'Bob' ? 'You have denied the request' : 'Bob said no'}.`)},
    reportMismatch: () => { console.log(`${userName == 'Bob' ? 'This request was intended for someone else' : 'Address does not match input, request aborted'}.`)},
    reportCompletion: (approveRequest) => { console.log(`${username == 'Bob' ? 'You have ' : 'Bob has '} accepted the request, and a transfer of ${toSU(payment)} has been completed.`)},
//future common interact properties
});

//Alice interact
if (userName === 'Alice') {
    const aliceInteract = {
        ...commonInteract(userName),
        requestAddress: await ask.ask("Please enter the address you would like to bill.", (add) => {
            let reqAdd = add;
            return reqAdd;
        }),
        requestAmount: await ask.ask('How much would you like to request?', (amt) => {
            let reqAmt = amt;
            return reqAmt;
        }),
        reportReady: async (requestAmount) => console.log(`Your request for ${toSU(requestAmount)} ${suStr} has been submitted.`),
    };

    // alice-specific accounting stuff 

//Bob interact 
} else {
    const bobInteract = {
        ...commonInteract(userName),
        bobAddress: accountBob.getAddress(),
        approveRequest: async (requestAmount) => await ask.ask(`Your balance is ${balBob} ${suStr}. Alice is requesting ${requestAmount} ${suStr}. Approve request?`, ask.yesno), 
        //more Bob interact?
    }
    
    // bob-specific accounting stuff

};

// ask.done();