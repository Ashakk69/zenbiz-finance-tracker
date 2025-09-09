import type { SVGProps } from "react";

export function ZenBizLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 16V12" />
      <path d="M12 16V9" />
      <path d="M16 16V14" />
      <path d="M8 10L12 7L16 9L18 7.5" />
    </svg>
  );
}
