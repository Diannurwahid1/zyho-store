'use client'

import type { User } from '@/payload-types'

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

// eslint-disable-next-line no-unused-vars
type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void> // eslint-disable-line no-unused-vars

type Login = (args: { email: string; password: string }) => Promise<User> // eslint-disable-line no-unused-vars

type Logout = () => Promise<void>

type AuthContext = {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: User | null) => void // eslint-disable-line no-unused-vars
  authReady: boolean
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)
const apiPath = (path: string) => `/api${path.startsWith('/') ? path : `/${path}`}`

const parseResponseMessage = async (res: Response, fallback: string) => {
  const contentType = res.headers.get('content-type') || ''

  try {
    if (contentType.includes('application/json')) {
      const data = await res.json()
      const message =
        data?.errors?.[0]?.message ||
        data?.message ||
        data?.error ||
        data?.reason ||
        fallback

      if (/email or password provided is incorrect/i.test(String(message))) {
        return 'Email atau password salah. Jika akun dibuat lewat Google, lanjutkan dengan Google atau reset password.'
      }

      return String(message)
    }

    const text = await res.text()
    if (text) return text
  } catch {
    // Ignore response parsing failures and use the fallback message below.
  }

  return fallback
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  const [authReady, setAuthReady] = useState(false)
  const authGeneration = useRef(0)

  // used to track the single event of logging in or logging out
  // useful for `useEffect` hooks that should only run once
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>()
  const create = useCallback<Create>(async (args) => {
    try {
      const res = await fetch(apiPath('/users/create'), {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
          passwordConfirm: args.passwordConfirm,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus('loggedIn')
        authGeneration.current += 1
      } else {
        throw new Error(await parseResponseMessage(res, 'Gagal membuat akun.'))
      }
    } catch (e) {
      throw e instanceof Error ? e : new Error('Gagal membuat akun.')
    }
  }, [])

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(apiPath('/users/login'), {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { errors, user } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(user)
        setStatus('loggedIn')
        authGeneration.current += 1
        return user
      }

      throw new Error(await parseResponseMessage(res, 'Gagal masuk.'))
    } catch (e) {
      throw e instanceof Error ? e : new Error('Gagal masuk.')
    }
  }, [])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(apiPath('/users/logout'), {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        setUser(null)
        setStatus('loggedOut')
        authGeneration.current += 1
      } else {
        throw new Error('An error occurred while attempting to logout.')
      }
    } catch (e) {
      throw new Error('An error occurred while attempting to logout.')
    }
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      const requestGeneration = authGeneration.current
      try {
        const res = await fetch(apiPath('/users/me'), {
          cache: 'no-store',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })

        if (res.ok) {
          const { user: meUser } = await res.json()
          if (requestGeneration === authGeneration.current) {
            setUser(meUser || null)
            setStatus(meUser ? 'loggedIn' : undefined)
          }
        } else {
          if (requestGeneration === authGeneration.current) {
            setUser(null)
            setStatus(undefined)
          }
        }
      } catch (_) {
        if (requestGeneration === authGeneration.current) {
          setUser(null)
          setStatus(undefined)
        }
      } finally {
        setAuthReady(true)
      }
    }

    void fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(apiPath('/users/forgot-password'), {
        body: JSON.stringify({
          email: args.email,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
      } else {
        throw new Error(await parseResponseMessage(res, 'Gagal mengirim email reset password.'))
      }
    } catch (e) {
      throw e instanceof Error ? e : new Error('Gagal mengirim email reset password.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(apiPath('/users/reset-password'), {
        body: JSON.stringify({
          password: args.password,
          passwordConfirm: args.passwordConfirm,
          token: args.token,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { data, errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(data?.loginUser?.user)
        setStatus(data?.loginUser?.user ? 'loggedIn' : undefined)
        authGeneration.current += 1
      } else {
        throw new Error(await parseResponseMessage(res, 'Gagal mereset password.'))
      }
    } catch (e) {
      throw e instanceof Error ? e : new Error('Gagal mereset password.')
    }
  }, [])

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        resetPassword,
        setUser,
        authReady,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

type UseAuth<T = User> = () => AuthContext // eslint-disable-line no-unused-vars

export const useAuth: UseAuth = () => useContext(Context)
