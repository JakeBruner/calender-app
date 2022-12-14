// eslint-disable-next-line @typescript-eslint/no-var-requires
// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // the below are for the dynamic styles for the calendar bookings
  safelist: ["bg-indigo-500", "bg-yellow-500", "bg-teal-500", "bg-red-500",
            "text-indigo-100", "text-yellow-100", "text-teal-100", "text-red-100",
            ],
  theme: {
    // extend: {
    //   fontFamily: {
    //     sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
    //   }
    // },
    extend: {
      minHeight: {
        "20": "5rem",
        "28": "7rem",
        "40": "10rem",
      },
      minWidth: {
        "20": "5rem",
        "32": "8rem",
        "44": "11rem",
      },
      maxWidth: {
        "36": "9rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};
