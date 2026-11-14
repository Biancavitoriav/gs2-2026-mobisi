export function LogoMark() {
  return <i className="bx bx-accessibility" aria-hidden="true" />;
}

export function SearchIcon() {
  return <i className="bx bx-search" aria-hidden="true" />;
}
export function ArrowLeftIcon() {
  return <i className="bx bx-arrow-left" aria-hidden="true" />;
}
export function HeartIcon({ filled = false }) {
  return (
    <i className={`${filled ? "bxf" : "bx"} bx-heart`} aria-hidden="true" />
  );
}
export function PhoneIcon() {
  return (
    <span className="info-icon">
      <i className="bx bx-phone" aria-hidden="true" />
    </span>
  );
}
export function PinIcon() {
  return (
    <span className="info-icon">
      <i className="bx bx-location-pin" aria-hidden="true" />
    </span>
  );
}
export function GlobeIcon() {
  return (
    <span className="info-icon">
      <i className="bx bx-globe" aria-hidden="true" />
    </span>
  );
}
