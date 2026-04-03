type Level = 'INFO' | 'WARN' | 'ERROR';

function log(level: Level, message: string, meta?: unknown): void {
  const ts = new Date().toISOString();
  const parts = [`[${ts}] [${level}]`, message];
  if (meta !== undefined) parts.push(JSON.stringify(meta));
  console.log(parts.join(' '));
}

export const logger = {
  info: (msg: string, meta?: unknown) => log('INFO', msg, meta),
  warn: (msg: string, meta?: unknown) => log('WARN', msg, meta),
  error: (msg: string, meta?: unknown) => log('ERROR', msg, meta),
};
