// ============================================================
// data.js — Kyla Fallis Portfolio: Single Source of Truth
// To update the site, edit this file only.
// ============================================================

const SITE_DATA = {

  // ── PERSONAL ────────────────────────────────────────────────
  name:        "Kyla Fallis",
  title:       "Environmental Engineer · Researcher · Builder",
  tagline:     "I work at the intersection of deep-sea electrochemistry, renewable energy, and global policy — building systems that close the gap between what science knows and what the world does.",
  linkedin:    "https://linkedin.com/in/kylafallis07",
  github:      "https://github.com/kylafallis",
  fairgame:    "https://fairgameinitiative.org",
  resume:      "/files/Kyla_Fallis_Resume.pdf",
  cv:          "/files/Kyla_Fallis_CV.pdf",
  cal:         "kylafallis", // ← your Cal.com username

  // ── AS SEEN IN ───────────────────────────────────────────────
  // Add/remove entries here. url: null = placeholder (no link)
  as_seen_in: [
    {
      source:   "Hometown Stations",
      title:    "Powering Tomorrow with Compost: Bath Senior Advances to ISEF",
      type:     "News",
      url:      "https://www.hometownstations.com/news/allen_county/powering-tomorrow-with-compost-bath-high-school-senior-advances-to-international-science-fair/article_f99a4d35-c043-4add-93e2-ee4ebaf897bd.html"
    },
    {
      source:   "Lima Ohio News",
      title:    "Bath's Fallis a Finalist in State Science Fair",
      type:     "News",
      url:      "https://www.limaohio.com/news/2025/03/11/baths-fallis-a-finalist-in-state-science-fair/"
    },
    {
      source:   "YouTube",
      title:    "Kyla Fallis — Speaking Engagement",
      type:     "Video",
      url:      "https://www.youtube.com/watch?v=DCksEBo1YXc"
    },
    {
      source:   "Sustentabilis Terra",
      title:    "Electrogenic Biotransformation of Organic Substrates · Vol. 3, Issue 2",
      type:     "Publication",
      url:      null // ← Add publication URL when available
    },
    {
      source:   "IEEE",
      title:    "Hybrid ML/DL Framework for Dark Oxygen Flux Production · In Press 2026",
      type:     "Publication",
      url:      null // ← Add when published
    },
    {
      source:   "Springer",
      title:    "Physics-Informed DL for Tidal Energy Site Selection · In Press 2026",
      type:     "Publication",
      url:      null // ← Add when published
    }
  ],

  // ── RESEARCH ────────────────────────────────────────────────
  research: [
    {
      id:         "dark-oxygen",
      title:      "A Novel Hybrid ML/DL Framework for Assessing Dark Oxygen Flux Production",
      journal:    "IEEE",
      status:     "In Press — Summer 2026",
      coauthors:  "Simar Singh Rayat, Susheela Dahiya",
      summary:    "Developed a hybrid machine learning and deep learning framework to quantify dark oxygen production (DOP) flux within the Clarion-Clipperton Zone — the world's most targeted region for commercial deep-sea mining. The model maps potential ecological consequences of seabed mining on this newly discovered oxygen-generating ecosystem and serves as a decision-support tool for international mining policy.",
      tags:       ["Machine Learning", "Deep Learning", "Oceanography", "Deep-Sea Mining Policy"],
      pdf:        null
    },
    {
      id:         "tidal-energy",
      title:      "A Novel Physics-Informed Deep Learning Framework for Tidal Energy Site Selection",
      journal:    "Springer",
      status:     "In Press — Spring 2026",
      coauthors:  null,
      summary:    "Introduces a physics-informed deep learning algorithm that embeds hydrodynamic governing equations directly into the neural architecture for tidal energy site selection. By constraining predictions to physically plausible outcomes, the framework outperforms purely data-driven approaches — providing spatially explicit recommendations for offshore tidal energy deployment.",
      tags:       ["Physics-Informed ML", "Tidal Energy", "Renewable Energy", "Hydrodynamics"],
      pdf:        null
    },
    {
      id:         "mfc-research",
      title:      "Electrogenic Biotransformation of Organic Substrates",
      journal:    "Sustentabilis Terra",
      status:     "Published — Vol. 3, Issue 2 (2025)",
      coauthors:  null,
      summary:    "Independent investigation into compost-powered microbial fuel cells as low-cost, decentralized renewable energy. Designed and fabricated prototypes, conducted controlled electrochemical experiments, and analyzed voltage output and substrate longevity across 18 months of research. Earned the EPA Award and ISEF qualification; directly informed the LYKA Lamp proof-of-concept.",
      tags:       ["Microbial Fuel Cells", "Bioelectrochemistry", "Decentralized Energy", "Renewable Energy"],
      pdf:        null
    }
  ],

  // ── PROJECTS ────────────────────────────────────────────────
  projects: [
    {
      id:          "wastewise",
      title:       "WasteWise AI",
      category:    "Software",
      role:        "Project Lead",
      date:        "April 2024",
      description: "AI-powered waste sorting system using computer vision to classify items as organic, recyclable, or landfill — reducing contamination and methane emissions at the point of disposal.",
      tech:        ["Machine Learning", "Computer Vision", "Python"],
      award:       "1st Place, Ohio 4-H AI Competition · National Qualifier",
      status:      null
    },
    {
      id:          "aquatracker",
      title:       "AquaTracker",
      category:    "Engineering",
      role:        "Team Engineer",
      date:        "October 2024",
      description: "Autonomous water quality monitoring device measuring salinity, pH, and temperature in real time. Integrated environmental sensors with a microcontroller and wrote C++ firmware for automated data logging.",
      tech:        ["C++", "SolidWorks", "Sensor Integration", "Circuit Design"],
      award:       null,
      status:      null
    },
    {
      id:          "lyka-lamp",
      title:       "LYKA Lamp",
      category:    "Engineering",
      role:        "Lead Designer",
      date:        "May 2024",
      description: "Renewable energy lamp powered by compost-based microbial fuel cells. Designed circuitry with capacitors and voltage boost converters to store and regulate biological power output.",
      tech:        ["Circuit Design", "MFC Fabrication", "Power Electronics"],
      award:       null,
      status:      null
    },
    {
      id:          "class-companion",
      title:       "Class Companion",
      category:    "Software",
      role:        "Lead Developer",
      date:        "In Development",
      description: "Academic collaboration hub connecting students for study groups and resource sharing. Full-stack: real-time interaction, course-specific groupings, mobile-first UI.",
      tech:        ["JavaScript", "Firebase", "HTML/CSS"],
      award:       null,
      status:      "In Development"
    },
    {
      id:          "ai-research-assistant",
      title:       "AI Research Assistant",
      category:    "Software",
      role:        "Developer",
      date:        "In Development",
      description: "Private, AI-powered research assistant designed to streamline academic workflows, with a companion Chrome extension that integrates research assistance directly into the browser.",
      tech:        ["JavaScript", "Chrome Extension API", "AI/LLM"],
      award:       null,
      status:      "In Development"
    },
    {
      id:          "pythagoras-plains",
      title:       "Pythagoras Plains",
      category:    "Software",
      role:        "Programmer",
      date:        "Nov–Dec 2024",
      description: "Educational RPG built in MATLAB for a university engineering course. Players solve math problems to defeat enemies, with adaptive difficulty and interactive storylines.",
      tech:        ["MATLAB"],
      award:       null,
      status:      null
    }
  ],

  // ── FAIRGAME ─────────────────────────────────────────────────
  fairgame: {
    title:       "FairGame Initiative",
    role:        "Founder & Executive Director",
    date:        "November 2025 – Present",
    url:         "https://fairgameinitiative.org",
    description: "FairGame is a nonprofit dedicated to closing the resource and opportunity gap in STEM education — starting with the science fair pipeline. As Founder and Executive Director, Kyla manages a five-person team, oversees nonprofit finances and legal operations, and directs outreach programs across more than 10 school science fairs.",
    highlights: [
      "Manages 5-person team across operations, outreach, and programming",
      "Oversees nonprofit finances, legal compliance, and organizational strategy",
      "Directed outreach across 10+ school science fairs in Ohio",
      "Bridges resource gaps for underserved students in STEM competitions"
    ]
  },

  // ── SPEAKING ─────────────────────────────────────────────────
  speaking: [
    {
      event:       "COSI Big Science Day",
      org:         "Center of Science and Industry",
      location:    "Columbus, OH",
      description: "Invited panelist representing student research and STEM innovation to a public audience at Ohio's premier science museum event."
    },
    {
      event:       "International Science & Engineering Fair (ISEF)",
      org:         "Society for Science",
      location:    "International",
      description: "Presented original research at the world's largest pre-collegiate science competition. Recipient of the EPA Award for environmental impact research."
    },
    {
      event:       "Ohio Academy of Science — State Science Day",
      org:         "Ohio Academy of Science",
      location:    "Columbus, OH",
      description: "5× presenter; recipient of multiple Superior ratings, the OAS President's Award, and the Melvin Scholar designation."
    },
    {
      event:       "UNA-USA Leadership Summit",
      org:         "United Nations Association – USA",
      location:    "National",
      description: "Represented The Ohio State University at the national UNA-USA Leadership Summit, engaging on global policy and multilateral advocacy."
    },
    {
      event:       "Rotary Club Presentations",
      org:         "Rotary International",
      location:    "Allen County, OH",
      description: "Delivered presentations on environmental research, renewable energy, and STEM advocacy to civic and community leaders."
    },
    {
      event:       "Allen County Juvenile Court Retreat",
      org:         "Allen County Juvenile Court",
      location:    "Allen County, OH",
      description: "Selected speaker addressing youth audiences on leadership, STEM opportunity, and community engagement."
    }
  ],

  // ── AWARDS ──────────────────────────────────────────────────
  awards: {
    international: [
      { title: "IFoRE 2025 Finalist", org: "International Forum on Research Excellence" },
      { title: "EPA Award", org: "U.S. Environmental Protection Agency — ISEF" },
      { title: "ISEF Qualifier & Presenter", org: "Society for Science" }
    ],
    national: [
      { title: "National Youth Science Camp — Ohio Delegate", org: "NYSC (one of two Ohio representatives)" },
      { title: "AJAS Fellow", org: "American Junior Academy of Science" }
    ],
    state: [
      { title: "Melvin Scholar", org: "Ohio Academy of Science" },
      { title: "OAS President's Award", org: "Ohio Academy of Science" },
      { title: "Governor's Thomas Edison Award for Excellence in STEM", org: "State of Ohio" },
      { title: "1st Place, Ohio 4-H AI Competition", org: "Ohio 4-H" },
      { title: "5× Superior Ratings, State Science Day", org: "Ohio Academy of Science" }
    ],
    regional: [
      { title: "Distinguished Young Woman of Allen County", org: "DYW Program" }
    ],
    academic: [
      { title: "Class Valedictorian, Rank 1", org: "Bath High School — May 2025" },
      { title: "National Honor Society", org: "Bath High School" }
    ]
  },

  // ── INVOLVEMENT ──────────────────────────────────────────────
  involvement: [
    {
      org:         "OSU Collegiate Council on World Affairs (CCWA) — Model UN",
      role:        "Competitor & UNA Member",
      description: "Competes on Ohio State's Model UN team; active member of the United Nations Association, advocating for diplomacy and human rights."
    },
    {
      org:         "Undergraduate Student Government — Sustainability Issues Team",
      role:        "Member",
      description: "Selected for OSU's sustainability committee to advance student-driven policy recommendations."
    },
    {
      org:         "Society of Women Engineers (SWE)",
      role:        "Member",
      description: "Community building and outreach for gender equity in engineering."
    },
    {
      org:         "Engineers for a Sustainable World",
      role:        "Member",
      description: "Implements sustainable engineering principles and devices."
    }
  ]
};