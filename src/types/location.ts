/* eslint-disable @typescript-eslint/no-non-null-assertion */
//* ^^ src/env/client asserts these exist at compile time

export const locations = {
  L1: {
    name: process.env.NEXT_PUBLIC_L1!,
    color: "teal",
  },
  L2: {
    name: process.env.NEXT_PUBLIC_L2!,
    color: "yellow",
  },
  L3: {
    name: process.env.NEXT_PUBLIC_L3!,
    color: "indigo",
  },
  L4: {
    name: process.env.NEXT_PUBLIC_L4!,
    color: "red",
  },
  OTHER: {
    name: "Other",
    color: "neutral",
  },
} as const;
