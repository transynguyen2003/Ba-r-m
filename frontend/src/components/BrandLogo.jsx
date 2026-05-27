import { Link } from 'react-router-dom';

const logoSrc = '/logo-ban-rem.png';

const sizeClasses = {
  sm: 'h-12 w-auto',
  md: 'h-16 w-auto sm:h-[4.5rem]',
  lg: 'h-24 w-auto sm:h-28',
  xl: 'h-28 w-auto sm:h-32',
};

export default function BrandLogo({
  className = '',
  size = 'md',
  showText = false,
  linkTo = '/',
}) {
  const image = (
    <img
      src={logoSrc}
      alt="Bán Rèm"
      className={`${sizeClasses[size] ?? sizeClasses.md} object-contain`}
    />
  );

  const content = (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {image}
      {showText && (
        <span className="text-lg font-bold text-slate-900">
          Bán <span className="text-amber-600">Rèm</span>
        </span>
      )}
    </span>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }

  return content;
}
