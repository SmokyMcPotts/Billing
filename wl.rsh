'reach 0.1';

const commonInteract = {
  requestDenied: Fun([], Null),
  reportMismatch: Fun([], Null),
  reportCompletion: Fun([UInt], Null)
  //common interact functions here
};

const aliceInteract = {
  ...commonInteract,
  requestAddress: Address,
  requestAmount: UInt,
  reportReady: Fun([UInt], Null),
  //additional initiator interact functions here
};

const bobInteract = {
  //additional attacher interact functionns here
  ...commonInteract,
  bobAddress: Address,
  approveRequest: Fun([UInt], Bool)
};

export const main = Reach.App(() => {
    setOptions({ untrustworthyMaps: true });
    const A = Participant('Alice', aliceInteract);
    const B = Participant('Bob', bobInteract);
    init();

    A.only(() => { 
      const requestAmount = declassify(interact.requestAmount);
      const requestAddress = declassify(interact.requestAddress);
    });
    A.publish(requestAddress, requestAmount);
    const compareSet = new Set();
    compareSet.insert(requestAddress);
    A.interact.reportReady(requestAmount);
    commit();

    B.only(() => {
      const bobAddress = declassify(interact.bobAddress);
      const approvalTrue = declassify(interact.approveRequest(requestAmount));
    });
    B.publish(bobAddress, approvalTrue); 
    //this happens in consensus step?
    if (compareSet.member(bobAddress)) {
      commit();
      each ([A, B], () => interact.reportMismatch());
      exit();
    } else { 
      if (!approvalTrue) {
        commit();
        each ([A,B], () => interact.requestDenied());
        exit();
      } else {
        commit();
      }
    }

    B.pay(requestAmount);
    each ([A, B], () => interact.reportCompletion(requestAmount));
    transfer(requestAmount).to(A);
    commit();

    exit();
  });  