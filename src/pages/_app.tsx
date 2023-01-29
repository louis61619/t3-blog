import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

import { api } from '../utils/api';

import '../styles/globals.css';
import Modal from '../components/modal';
import { UserContextProvider } from '../context/user';

const MyApp: AppType = ({ Component, pageProps }) => {
  const { data, error, isLoading } = api.user.me.useQuery();

  if (isLoading) {
    return <Modal>Loading user..</Modal>;
  }

  return (
    <UserContextProvider value={data}>
      <Component {...pageProps} />
    </UserContextProvider>
  );
};

export default api.withTRPC(MyApp);
