import { createFetchWithCookies, set as setCookie, flush, migrateToEncrypted } from 'chip-cookies';
import { env } from './env';
import type { ProblemDetails } from '@/types/auth';

class ApiError extends Error {
  constructor(public problem: ProblemDetails) {
    super(problem.detail);
    this.name = 'ApiError';
  }
}

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
  body?: Record<string, string>;
  authenticated?: boolean;
}

const fetchWithCookies = createFetchWithCookies(env.API_URL);

function parseCookieAttributes(setCookieValue: string) {
  const parts = setCookieValue.split(';').map((p) => p.trim());
  const [nameValue, ...attrs] = parts;
  const eqIndex = nameValue.indexOf('=');
  if (eqIndex <= 0) return null;

  const name = nameValue.slice(0, eqIndex).trim();
  const value = nameValue.slice(eqIndex + 1).trim();

  const cookie: Record<string, unknown> = { name, value };

  for (const attr of attrs) {
    const lower = attr.toLowerCase();
    if (lower === 'secure') {
      cookie.secure = true;
    } else if (lower === 'httponly') {
      cookie.httpOnly = true;
    } else if (lower.startsWith('samesite=')) {
      cookie.sameSite = attr.split('=')[1];
    } else if (lower.startsWith('path=')) {
      cookie.path = attr.split('=')[1];
    } else if (lower.startsWith('domain=')) {
      cookie.domain = attr.split('=')[1];
    } else if (lower.startsWith('max-age=')) {
      cookie.maxAge = parseInt(attr.split('=')[1], 10);
    }
  }

  return cookie as { name: string; value: string } & Record<string, unknown>;
}

/**
 * Divide o header Set-Cookie em cookies individuais.
 * Lida corretamente com vírgulas em atributos (ex: Expires=Thu, 01 Dec 2025...).
 */
function splitSetCookieHeader(header: string): string[] {
  const parts = header.split(',');
  const cookies: string[] = [];
  let current = '';

  for (const part of parts) {
    if (!current) {
      // Primeiro fragmento
      current = part;
    } else if (/^\s*\w+=/.test(part)) {
      // Novo cookie: fragmento começa com "name="
      cookies.push(current.trim());
      current = part;
    } else {
      // Continuação do cookie atual (ex: data em Expires)
      current += ',' + part;
    }
  }

  if (current) {
    cookies.push(current.trim());
  }

  return cookies;
}

async function saveCookiesFromResponse(response: Response) {
  const setCookieHeader = response.headers.get('set-cookie');
  if (!setCookieHeader) return;

  const cookieStrings = splitSetCookieHeader(setCookieHeader);
  for (const cookieStr of cookieStrings) {
    const parsed = parseCookieAttributes(cookieStr.trim());
    if (parsed) {
      await setCookie(env.API_URL, parsed);
    }
  }
  flush();
}

async function request<T>(method: Method, path: string, options?: RequestOptions): Promise<T> {
  const headers: Record<string, string> = {};

  if (options?.body) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  const fetchFn = options?.authenticated ? fetchWithCookies : fetch;

  const fetchOptions: RequestInit = { method, headers };

  if (options?.body) {
    fetchOptions.body = new URLSearchParams(options.body).toString();
  }

  const response = await fetchFn(`${env.API_URL}${path}`, fetchOptions);

  await saveCookiesFromResponse(response);

  if (!response.ok) {
    const problem: ProblemDetails = await response.json();
    throw new ApiError(problem);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function get<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
  return request<T>('GET', path, options);
}

function post<T>(path: string, options?: RequestOptions) {
  return request<T>('POST', path, options);
}

function patch<T>(path: string, options?: RequestOptions) {
  return request<T>('PATCH', path, options);
}

function del<T>(path: string, options?: Omit<RequestOptions, 'body'>) {
  return request<T>('DELETE', path, options);
}

async function initializeSecurity() {
  await migrateToEncrypted(env.API_URL);
}

export { get, post, patch, del, ApiError, initializeSecurity, type ProblemDetails };
