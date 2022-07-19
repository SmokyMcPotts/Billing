'reach 0.1';

const sharedFunctions = {
  reportCompletion : Fun([Bool], Null),
};

const aliceInteract = {
  ...sharedFunctions,
  addressAlice : Address,
  whitelist : Address,
};

const bobInteract = {
  ...sharedFunctions,
  addressBob : Address,
}

export const main = Reach.App(() => {
  setOptions({ untrustworthyMaps: true });
  const A = Participant('Alice', aliceInteract);
    // Specify Alice's interact interface here
  const B = Participant('Bob', bobInteract);
    // Specify Bob's interact interface here
  init();
  // The first one to publish deploys the contract
  A.only(() => { const addressAlice = declassify(interact.addressAlice); 
  });
  A.publish(addressAlice);
  commit();

  B.only(() => { const addressBob = declassify(interact.addressBob);
  });
  B.publish(addressBob);
  commit();

  A.only(() => { const whitelist = declassify(interact.whitelist);  
  });
  A.publish(whitelist);
  const compareSet = new Set();
  compareSet.insert(whitelist);
  const result = (compareSet.member(addressBob));
  each ([A, B], () => {
    interact.reportCompletion(result); 
  });
  commit();
  
  exit();
});
