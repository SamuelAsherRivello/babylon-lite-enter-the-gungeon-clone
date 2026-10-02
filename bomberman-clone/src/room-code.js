const ROOM_CODE_PATTERN = /^[A-Z0-9]{4}$/;

export function normalizeRoomCode(value) {
  if (typeof value !== 'string') return null;
  const code = value.trim().toUpperCase();
  return ROOM_CODE_PATTERN.test(code) ? code : null;
}

export function createRoomOptions(value) {
  const entered = typeof value === 'string' ? value.trim() : '';
  if (!entered) return { create: true };
  const code = normalizeRoomCode(entered);
  return code ? { create: true, code } : null;
}

export function readRoomCode(search) {
  const params = new URLSearchParams(search);
  if (!params.has('room')) return { kind: 'none' };

  const code = normalizeRoomCode(params.get('room'));
  return code ? { kind: 'valid', code } : { kind: 'invalid' };
}
