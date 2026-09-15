import { buildMetadata } from '@/lib/seo/metadata';

export const metadata = buildMetadata({
  title: 'Verify Code',
  path: '/otp',
  noIndex: true,
});

export default function OTPPage() {
  return (
    <div>
      <h1>OTP Verification</h1>
    </div>
  );
}