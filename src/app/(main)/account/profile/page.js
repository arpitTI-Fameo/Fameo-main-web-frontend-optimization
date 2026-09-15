import Profile from '@/modules/Main/Account/Profile';
import { getProfileServerAction } from '@/lib/services/main/user.server';

export default async function ProfilePage() {
  const profile = await getProfileServerAction().catch(() => null);
  return <Profile initialData={profile} />;
}
