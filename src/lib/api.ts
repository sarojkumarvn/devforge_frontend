const LOCAL_API_BASE_URL = 'http://localhost:8080/api/v1'
const PRODUCTION_API_BASE_URL = 'https://devforge-pw35.onrender.com/api/v1'
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const API_BASE_URL = (
  configuredApiBaseUrl || (import.meta.env.DEV ? LOCAL_API_BASE_URL : PRODUCTION_API_BASE_URL)
).replace(/\/$/, '')

export type ApiEnvelope<T> = {
  message: string
  data: T
  success: boolean
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

export type UserInterest =
  | 'FRONTEND'
  | 'BACKEND'
  | 'FULLSTACK'
  | 'DEVOPS'
  | 'DATA_SCIENCE'
  | 'MACHINE_LEARNING'
  | 'AI'
  | 'MOBILE_DEVELOPMENT'
  | 'GAME_DEVELOPMENT'
  | 'CLOUD_COMPUTING'
  | 'CYBERSECURITY'
  | 'BLOCKCHAIN'
  | 'OTHER'

export type UserSummary = {
  id: number
  userName: string
  profilePictureUrl?: string
}

export type UserProfile = UserSummary & {
  coverPictureUrl?: string
  bio?: string
  location?: string
  skills?: string[]
  interests?: UserInterest[]
  followingCount?: number
  followerCount?: number
}

export type Community = {
  id: number
  name: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  privacy: 'PUBLIC' | 'PRIVATE'
  canManage: boolean
}

export type CommunityPayload = {
  name: string
  description?: string
  logoUrl?: string
  bannerUrl?: string
  privacy: Community['privacy']
}

export type Project = {
  id: number
  title: string
  description: string
  githubLink?: string
  liveDemoLink?: string
  techStacks?: string[]
  status?: string
  photos?: string[]
  userId: number
  userName: string
  createdAt: string
  isPublic?: boolean
  likeCount?: number
  commentCount?: number
  bookmarkCount?: number
  communityId?: number
}

export type FeedPost = {
  projectId: number
  title: string
  description: string
  photos?: string[]
  userId: number
  userName: string
  likeCount?: number
  commentCount?: number
  isLiked?: boolean
  isBookmarked?: boolean
  createdAt: string
}

export type Comment = {
  id: number
  content: string
  userName: string
  createdAt: string
  projectId: number
  replies?: Comment[]
}

export type ProjectPayload = {
  title: string
  description: string
  githubLink?: string
  liveDemoLink?: string
  photos?: string[]
  techStacks?: string[]
  isPublic?: boolean
  communityId?: number
}

export class ApiError extends Error {
  status: number
  details?: string[]

  constructor(message: string, status: number, details?: string[]) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function getToken() {
  return localStorage.getItem('devforge.token')
}

export function getSessionUserId() {
  const value = localStorage.getItem('devforge.userId')
  return value ? Number(value) : null
}

export function saveSession(token: string, userId: number, userName?: string) {
  localStorage.setItem('devforge.token', token)
  localStorage.setItem('devforge.userId', String(userId))
  if (userName) localStorage.setItem('devforge.userName', userName)
}

export function clearSession() {
  localStorage.removeItem('devforge.token')
  localStorage.removeItem('devforge.userId')
  localStorage.removeItem('devforge.userName')
}

export async function apiRequest<T>(path: string, init: RequestInit = {}) {
  const token = getToken()
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type') && init.body) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (response.status === 204) return undefined as T

  let body: unknown = null
  try {
    body = await response.json()
  } catch {
    body = null
  }

  const envelope = body as Partial<ApiEnvelope<T>>
  if (!response.ok || envelope.success === false) {
    const details = Array.isArray(envelope.data) ? (envelope.data as string[]) : undefined
    throw new ApiError(envelope.message ?? 'Request failed', response.status, details)
  }

  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return (body as ApiEnvelope<T>).data
  }

  return body as T
}

export const api = {
  me: () => {
    const userId = getSessionUserId()
    if (!userId) throw new ApiError('No active session', 401)
    return apiRequest<UserProfile>(`/users/${userId}`)
  },
  users: (query = '') => apiRequest<Page<UserSummary>>(`/users?size=40${query}`),
  user: (id: number) => apiRequest<UserProfile>(`/users/${id}`),
  updateUser: (id: number, payload: Partial<UserProfile>) =>
    apiRequest<UserProfile>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  feed: (type: string, page = 0) => {
    const endpoint = type === 'following' ? '/feed/following' : '/feed'
    return apiRequest<Page<FeedPost>>(`${endpoint}?page=${page}&size=20`)
  },
  projects: (params = 'page=0&size=20&sortBy=createdAt&direction=desc') => apiRequest<Page<Project>>(`/projects?${params}`),
  project: (id: number) => apiRequest<Project>(`/projects/${id}`),
  createProject: (userId: number, payload: ProjectPayload) =>
    apiRequest<Project>(`/users/${userId}/projects`, { method: 'POST', body: JSON.stringify(payload) }),
  likeProject: (projectId: number) => apiRequest<void>(`/projects/${projectId}/likes`, { method: 'POST' }),
  unlikeProject: (projectId: number, userId: number) => apiRequest<void>(`/projects/${projectId}/likes/${userId}`, { method: 'DELETE' }),
  likedProjects: (userId: number) => apiRequest<Project[]>(`/users/${userId}/likes`),
  bookmarkProject: (projectId: number) => apiRequest<void>(`/bookmarks/bookmark?projectId=${projectId}`, { method: 'POST' }),
  removeBookmark: (userId: number, projectId: number) => apiRequest<void>(`/bookmarks?userId=${userId}&projectId=${projectId}`, { method: 'DELETE' }),
  bookmarks: (userId: number) => apiRequest<Project[]>(`/bookmarks/${userId}/recent`),

  comments: (projectId: number) => apiRequest<Page<Comment>>(`/comments/projects/${projectId}?size=50&direction=asc`),
  addComment: (projectId: number, content: string) =>
    apiRequest<Comment>('/comments', { method: 'POST', body: JSON.stringify({ projectId, content }) }),

  communities: () => apiRequest<Page<Community>>('/communities?size=50&sortBy=id&direction=asc'),
  community: (id: number) => apiRequest<Community>(`/communities/${id}`),
  communityPosts: (id: number) => apiRequest<Page<Project>>(`/${id}/posts?size=30&sortBy=createdAt&direction=desc`),
  communityMembers: (id: number) => apiRequest<Page<UserProfile>>(`/communities/${id}/members?size=50`),
  createCommunity: (userId: number, payload: CommunityPayload) =>
    apiRequest<Community>(`/users/${userId}/communities`, { method: 'POST', body: JSON.stringify(payload) }),
  updateCommunity: (userId: number, id: number, payload: CommunityPayload) =>
    apiRequest<Community>(`/users/${userId}/communities/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  joinCommunity: (userId: number, id: number) => apiRequest<string>(`/users/${userId}/communities/${id}/join`, { method: 'POST' }),
  leaveCommunity: (userId: number, id: number) => apiRequest<string>(`/users/${userId}/communities/${id}/leave`, { method: 'POST' }),

  follow: (followingId: number) => apiRequest(`/follows`, { method: 'POST', body: JSON.stringify({ followingId }) }),
  unfollow: (followingId: number) => apiRequest(`/follows`, { method: 'DELETE', body: JSON.stringify({ followingId }) }),
  followers: (userId: number) => apiRequest<Page<number>>(`/follows/${userId}/followers`),
  followings: (userId: number) => apiRequest<Page<number>>(`/follows/${userId}/followings`),
}
