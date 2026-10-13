import { site } from '@/config/site';
import { Marquee } from '@/components/motion/Marquee';

export function AnnouncementBar() {
  const items = [...site.announcements, ...site.announcements];
  return (
    <div className="on-dark relative flex h-[var(--announce-h)] items-center bg-obsidian text-ivory">
      <Marquee duration={60} label="Store announcements" className="w-full">
        {items.map((text, i) => (
          <span key={i} className="label flex items-center whitespace-nowrap px-l text-[0.75rem] text-ivory/90">
            {text}
            <span aria-hidden="true" className="ml-l inline-block h-1 w-1 rotate-45 bg-champagne" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}
