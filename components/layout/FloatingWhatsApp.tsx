'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { WhatsappLogo } from '@/components/ui/icons';
import { buildGeneralMessage, whatsappUrl } from '@/lib/whatsapp';
import { useUI } from '@/lib/ui-store';
import { EASE } from '@/lib/motion';
import { cn } from '@/lib/cn';

/** Bottom-right chat button. Hidden while the bag or any overlay is open. */
export function FloatingWhatsApp() {
  const hidden = useUI((s) => s.cartOpen || s.menuOpen || s.searchOpen);
  const raised = useUI((s) => s.stickyBarVisible);
  // Product pages carry their own WhatsApp button; on phones the FAB would cover Add to Bag.
  const onProduct = usePathname().startsWith('/product/');

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.a
          key="wa"
          href={whatsappUrl(buildGeneralMessage())}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className={cn(
            'group fixed right-s z-fab flex h-14 w-14 items-center justify-center rounded-full bg-obsidian text-ivory shadow-floating md:right-l',
            onProduct && 'max-lg:hidden'
          )}
          style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1, y: raised ? -76 : 0 }}
          whileTap={{ scale: 0.94 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <WhatsappLogo size={26} weight="light" />
          <span className="label pointer-events-none absolute right-full mr-s hidden translate-x-2 whitespace-nowrap rounded-xs bg-obsidian px-s py-xs text-ivory opacity-0 transition-[transform,opacity] duration-base ease-brand hover-fine:block hover-fine:group-hover:translate-x-0 hover-fine:group-hover:opacity-100">
            Chat with us
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
