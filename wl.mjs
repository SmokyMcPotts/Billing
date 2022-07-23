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
const balance = async (who) => toSU(await stdlib.balanceOf(who));

//additional new account stuff
const accountAlice = await stdlib.newTestAccount(startingBalance);
const balAlice = await balance(accountAlice);
const accountBob = await stdlib.newTestAccount(startingBalance);
const balBob = await balance(accountBob);
const ctcAlice = accountAlice.contract(backend);
const ctcInfo = ctcAlice.getInfo();
const ctcBob = accountBob.contract(backend, ctcAlice.getInfo());


console.log(`Hello ${userName}, your account address is ${userName == 'Bob' ? await accountBob.getAddress() : 'not needed'}. \nPlease wait while we prepare`);
console.log(`Your current balance is ${userName == 'Bob' ? balBob : balAlice} ${suStr}.`);

//commmon interact
const commonInteract = async (userName) => ({
    requestDenied: async () => {console.log(`${userName == 'Bob' ? 'You have denied the request' : 'Bob said no'}.`)},
    reportMismatch: async () => { console.log(`${userName == 'Bob' ? 'This request was intended for someone else' : 'Address does not match input, request aborted'}.`)},
    reportCompletion: async (approveRequest) => { console.log(`${userName == 'Bob' ? 'You have ' : 'Bob has '} accepted the request, and a transfer of ${toSU(payment)} has been completed.`)},
    reportReady: async (requestAmount) => console.log((userName == 'Bob') ? `Incoming request...` : `Your request for ${toSU(requestAmount)} ${suStr} has been submitted.`),
    //future common interact properties
});

//Alice interact
if (userName == 'Alice') {
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
            
        };
        // alice-specific accounting stuff 
    await ctcAlice.participants.Alice(aliceInteract);
    console.log(`Your new balance is ${balAlice} ${suStr}.`);
     
} else { //Bob interact
    
    const bobInteract = {
            ...commonInteract(userName),
            bobAddress: await accountBob.getAddress(),
            approveRequest: async (requestAmount) => await ask.ask(`Your balance is ${balBob} ${suStr}. Alice is requesting ${requestAmount} ${suStr}. Approve request?`, ask.yesno), 
            //more Bob interact?
    }
    await ctcBob.participants.Bob(bobInteract);
    (!approveRequest) ? console.log(`You have denied the request.`) : console.log(`You have paid Alice ${requestAmount} ${suStr}.`);
    
    // bob-specific accounting stuff
    
};
console.log(`Your new balance is ${balBob} ${suStr}.`);
ask.done();