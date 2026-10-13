import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { ChatCircleText, Gift, LockSimple, Truck } from '@/components/ui/icons';
import { site } from '@/config/site';
import { formatPriceShort } from '@/lib/format';

const services = [
  { Icon: Truck, title: 'Islandwide Delivery', text: `Across Trinidad & Tobago. Free on orders over ${formatPriceShort(site.freeDeliveryThreshold)}.` },
  { Icon: ChatCircleText, title: 'Order on WhatsApp', text: 'Send your bag in one message. A person replies, not a bot.' },
  { Icon: Gift, title: 'Gift Wrapping', text: 'Complimentary on request, with a handwritten card.' },
  { Icon: LockSimple, title: 'Secure Ordering', text: 'No card details on this site. Payment is agreed with us directly.' },
];

export function ServiceBar() {
  return (
    <section aria-label="How ordering works" className="border-y border-obsidian/10 bg-ivory">
      <RevealGroup as="ul" className="container-x grid grid-cols-1 divide-y divide-obsidian/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
        {services.map(({ Icon, title, text }, i) => (
          <RevealItem
            as="li"
            key={title}
            index={i}
            className="flex gap-s py-l sm:px-m sm:py-xl lg:border-l lg:border-obsidian/10 lg:first:border-l-0 lg:first:pl-0"
          >
            <Icon size={28} weight="light" aria-hidden="true" className="shrink-0" />
            <div>
              <h3 className="label">{title}</h3>
              <p className="mt-xs text-body-s text-stone">{text}</p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
