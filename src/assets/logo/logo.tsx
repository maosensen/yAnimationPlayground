import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5">
      {/* Brand mark lives in public/logo.svg. SVGs gain nothing from the image
          optimizer, so `unoptimized` serves it verbatim (and avoids needing
          `dangerouslyAllowSVG` in next.config). */}
      <Image
        src="/logo.svg"
        alt="yTemplate"
        width={40}
        height={40}
        priority
        unoptimized
        className="size-10 shrink-0"
      />
      {/* Inherits color so the wordmark adapts to its surface (e.g. light
          text on the dark "apparent" sidebar). */}
      <span className="text-2xl font-bold tracking-tight">
        yTemplate<span className="text-primary">.</span>
      </span>
    </div>
  );
};

export default Logo;
