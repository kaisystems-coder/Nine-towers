import Link from 'next/link';
import { footerNav, site } from '@/config/site';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { FooterWordmark } from './FooterWordmark';
import { FacebookLogo, InstagramLogo, TiktokLogo, WhatsappLogo } from '@/components/ui/icons';
import { buildGeneralMessage, whatsappUrl } from '@/lib/whatsapp';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="on-dark relative overflow-hidden bg-obsidian text-ivory">
      {/* Newsletter */}
      <div className="container-x grid gap-l border-b border-ivory/15 py-2xl md:grid-cols-12 md:gap-m">
        <div className="md:col-span-6 lg:col-span-5">
          <h2 className="font-display text-d-m">
            Join the list<span className="text-champagne">.</span>
          </h2>
          <p className="mt-s max-w-[42ch] text-body text-mist">
            New arrivals and private previews, first.
          </p>
        </div>
        <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8 md:self-end">
          <NewsletterForm tone="dark" source="Footer" />
        </div>
      </div>

      {/* Links */}
      <div className="container-x grid grid-cols-2 gap-x-m gap-y-l py-xl md:grid-cols-12">
        {Object.entries(footerNav).map(([heading, links]) => (
          <nav key={heading} aria-label={heading} className="md:col-span-2">
            <h3 className="label text-mist">{heading}</h3>
            <ul className="mt-s flex flex-col">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-u py-[11px] text-body-s text-ivory/90 hover:text-ivory">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="col-span-2 md:col-span-4 md:col-start-9 md:col-end-13">
          <h3 className="label text-mist">Order on WhatsApp</h3>
          <p className="mt-s max-w-[36ch] text-body-s text-ivory/90">
            Choose your pieces, send your bag on WhatsApp and we’ll confirm stock, delivery and payment in the chat.
          </p>
          <a
            href={whatsappUrl(buildGeneralMessage())}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost-light mt-m"
          >
            <span className="btn-fill" aria-hidden="true" />
            <span className="btn-roll">
              <span className="flex items-center gap-xs">
                <WhatsappLogo size={18} weight="light" aria-hidden="true" /> {site.whatsappDisplay}
              </span>
              <span className="flex items-center gap-xs" aria-hidden="true">
                <WhatsappLogo size={18} weight="light" /> {site.whatsappDisplay}
              </span>
            </span>
          </a>
          <ul className="mt-m flex items-center gap-xs" aria-label="Social">
            {[
              { href: site.socials.instagram, label: 'Instagram', Icon: InstagramLogo },
              { href: site.socials.facebook, label: 'Facebook', Icon: FacebookLogo },
              { href: site.socials.tiktok, label: 'TikTok', Icon: TiktokLogo },
            ].map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} on ${label}`}
                  className="-ml-[10px] inline-flex h-11 w-11 items-center justify-center rounded-full text-ivory/90 transition-transform duration-fast ease-brand hover:text-champagne active:scale-90"
                >
                  <Icon size={22} weight="light" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <FooterWordmark />

      <div className="container-x flex flex-col gap-xs border-t border-ivory/15 py-m text-caption text-mist md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {site.name}. {site.country}.
        </p>
        <p>Payment arranged on WhatsApp. No card details are taken on this site.</p>
      </div>
    </footer>
  );
}
