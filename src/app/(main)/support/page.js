// app/(main)/support/page.js
import SupportCenter from '@/components/support/SupportCenter';

export const metadata = {
  title: 'Support',
  description:
    'Get help with your Fameo account, payments, courses, and the app. Browse common answers or send the Fameo support team a message.',
  alternates: { canonical: '/support' },
};

export default function SupportPage() {
  return <SupportCenter />;
}