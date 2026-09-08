const BASE_URL = import.meta.env.VITE_SERVER

export type QueryParams = Record<
  string,
  string | number | boolean | undefined | null
>

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: QueryParams
  body?: unknown
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, body, headers, ...restOptions } = options

  let url = `${BASE_URL}${path}`
  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    }
    const queryString = searchParams.toString()
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString
    }
  }

  const res = await fetch(url, {
    ...restOptions,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data as T
}

export const api = {
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),

  post: <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ) => request<T>(path, { ...options, method: 'POST', body }),

  put: <T = unknown>(
    path: string,
    body?: unknown,
    options?: Omit<RequestOptions, 'body'>,
  ) => request<T>(path, { ...options, method: 'PUT', body }),

  delete: <T = unknown>(path: string, options?: Omit<RequestOptions, 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
}
