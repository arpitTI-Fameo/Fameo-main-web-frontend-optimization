import { buildMetadata } from '@/lib/seo/metadata';
import { ROUTES } from '@/constants/routes';

export const metadata = buildMetadata({
  title: 'Verify Code',
  path: ROUTES.OTP,
  noIndex: true,
});

export default function OTPPage() {
  return (
    <div>
      <h1>OTP Verification</h1>
    </div>
  );
}