"use client";

import {FC, FormEventHandler, useEffect, useState} from "react";
import {z} from "zod";
import Link from "next/link";
import {useRouter} from "next/navigation";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be at most 30 characters").regex(/^[A-Za-z0-9_]+$/, "Username can only contain alphanumeric characters and underscores."),
  email: z.email("Invalid email address"),
  confirmEmail: z.email(),
  password: z.string().min(12, "Password must be at least 12 characters").max(127, "Password must be at most 127 characters"),
  confirmPassword: z.string()
}).refine(data => data.email === data.confirmEmail, {
  message: "Email addresses do not match",
  path: ['confirmEmail'],
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const RegisterForm: FC = () => {
  // inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // form state
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<z.core.$ZodIssue[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    const validity = schema.safeParse({
      username,
      email,
      confirmEmail,
      password,
      confirmPassword
    });

    setValid(validity.success);
    if (validity.error?.issues) {
      setIssues(validity.error?.issues.filter((issue) => {
        if (issue.path.includes('username') && username.length === 0) return false;
        if (issue.path.includes('email') && email.length === 0) return false;
        if (issue.path.includes('confirmEmail') && confirmEmail.length === 0) return false;
        if (issue.path.includes('password') && password.length === 0) return false;
        if (issue.path.includes('confirmPassword') && confirmPassword.length === 0) return false;
        return true;
      }));
    } else setIssues([]);
  }, [username, email, confirmEmail, password, confirmPassword]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage("");
    fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      })
    })
      .then(async (res) => {
        if (res.status === 201) {
          router.push('/auth/login');
        } else {
          const json = await res.json();
          setErrorMessage(json.error ?? json.message ?? 'An unknown error occurred. Please try again later.');
        }
      })
      .catch((e) => {
        console.error(e);
        setErrorMessage('An unknown error occurred. Please try again later.');
      }).finally(() => {
        setLoading(false);
      })
  }

  return <form className='bg-neutral-900 p-4 rounded-xl flex flex-col gap-2' onSubmit={submit}>
    <label htmlFor='username'>Username</label>
    <input
      id='username'
      name='username'
      type='text'
      placeholder='Username'
      value={username}
      onChange={e => setUsername(e.target.value)}
      className='bg-neutral-800 p-2 rounded-md min-w-100'
    />
    {issues.filter(i => i.path.includes('username')).map((issue) => {
      return <p key={issue.message} className='text-red-500 text-sm'>{issue.message}</p>
    })}
    <label htmlFor='email'>Email</label>
    <input
      id='email'
      name='email'
      type='email'
      placeholder='Email'
      value={email}
      onChange={e => setEmail(e.target.value)}
      className='bg-neutral-800 p-2 rounded-md min-w-100'
    />
    {issues.filter(i => i.path.includes('email') && !i.path.includes('confirmEmail')).map((issue) => {
      return <p key={issue.message} className='text-red-500s'>{issue.message}</p>
    })}
    <label htmlFor='confirmEmail'>Confirm Email</label>
    <input
      id='confirmEmail'
      name='confirmEmail'
      type='email'
      placeholder='Confirm Email'
      value={confirmEmail}
      onChange={e => setConfirmEmail(e.target.value)}
      className='bg-neutral-800 p-2 rounded-md min-w-100'
    />
    {issues.filter(i => i.path.includes('confirmEmail')).map((issue) => {
      return <p key={issue.message} className='text-red-500'>{issue.message}</p>
    })}
    <label htmlFor='password'>Password</label>
    <input
      id='password'
      name='password'
      type='password'
      placeholder='Password'
      value={password}
      onChange={e => setPassword(e.target.value)}
      className='bg-neutral-800 p-2 rounded-md min-w-100'
    />
    {issues.filter(i => i.path.includes('password') && !i.path.includes('confirmPassword')).map((issue) => {
      return <p key={issue.message} className='text-red-500'>{issue.message}</p>
    })}
    <label htmlFor='confirmPassword'>Confirm Password</label>
    <input
      id='confirmPassword'
      name='confirmPassword'
      type='password'
      placeholder='Confirm Password'
      value={confirmPassword}
      onChange={e => setConfirmPassword(e.target.value)}
      className='bg-neutral-800 p-2 rounded-md min-w-100'
    />
    {issues.filter(i => i.path.includes('confirmPassword')).map((issue) => {
      return <p key={issue.message} className='text-red-500'>{issue.message}</p>
    })}
    <div className='flex gap-4 items-center pt-4'>
      <button
        type='submit'
        disabled={!valid || loading}
        className='bg-blue-500 hover:bg-blue-600  p-2 rounded-md disabled:opacity-80'
      >
        Register
      </button>
      <span>Already have an account? <Link href='/src/app/(unauthenticated)/auth/login' className='text-blue-400 hover:text-blue-500 hover:underline'>Log in</Link>.</span>
    </div>
    {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
  </form>
}

export default RegisterForm;
