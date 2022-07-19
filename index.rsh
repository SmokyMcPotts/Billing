'reach 0.1';

const sharedFunctions = {
  reportCompletion : Fun([], Null),
  reportMismatch: Fun([], Null),
};

export const main = Reach.App(() => {
  setOptions({ untrustworthyMaps: true });
  const A = Participant('Alice', {
    whitelist : Address,
    ...sharedFunctions,
    // Specify Alice's interact interface here
  });
  const B = Participant('Bob', {
    addressBob : Address,
    ...sharedFunctions,
    // Specify Bob's interact interface here
  });
  init();
  // The first one to publish deploys the contract
  A.only(() => { const whitelist = declassify(interact.whitelist);  
  });
  A.publish(whitelist);
  const compareSet = new Set();
  compareSet.insert(whitelist);
  commit();
  // The second one to publish always attaches
  B.only(() => {
    const addressBob = declassify(interact.addressBob);
  })
  B.publish(addressBob);
  // write your program here
  if (compareSet.member(addressBob)) {
    commit();
    each ([A,B], () => interact.reportCompletion());
  } else {
    commit();
    each([A,B], () => interact.reportMismatch());
  };
  exit();
});
