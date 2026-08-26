import { FacebookLogo, InstagramLogo, YoutubeLogo } from "@phosphor-icons/react/ssr";

export function getSocialLinks(content: {
  social_facebook: string;
  social_instagram: string;
  social_youtube: string;
}) {
  return [
    { href: content.social_facebook, label: "Facebook", Icon: FacebookLogo },
    { href: content.social_instagram, label: "Instagram", Icon: InstagramLogo },
    { href: content.social_youtube, label: "YouTube", Icon: YoutubeLogo },
  ].filter((link) => link.href);
}
