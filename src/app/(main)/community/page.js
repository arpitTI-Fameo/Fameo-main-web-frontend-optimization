// import CommunityLayout from '@/components/community/CommunityLayout';

// export const metadata = {
//   title: 'Community — Fameo',
//   description: 'Connect, collaborate, and grow with creators on Fameo Community.',
// };

// export default function CommunityPage({ searchParams }) {
//   return <CommunityLayout initialPage="home" searchParams={searchParams} />;
// }
// app/(main)/community/page.js
import CommunityLayout from '@/components/community/CommunityLayout';

export const metadata = { title: 'Community — Fameo' };

export default function CommunityPage({ searchParams }) {
  return <CommunityLayout initialPage="home" searchParams={searchParams} />;
}