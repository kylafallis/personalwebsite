// ============================================================
// data.js — Kyla Fallis Portfolio: Single Source of Truth
// To update the site, edit this file only.
// ============================================================

const SITE_DATA = {

  // ── PERSONAL ────────────────────────────────────────────────
  name: "Kyla Fallis",
  title: "Environmental Engineer · Researcher · Builder",
  tagline: "I work at the intersection of deep-sea electrochemistry, renewable energy, and global health policy — building systems that close the gap between what science knows and what the world does.",
  email_form_endpoint: "https://formspree.io/f/YOUR_FORM_ID", // ← Replace with your Formspree endpoint
  linkedin: "https://linkedin.com/in/kylafallis07",
  github: "https://github.com/kylafallis",
  fairgame: "https://fairgameinitiative.org",
  resume: "/files/Kyla_Fallis_Resume.pdf",
  cv: "/files/Kyla_Fallis_CV.pdf",

  // ── RESEARCH ────────────────────────────────────────────────
  research: [
    {
      id: "dark-oxygen",
      title: "A Novel Hybrid ML/DL Framework for Assessing Dark Oxygen Flux Production",
      journal: "IEEE",
      status: "In Press — Summer 2026",
      coauthors: "Simar Singh Rayat, Susheela Dahiya",
      summary: "Developed a hybrid machine learning and deep learning framework to calculate dark oxygen production (DOP) flux within the Clarion-Clipperton Zone — the world's most targeted deep-sea mining region. The model quantifies potential catastrophic effects of seabed mining on this newly discovered oxygen-generating ecosystem.",
      tags: ["Machine Learning", "Deep Learning", "Oceanography", "Deep-Sea Mining"],
      pdf: null // Add path when available: "/files/papers/dark-oxygen-ieee.pdf"
    },
    {
      id: "tidal-energy",
      title: "A Novel Physics-Informed Deep Learning Framework for Tidal Energy Site Selection",
      journal: "Springer",
      status: "In Press — Spring 2026",
      coauthors: null,
      summary: "Designed a physics-informed deep learning algorithm that identifies optimal geographic sites for tidal energy production, integrating hydrodynamic constraints directly into the neural architecture to improve site prediction accuracy.",
      tags: ["Deep Learning", "Renewable Energy", "Tidal Energy", "Physics-Informed ML"],
      pdf: null
    },
    {
      id: "mfc-research",
      title: "Electrogenic Biotransformation of Organic Substrates",
      journal: "Sustentabilis Terra",
      status: "Published — Vol. 3, Issue 2 (2025)",
      coauthors: null,
      summary: "Independent research investigating low-cost renewable energy through compost-powered microbial fuel cells (MFCs). Designed and fabricated prototypes, conducted controlled electrochemical experiments, and analyzed voltage output and substrate longevity to optimize decentralized energy generation.",
      tags: ["Microbial Fuel Cells", "Renewable Energy", "Electrochemistry", "Independent Research"],
      pdf: null // Add: "/files/papers/mfc-sustentabilis.pdf"
    }
  ],

  // ── PROJECTS ────────────────────────────────────────────────
  projects: [
    {
      id: "wastewise",
      title: "WasteWise AI",
      category: "Software",
      role: "Project Lead",
      date: "April 2024",
      description: "AI-powered waste sorting system that uses computer vision to classify incoming items as organic waste, recyclables, or landfill trash — reducing contamination and methane emissions at scale.",
      tech: ["Machine Learning", "Computer Vision", "Python"],
      award: "1st Place, Ohio 4-H AI Competition · National Qualifier",
      link: "/project/Software/wastewise.html"
    },
    {
      id: "aquatracker",
      title: "AquaTracker",
      category: "Engineering",
      role: "Team Engineer",
      date: "October 2024",
      description: "Autonomous water quality monitoring device that measures salinity, pH, and temperature in real time. Integrated environmental sensors with a microcontroller and developed C++ firmware for automated data collection.",
      tech: ["C++", "SolidWorks", "Sensor Integration", "Circuit Design"],
      award: null,
      link: "/project/design/Aquatracker.html"
    },
    {
      id: "lyka-lamp",
      title: "LYKA Lamp",
      category: "Engineering",
      role: "Lead Designer",
      date: "May 2024",
      description: "Renewable energy lighting system powered entirely by compost-based microbial fuel cells. Designed circuitry with capacitors and voltage boost converters to store and regulate power output from biological processes.",
      tech: ["Circuit Design", "MFC Fabrication", "Power Electronics"],
      award: null,
      link: "/project/design/LYKA.html"
    },
    {
      id: "class-companion",
      title: "Class Companion",
      category: "Software",
      role: "Lead Developer",
      date: "In Development",
      description: "Academic collaboration hub connecting students for study groups and resource sharing. Developing the full-stack user interface and backend architecture to support real-time, course-specific interaction.",
      tech: ["JavaScript", "Firebase", "HTML/CSS"],
      award: null,
      link: null
    },
    {
      id: "pythagoras-plains",
      title: "Pythagoras Plains",
      category: "Software",
      role: "Programmer",
      date: "Nov–Dec 2024",
      description: "Educational RPG built in MATLAB for a university engineering course. Players solve math problems to defeat enemies, with adaptive difficulty and interactive storylines to sustain engagement.",
      tech: ["MATLAB"],
      award: null,
      link: "/project/Software/pythagorasplains.html"
    }
  ],

  // ── FAIRGAME ─────────────────────────────────────────────────
  fairgame: {
    title: "FairGame Initiative",
    role: "Founder & Executive Director",
    date: "November 2025 – Present",
    url: "https://fairgameinitiative.org",
    description: "FairGame is a nonprofit organization dedicated to bridging equity gaps in STEM education. As Founder and Executive Director, Kyla manages a five-person team, oversees nonprofit finances and legal operations, and directs outreach programs across more than 10 school science fairs — giving students access to resources, mentorship, and opportunities they otherwise wouldn't have.",
    highlights: [
      "Manages 5-person team across operations, outreach, and programming",
      "Oversees nonprofit finances, legal compliance, and organizational strategy",
      "Directed outreach across 10+ school science fairs",
      "Bridges resource gaps for underserved students in STEM competitions"
    ]
  },

  // ── PUBLIC SPEAKING ──────────────────────────────────────────
  speaking: [
    {
      event: "COSI Big Science Day",
      org: "Center of Science and Industry",
      location: "Columbus, OH",
      description: "Invited panelist representing student research and STEM innovation to a public audience at Ohio's premier science museum event."
    },
    {
      event: "Ohio Academy of Science — State Science Day",
      org: "Ohio Academy of Science",
      location: "Columbus, OH",
      description: "Presented original research to a statewide panel of scientists and educators; recipient of multiple Superior ratings and the OAS President's Award."
    },
    {
      event: "Rotary Club Presentations",
      org: "Rotary International",
      location: "Allen County, OH",
      description: "Delivered presentations on research, environmental engineering, and STEM advocacy to community and civic leaders."
    },
    {
      event: "Allen County Juvenile Court Retreat",
      org: "Allen County Juvenile Court",
      location: "Allen County, OH",
      description: "Selected speaker at a youth-focused retreat, addressing themes of leadership, STEM opportunity, and community engagement."
    },
    {
      event: "UNA-USA Leadership Summit",
      org: "United Nations Association – USA",
      location: "National",
      description: "Represented The Ohio State University at the national UNA-USA Leadership Summit, engaging on global policy, diplomacy, and multilateral advocacy."
    },
    {
      event: "International Science and Engineering Fair (ISEF)",
      org: "Society for Science",
      location: "International",
      description: "Presented original research to international judges and scientists at the world's largest pre-collegiate science competition."
    }
  ],

  // ── AWARDS ──────────────────────────────────────────────────
  awards: [
    { title: "IFoRE 2025 Finalist", org: "International", level: "international" },
    { title: "EPA Award", org: "U.S. Environmental Protection Agency", level: "national" },
    { title: "International Science and Engineering Fair (ISEF) Qualifier", org: "Society for Science", level: "international" },
    { title: "National Youth Science Camp — Ohio Delegate", org: "NYSC", level: "national" },
    { title: "AJAS Fellow", org: "American Junior Academy of Science", level: "national" },
    { title: "Melvin Scholar", org: "Ohio Academy of Science", level: "state" },
    { title: "OAS President's Award", org: "Ohio Academy of Science", level: "state" },
    { title: "Governor's Thomas Edison Award for Excellence in STEM", org: "State of Ohio", level: "state" },
    { title: "Distinguished Young Woman of Allen County", org: "DYW Program", level: "regional" },
    { title: "Class Valedictorian", org: "Bath High School", level: "academic" },
    { title: "1st Place, Ohio 4-H AI Competition", org: "Ohio 4-H", level: "state" },
    { title: "5× Superior Ratings, State Science Fair", org: "Ohio Academy of Science", level: "state" }
  ],

  // ── INVOLVEMENT ──────────────────────────────────────────────
  involvement: [
    {
      org: "OSU Collegiate Council on World Affairs (CCWA) — Model UN",
      role: "Competitor & Member",
      description: "Competes on Ohio State's Model UN team, engaging in diplomatic simulations and policy debates. Active member of the United Nations Association, advocating for diplomacy and human rights."
    },
    {
      org: "Undergraduate Student Government — Sustainability Issues Team",
      role: "Member",
      description: "Selected for OSU's sustainability committee to advance student-driven policy recommendations and integrate sustainable practices into university operations."
    },
    {
      org: "Society of Women Engineers (SWE)",
      role: "Member",
      description: "Focused on community building and outreach to advance gender equity in engineering."
    },
    {
      org: "Engineers for a Sustainable World",
      role: "Member",
      description: "Collaborates on implementing sustainable engineering principles and devices."
    }
  ]
};
