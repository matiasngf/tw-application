interface Project {
  title: string;
  /** Link to project */
  link: string;
  /** Link to awwwards page */
  awwardsLink?: string;
  /** has won SOTD */
  sotd?: boolean;
  /** has won Honorable mention */
  hm?: boolean;
  /** Link to SOTD */
  fwaLink?: string;
  /** has won WFA of the day */
  fwa?: boolean;
  /** Link to image */
  image?: string;
}

export const projects: Record<string, Project> = {
  ship: {
    title: "Vercel ship",
    link: "https://vercel.com/ship",
    awwardsLink: "https://www.awwwards.com/sites/vercel-ship",
  },
  kidsuper: {
    title: "Kidsuper World",
    link: "https://kidsuper.world//",
    awwardsLink: "https://www.awwwards.com/sites/kidsuper-world",
    sotd: true,
    fwaLink: "https://thefwa.com/cases/kidsuper-world",
    fwa: true,
  },
  chronicles: {
    title: "Basement chronicles",
    link: "https://chronicles.basement.studio/",
    awwardsLink: "https://www.awwwards.com/sites/basement-chronicles",
    sotd: true,
    fwaLink: "https://thefwa.com/cases/basement-chronicles",
    fwa: true,
  },
};
