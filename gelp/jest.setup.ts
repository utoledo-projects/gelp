import '@testing-library/jest-dom';
import { webcrypto } from 'node:crypto';

if (global.Request === undefined) {
  const { Request, Response, Headers, NextRequest, NextResponse } = require('next/dist/compiled/@edge-runtime/primitives');
  Object.assign(global, { Request, Response, Headers, NextRequest, NextResponse });
}

if (!global.crypto) {
  Object.assign(global, { crypto: webcrypto });
}