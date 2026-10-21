import { Image } from '@/components/ui/image';

export const ACADEMY_LOGO_URL =
  'https://media.base44.com/images/public/6ad84692ebac5a469373d0ee/698c91a88_eac8b730-de43-4208-ab88-8704ddedcb85.png';

/** The academy's circular eagle logo, used across the website, portals and sign-in pages. */
export default function AcademyLogo({ className = 'h-10 w-10' }) {
  return (
    <span className={`inline-block shrink-0 overflow-hidden rounded-full bg-white shadow-sm ${className}`}>
      <Image src={ACADEMY_LOGO_URL} alt="T.I.P.S. Academy logo" fittingType="fit" className="h-full w-full" />
    </span>
  );
}