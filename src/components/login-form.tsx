import { type NextPage } from 'next';
import { api } from '../utils/api';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import type { CreateUserInput } from '../schema/user';
import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Loading } from './loading';
import Modal from './modal';

function VerifyToken({ hash, router }: { hash: string; router: NextRouter }) {
  // const router = useRouter();
  const { data, isLoading } = api.user.verifyOTP.useQuery({
    hash,
  });

  if (data) {
    const url = data.redirect.includes('login') ? '/' : data.redirect || '/';
    router.push(url).catch((err) => {
      console.log(err);
    });
  }

  return (
    <Modal>
      {/* <Loading /> */}
      {isLoading ? 'Verifying...' : 'Redirecting...'}
    </Modal>
  );
}
const LoginForm = () => {
  const { register, handleSubmit } = useForm<CreateUserInput>();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const { error, mutate, isLoading } = api.user.requestOTP.useMutation({
    onSuccess: () => {
      setMessage('Check your email');
    },
    onError(error) {
      setMessage(error.message);
    },
  });

  function onSubmit(values: CreateUserInput) {
    if (isLoading) {
      return;
    }
    mutate(values);
  }

  const hash = router.asPath.split('#token=')[1];

  console.log(router);

  if (hash) {
    return <VerifyToken hash={hash} router={router} />;
  }

  return (
    <>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Login</h1>
        <Input
          type="email"
          placeholder="xxx@sample.com"
          {...register('email')}
        />
        <br />
        <Input type="text" placeholder="Tom" {...register('name')} />
        <Button type="submit">Login</Button>
      </form>
      <Link href="/login">Register</Link> */}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>
          <form
            className="mt-8"
            action="#"
            method="POST"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input type="hidden" name="remember" value="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  {...register('email')}
                />
              </div>
            </div>
            <div className={`flex h-10 items-center text-xs font-bold`}>
              {!isLoading &&
                (error ? (
                  <p className="text-red-600">{message}</p>
                ) : (
                  <p className="text-green-500">{message}</p>
                ))}
            </div>
            <div>
              <button
                type="submit"
                className={`group  relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2${
                  isLoading ? 'pointer-events-none opacity-50' : ''
                }`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  {isLoading && <Loading />}
                </span>
                Sign in
              </button>
            </div>
          </form>
          <div className="flex justify-end">
            <div className="text-sm">
              <Link
                href="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { LoginForm };
