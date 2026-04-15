"use client";

import {FC, FormEventHandler, useEffect, useState} from "react";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";

const LoginForm: FC = () => {
  // inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // form state
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Get search params for redirect
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setValid(username.length > 0 && password.length > 0);
  }, [username, password]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    // Make API request
    setLoading(true);
    setErrorMessage("");
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
      .then(async (res) => {
        if (res.status === 200) {
          // Login successful, redirect
          if (searchParams.has('redirect')) {
            window.location.replace(searchParams.get('redirect')!);
          } else {
            window.location.replace('/');
          }
        } else {
          // Login failed, show error
          const json = await res.json();
          setErrorMessage(json.error ?? json.message ?? 'An unknown error occurred. Please try again later.');
        }
      })
      .catch((e) => {
        // Log unknown error
        console.error(e);
        setErrorMessage('An unknown error occurred. Please try again later.')
      }).finally(() => {
        setLoading(false);
      });
  }

  return <form className='bg-neutral-900 p-4 rounded-xl flex flex-col gap-2' onSubmit={submit}>
    <label htmlFor='username'>Username</label>
    <input
      id='username'
      name='username'
      type='text'
      placeholder='Username'
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className='bg-neutral-800 p-2 rounded-lg min-w-100'
      autoComplete='username'
    />
    <label htmlFor='password'>Password</label>
    <input
      id='password'
      name='password'
      type='password'
      placeholder='Password'
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className='bg-neutral-800 p-2 rounded-lg min-w-100'
      autoComplete='current-password'
    />
    <div className='flex gap-4 items-center pt-4'>
      <button disabled={!valid || loading} type='submit' className='bg-blue-500 hover:bg-blue-600 p-2 rounded-md disabled:opacity-80'>Login</button>
      <span>Don't have an account? <Link href='/auth/register' className='text-blue-400 hover:text-blue-500 hover:underline'>Create one</Link>.</span>
    </div>
    {errorMessage.length > 0 && <p className='text-red-500'>{errorMessage}</p>}
  </form>
}

export default LoginForm;
