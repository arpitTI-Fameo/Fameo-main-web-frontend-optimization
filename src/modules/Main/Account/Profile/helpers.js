// Pick a browser-usable image. The app's profile_picture is often a local
// device path (/data/user/0/com.fameo.app...) that can't load on web, so prefer
// an http(s) URL: remote profile_picture, then the registration selfie.
export function pickPhoto(profile, registration, entry) {
  const isWeb = (u) => typeof u === "string" && /^https?:\/\//i.test(u);
  return [profile?.profile_picture, entry?.profile_picture, registration?.selfie_image_url]
    .find(isWeb) || null;
}

// Derive initials from a name (or email) for the avatar fallback.
export function initials(profile) {
  const name = profile?.full_name || profile?.username || profile?.email || "";
  const parts = name.trim().split(/[\s._@]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
