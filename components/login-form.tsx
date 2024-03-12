'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react"

export const LoginForm = () => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => { // É assincrona porque enviar dados para o formulário padrão do NextAuth
    e.preventDefault();
    try {
      // signIn('keycloak', { callbackUrl: '/public'}); // não funciona

      const response = await signIn('credentials', {
        email,
        password,
        redirect: false
      })
      console.log('Response', response);

      if (!response?.error) {
        router.push('/private');
        router.refresh();
      } else {
        setError('Email ou senha inválidos');
      }

    } catch (error) {
      console.log('Login Error', error);

    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <form className="p-10 border rounded-lg w-96" onSubmit={handleLogin}>
        <h1 className="text-3xl font-bold mb-5">Login</h1>
        <p className="text-slate-600 text-sm mb-10">Faça login para continuar</p>
        <div className="flex flex-col">
          <div className="flex flex-col gap-1 mb-6">
            <label htmlFor="email">Email</label>
            <input
              className="border rounded p-3 w-full"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1 mb-6">
            <label htmlFor="password">Password</label>
            <input
              className="border rounded p-3 w-full"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <span className="text-red-500 text-sm block mt-2">{error}</span>}
          <button
            type="submit"
            className="mt-10 bg-rose-950 text-slate-50 p-3 rounded"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}