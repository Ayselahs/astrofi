import { useUserContext } from '@/context'
import { LOGOUT_USER } from '@/context/actions'
import { useRouter } from 'next/router'

export default function () {
  const router = useRouter()
  const { dispatch } = useUserContext()
  return async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.status === 200)
        dispatch({ type: LOGOUT_USER })
      router.push('/')
    } catch (err) {
      console.log(err)
    }
  }
}