module.exports =
[ [ 'line', 'TAP version 13\n' ],
  [ 'version', '13' ],
  [ 'line', '# beep\n' ],
  [ 'comment', '# beep\n' ],
  [ 'line', 'ok 1 should be equal\n' ],
  [ 'line', 'ok 2 should be equivalent\n' ],
  [ 'assert', { ok: true, id: 1, name: 'should be equal' } ],
  [ 'line', '# boop\n' ],
  [ 'comment', '# boop\n' ],
  [ 'line', 'ok 3 should be equal\n' ],
  [ 'assert', { ok: true, id: 2, name: 'should be equivalent' } ],
  [ 'line', 'ok 4 (unnamed assert)\n' ],
  [ 'assert', { ok: true, id: 3, name: 'should be equal' } ],
  [ 'line', '1..3\n' ],
  [ 'assert', { ok: true, id: 4, name: '(unnamed assert)' } ],
  [ 'plan', { start: 1, end: 3 } ],
  [ 'line', '# tests 4\n' ],
  [ 'comment', '# tests 4\n' ],
  [ 'line', '# pass  4\n' ],
  [ 'comment', '# pass  4\n' ],
  [ 'line', '# ok\n' ],
  [ 'comment', '# ok\n' ],
  [ 'complete',
    { ok: false, count: 4, pass: 4, plan: { start: 1, end: 3 } } ] ]
