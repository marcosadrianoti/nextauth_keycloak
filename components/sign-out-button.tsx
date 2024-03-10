'use client' // Tem que ser client por usar o onClick

import { signOut } from 'next-auth/react'

export function SignOutButton() {
  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <button onClick={handleLogout}>Sair</button>
  )
}
