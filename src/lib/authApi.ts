import { API_BASE_URL, ApiError, saveSession, UserInterest } from './api'

type ApiResponse<T> = {
  message: string
  data: T
  success: boolean
}

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResult = {
  jwt: string
  userId: number
}

export type { UserInterest }

export type SignupPayload = {
  email: string
  password: string
  userName: string
  profilePictureUrl?: string
  coverPictureUrl?: string
  dateOfBirth?: string
  isPrivate?: boolean
  bio?: string
  location?: string
  skills?: string[]
  interests?: UserInterest[]
}

export type SignupResult = {
  id: number
  userName: string
  jwt: string
}

export type AuthSession = {
  token: string
  userId: number
  userName?: string
}

export class ServerUnavailableError extends Error {
  constructor(message = 'The DevForge server is currently unavailable.') {
    super(message)
    this.name = 'ServerUnavailableError'
  }
}

export { ApiError }

const SERVER_UNAVAILABLE_STATUSES = new Set([502, 503, 504])
const REQUEST_TIMEOUT_MS = 10_000

async function requestAuth<TResponse, TPayload>(path: string, payload: TPayload): Promise<TResponse> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  let response: Response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof TypeError || (error instanceof DOMException && error.name === 'AbortError')) {
      throw new ServerUnavailableError()
    }
    throw error
  } finally {
    window.clearTimeout(timeout)
  }

  if (SERVER_UNAVAILABLE_STATUSES.has(response.status)) {
    throw new ServerUnavailableError()
  }

  let body: ApiResponse<TResponse> | null = null

  try {
    body = (await response.json()) as ApiResponse<TResponse>
  } catch {
    body = null
  }

  if (!response.ok || !body?.success) {
    const details = Array.isArray(body?.data) ? (body.data as string[]) : undefined
    throw new ApiError(body?.message ?? 'Authentication request failed', response.status, details)
  }

  return body.data
}

export function login(payload: LoginPayload) {
  return requestAuth<LoginResult, LoginPayload>('/auth/login', payload)
}

export function signup(payload: SignupPayload) {
  return requestAuth<SignupResult, SignupPayload>('/auth/signup', payload)
}

export async function checkServerAvailability() {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 5_000)

  try {
    const response = await fetch(`${API_BASE_URL}/actuator/health/liveness`, {
      cache: 'no-store',
      signal: controller.signal,
    })
    return response.ok
  } catch {
    return false
  } finally {
    window.clearTimeout(timeout)
  }
}

export function saveAuthSession(session: AuthSession) {
  saveSession(session.token, session.userId, session.userName)
}
