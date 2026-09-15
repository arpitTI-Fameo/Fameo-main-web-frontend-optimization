import LoginContent from "@/modules/Auth/Login";

import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Sign In',
  description:
    'Sign in to your Fameo account.',
  path: '/login',
});

export default function LoginPage() {
  return (
    <LoginContent />
  );
}
