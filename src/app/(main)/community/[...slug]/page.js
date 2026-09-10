import CommunityLayout from '@/modules/Main/Community';

export default function CommunitySlugPage({ params, searchParams }) {
  const slug = params?.slug || [];
  // slug[0] = subpage: 'spaces', 'feedback', 'events', 'safety', 'profile'
  // slug[1] = id (spaceId, userId, eventId)
  const pageMap = {
    spaces: 'spaces',
    feedback: 'feedback',
    events: 'events',
    safety: 'safety',
    profile: 'profile',
  };
  const initialPage = pageMap[slug[0]] || 'home';
  return <CommunityLayout initialPage={initialPage} subId={slug[1]} searchParams={searchParams} />;
}