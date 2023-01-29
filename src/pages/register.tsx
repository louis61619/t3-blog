import { type NextPage } from 'next';
import { api } from '../utils/api';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import type { CreateUserInput } from '../schema/user';
import { Button } from '../components/button';
import { Input } from '../components/input';
import { useRouter } from 'next/router';

const Register: NextPage = () => {
  const { register, handleSubmit } = useForm<CreateUserInput>();
  const router = useRouter()
  const { mutate, error } = api.user.registerUser.useMutation({
    // onError: (error) => {},
    onSuccess: () => {
      // try {
      //   router.push('/login')
      // } catch (error) {

      // }
      router.push('/login').catch((err) => {
        console.log(err);
      });
    },
  });

  function onSubmit(values: CreateUserInput) {
    mutate(values);
  }

  return (
    <>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        {error && error.message}
        <h1>Register</h1>
        <Input
          type="email"
          placeholder="xxx@sample.com"
          {...register('email')}
        />
        <br />
        <Input type="text" placeholder="Tom" {...register('name')} />
        <Button type="submit">Register</Button>
      </form>
      <Link href="/login">Login</Link> */}
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Register your account
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
                <label
                  htmlFor="email-address"
                  className="sr-only"
                  {...register('email')}
                >
                  Email address
                </label>
                <input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                  {...register('email')}
                />
              </div>
              <div>
                <label htmlFor="name" className="sr-only">
                  name
                </label>
                <input
                  id="name"
                  type="name"
                  autoComplete="current-name"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Name"
                  {...register('name')}
                />
              </div>
            </div>
            <div className="flex h-10 items-center text-xs font-bold text-red-600">
              {error && error.message}
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Register
              </button>
            </div>
          </form>
          <div className="flex justify-end">
            <div className="text-sm">
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
