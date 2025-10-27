
import type { SVGProps } from "react";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 4L8 12V28L24 36L40 28V12L24 4Z"
        fill="#1E293B"
      />
      <path
        d="M24 13L36 19V31L24 37L12 31V19L24 13Z"
        fill="hsl(var(--primary))"
      />
    </svg>
  ),
};
