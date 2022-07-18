# Billing
week3 bear challenge - reach ascent 

output for Bob terminal

Hello Bob, your account address is "0x4e69fd6e63f63c93815b18bad8a6f18488cd7723aaafda051d7e8e04ed4eed08". please wait while we prepare
Your current balance is 1000 ALGO.
1000
ERROR: 13

output for alice terminal

Hello Alice, your account address is not needed. please wait while we prepare
Your current balance is 1000 ALGO.
Please enter the address you would like to bill.
0x4e69fd6e63f63c93815b18bad8a6f18488cd7723aaafda051d7e8e04ed4eed08
How much would you like to request?
101
1000
/stdlib/dist/cjs/ALGO.js:2347
                                                    throw Error("".concat(label, " failed to call ").concat(funcName, ": ").concat(jes));
                                                          ^

Error: RD2U failed to call m0: {
  "type": "signAndPost",
  "e": {
    "status": 400,
    "response": {
      "message": "TransactionPool.Remember: transaction RT6YGSRBSKEGLNL63MH37CICN7CDZCNNL2KZHEUKIPCKAW7Z75UA: logic eval error: cannot fetch key, JZU723TD6Y6JHAK3DC5NRJXRQSEM25ZDVKX5UBI5P2HAJ3KO5UEF6TFCFM has not opted in to app 115. Details: pc=350, opcodes=bytec_0 // 0x00\npushbytes 0x01 // 0x01\napp_local_put\n"
    }
  },
  "es": "Error: Network request error. Received status 400: TransactionPool.Remember: transaction RT6YGSRBSKEGLNL63MH37CICN7CDZCNNL2KZHEUKIPCKAW7Z75UA: logic eval error: cannot fetch key, JZU723TD6Y6JHAK3DC5NRJXRQSEM25ZDVKX5UBI5P2HAJ3KO5UEF6TFCFM has not opted in to app 115. Details: pc=350, opcodes=bytec_0 // 0x00\npushbytes 0x01 // 0x01\napp_local_put\n"
}
    at /stdlib/dist/cjs/ALGO.js:2347:59
    at step (/stdlib/dist/cjs/ALGO.js:70:23)
    at Object.throw (/stdlib/dist/cjs/ALGO.js:51:53)
    at step (/stdlib/dist/cjs/ALGO.js:55:139)
    at Object.throw (/stdlib/dist/cjs/ALGO.js:51:53)
    at rejected (/stdlib/dist/cjs/ALGO.js:43:65)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
