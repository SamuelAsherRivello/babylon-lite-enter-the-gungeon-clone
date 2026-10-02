import assert from 'node:assert/strict';
import test from 'node:test';
import { createRoomOptions, normalizeRoomCode, readRoomCode } from '../src/room-code.js';

test('room codes normalize case and surrounding whitespace', () => {
  assert.equal(normalizeRoomCode('ab9z'), 'AB9Z');
  assert.equal(normalizeRoomCode('  Ab9z  '), 'AB9Z');
});

test('room codes require exactly four ASCII letters or digits', () => {
  for (const code of ['ABC', 'ABCDE', 'AB 2', 'AB!2', 'ÄB12', '', null, 1234]) {
    assert.equal(normalizeRoomCode(code), null, `expected ${String(code)} to be rejected`);
  }
});

test('blank creation requests a generated room and custom creation normalizes its code', () => {
  assert.deepEqual(createRoomOptions(''), { create: true });
  assert.deepEqual(createRoomOptions(' ab12 '), { create: true, code: 'AB12' });
  assert.equal(createRoomOptions('ab!2'), null);
});

test('invite parsing distinguishes absent, valid, and invalid room values', () => {
  assert.deepEqual(readRoomCode('?mode=online'), { kind: 'none' });
  assert.deepEqual(readRoomCode('?room=ab9z'), { kind: 'valid', code: 'AB9Z' });
  assert.deepEqual(readRoomCode('?room=ABC123'), { kind: 'invalid' });
  assert.deepEqual(readRoomCode('?room='), { kind: 'invalid' });
});
