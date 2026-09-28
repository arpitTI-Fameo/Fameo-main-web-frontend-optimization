import LoginContent from "@/modules/Auth/Login";

import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Sign In',
  description:
    'Sign in to your Fameo account.',
  path: ROUTES.LOGIN,
});

export default function LoginPage() {
  return (
    <LoginContent />
  );
}
