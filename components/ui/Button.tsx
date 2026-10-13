import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost-light';

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  'ghost-light': 'btn-ghost-light',
};

function Inner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span className="btn-fill" aria-hidden="true" />
      <span className="btn-roll">
        <span className="flex items-center justify-center gap-xs">
          {children}
          {icon}
        </span>
        <span className="flex items-center justify-center gap-xs" aria-hidden="true">
          {children}
          {icon}
        </span>
      </span>
    </>
  );
}

/**
 * Brand buttons. Primary = Obsidian fill. Secondary = Cream fill / outline.
 * One primary per area. Hover: a rising fill and rolling label.
 */
export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className,
  icon,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  icon?: ReactNode;
  external?: boolean;
  onClick?: () => void;
  'data-cursor'?: string;
}) {
  const cls = cn('btn', variantClass[variant], className);
  if (external)
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        <Inner icon={icon}>{children}</Inner>
      </a>
    );
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

export function Button({
  children,
  variant = 'primary',
  className,
  icon,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <button type="button" className={cn('btn', variantClass[variant], className)} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}
