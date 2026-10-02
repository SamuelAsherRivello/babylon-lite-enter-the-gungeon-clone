import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('Gungeon shares four-character validation across manual entry and invite links', async () => {
  const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(source, /maxlength="4"/);
  assert.match(source, /normalizeRoomCode\(/);
  assert.match(source, /readRoomCode\(location\.search\)/);
  assert.match(source, /four-character letter-and-number code/);
  assert.match(source, /id="room-code-error"[^>]*role="alert"/);
  assert.match(source, /searchParams\.set\('room',session\.state\.code\)/);
  assert.match(source, /invite\.kind==='invalid'/);
  assert.match(source, /invite\.kind==='valid'/);
  assert.match(source, /\.toUpperCase\(\)/);
});
