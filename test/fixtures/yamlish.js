module.exports =
[ [ 'line', 'TAP Version 13\n' ],
  [ 'version', '13' ],
  [ 'line', 'not ok 1 Resolve address\n' ],
  [ 'line', '  ---\n' ],
  [ 'line',
    '  message: "Failed with error \'hostname peebles.example.com not found\'"\n' ],
  [ 'line', '  severity: fail\n' ],
  [ 'line', '  data:\n' ],
  [ 'line', '    got:\n' ],
  [ 'line', '      hostname: \'peebles.example.com\'\n' ],
  [ 'line', '      address: ~\n' ],
  [ 'line', '    expected:\n' ],
  [ 'line', '      hostname: \'peebles.example.com\'\n' ],
  [ 'line', '      address: \'85.193.201.85\'\n' ],
  [ 'line', '  ...\n' ],
  [ 'assert',
    { ok: false,
      id: 1,
      name: 'Resolve address',
      diag: 
       { message: 'Failed with error \'hostname peebles.example.com not found\'',
         severity: 'fail',
         data: 
          { got: { hostname: 'peebles.example.com', address: null },
            expected: { hostname: 'peebles.example.com', address: '85.193.201.85' } } } } ],
  [ 'line', '1..1\n' ],
  [ 'plan', { start: 1, end: 1 } ],
  [ 'complete',
    { ok: false,
      count: 1,
      pass: 0,
      fail: 1,
      plan: { start: 1, end: 1 } } ] ]
