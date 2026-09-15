import Profile from '@/modules/Main/Account/Profile';
import { getWebProfileServerAction } from '@/lib/services/main/user.server';

export default async function ProfilePage() {
  // Must be the SAME shape the client hook returns, or initialData hands the
  // component something it cannot read. This used to prefetch the MAIN API's
  // account record while the component parsed the APP backend's web profile.
  const profile = await getWebProfileServerAction().catch(() => null);
  console.log(profile)
  return <Profile initialData={profile} />;
}
