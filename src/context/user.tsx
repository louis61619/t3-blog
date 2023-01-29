import React, { useContext } from 'react';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from '../server/api/root';

type RouterOutput = inferRouterOutputs<AppRouter>;

const UserContext = React.createContext<RouterOutput['user']['me'] | null>(
  null
);

function UserContextProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: RouterOutput['user']['me'] | null | undefined;
}) {
  return (
    <UserContext.Provider value={value || null}>
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { UserContextProvider, useUserContext };
