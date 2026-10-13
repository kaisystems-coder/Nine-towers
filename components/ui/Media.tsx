import Image from 'next/image';
import { hasAsset, BLUR_DATA_URL } from '@/lib/assets';
import { cn } from '@/lib/cn';
import { Plate, type PlateProps } from './Plate';

/**
 * Photo when the file exists in /public, neutral plate when it doesn't.
 * Always fills its (relatively positioned) parent.
 */
export function Media({
  src,
  alt,
  sizes = '(min-width: 1024px) 33vw, 50vw',
  priority = false,
  className,
  plate,
  overlay = false,
}: {
  src?: string | null;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
  plate?: PlateProps;
  /** Editorial treatment for type over photography: tone layer + bottom gradient */
  overlay?: boolean;
}) {
  if (!hasAsset(src)) return <Plate {...plate} />;
  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className={cn(className?.includes('object-') ? undefined : 'object-cover', className)}
      />
      {overlay && (
        <>
          <div aria-hidden="true" className="absolute inset-0 bg-cream/30 mix-blend-multiply" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-obsidian/10 to-obsidian/0" />
        </>
      )}
    </>
  );
}
