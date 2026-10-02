import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Gungeon accepts four-character room codes and auto-joins invite links', async () => {
  const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(source, /maxlength="4"/);
  assert.match(source, /\[A-Z0-9\]\{4\}/);
  assert.match(source, /four-character code/);
  assert.match(source, /searchParams\.set\('room',session\.state\.code\)/);
  assert.match(source, /searchParams\.get\('room'\)/);
  assert.match(source, /connect\(\{code:inviteCode\.toUpperCase\(\)\}\)/);
});
