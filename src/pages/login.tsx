import { type NextPage } from 'next';
import dynamic from 'next/dynamic';

// 動態加載 避免找不到前端的網址列參數
const LoginForm = dynamic(
  () => import('../components/login-form').then((mod) => mod.LoginForm),
  {
    ssr: false,
  }
);

const Login: NextPage = () => {
  return <LoginForm />;
};

export default Login;
