import { type NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

import { api } from '../utils/api';
import { useUserContext } from '../context/user';
import { LoginForm } from '../components/login-form';

const Home: NextPage = () => {
  const user = useUserContext();

  if (!user) {
    return <LoginForm />;
  }
  return (
    <div>
      <Link href={'/posts/new'}>create post</Link>
    </div>
  );
};

export default Home;
