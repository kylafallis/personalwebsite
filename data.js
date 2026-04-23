// ============================================================
// data.js — Kyla Fallis Portfolio: Single Source of Truth
// Edit this file to update content across the entire site.
// ============================================================

const SITE_DATA = {

  // ── PERSONAL ────────────────────────────────────────────────
  name:     "Kyla Fallis",
  title:    "Environmental Engineer · Researcher · Builder",
  tagline:  "I work at the intersection of deep-sea electrochemistry, renewable energy, and global policy — building systems that close the gap between what science knows and what the world does.",
  linkedin: "https://linkedin.com/in/kylafallis07",
  github:   "https://github.com/kylafallis",
  fairgame_url: "https://fairgameinitiative.org",
  resume:   "files/Kyla_Fallis_Resume.pdf",
  cv:       "files/Kyla_Fallis_CV.pdf",
  cal:      "kylafallis",                       // ← Cal.com username

  // ── HOMEPAGE HIGHLIGHTS BAR ──────────────────────────────────
  highlights: [
    {
      number: "3",
      label:  "Publications",
      text:   "IEEE, Springer, and Sustentabilis Terra — with two more in press for 2026."
    },
    {
      number: "10+",
      label:  "Awards & Honors",
      text:   "EPA Award, ISEF Qualifier, Melvin Scholar, NYSCamp Delegate, and more."
    },
    {
      number: "501c3",
      label:  "Nonprofit Founded",
      text:   "FairGame Initiative — bridging equity gaps in STEM education across Ohio."
    }
  ],

  // ── AS SEEN IN ───────────────────────────────────────────────
  // url: null → renders as a placeholder (no link)
  as_seen_in: [
    {
      source: "Hometown Stations",
      title:  "Powering Tomorrow with Compost: Bath Senior Advances to International Science Fair",
      type:   "News",
      url:    "https://www.hometownstations.com/news/allen_county/powering-tomorrow-with-compost-bath-high-school-senior-advances-to-international-science-fair/article_f99a4d35-c043-4add-93e2-ee4ebaf897bd.html"
    },
    {
      source: "Lima Ohio News",
      title:  "Bath's Fallis a Finalist in State Science Fair",
      type:   "News",
      url:    "https://www.limaohio.com/news/2025/03/11/baths-fallis-a-finalist-in-state-science-fair/"
    },
    {
      source: "YouTube",
      title:  "Kyla Fallis — Speaking Engagement",
      type:   "Video",
      url:    "https://www.youtube.com/watch?v=DCksEBo1YXc"
    },
    {
      source: "Sustentabilis Terra",
      title:  "Electrogenic Biotransformation of Organic Substrates · Vol. 3, Issue 2",
      type:   "Publication",
      url:    null   // ← Add URL when available
    },
    {
      source: "IEEE",
      title:  "Hybrid ML/DL Framework for Dark Oxygen Flux Production · In Press 2026",
      type:   "Publication",
      url:    null   // ← Add when published
    },
    {
      source: "Springer",
      title:  "Physics-Informed DL for Tidal Energy Site Selection · In Press 2026",
      type:   "Publication",
      url:    null   // ← Add when published
    }
  ],

  // ── RESEARCH ────────────────────────────────────────────────
  // badge: "press" | "published"
  // secondary: true → renders under "Additional Independent Research"
  research: [
    {
      id:            "dark-oxygen",
      journal_label: "IEEE Conference Paper",
      card_label:    "IEEE · In Press 2026",
      title:         "A Novel Hybrid ML/DL Framework for Assessing Dark Oxygen Flux Production in the Clarion-Clipperton Zone",
      journal:       "IEEE",
      status:        "In Press — Summer 2026",
      badge:         "press",
      badge_text:    "In Press · Summer 2026",
      domain:        "Ocean Science · ML/DL · Environmental Engineering",
      recognition:   "IEEE Conference Poster Presentation",
      awards:        null,
      duration:      null,
      coauthors:     "Simar Singh Rayat, Susheela Dahiya",
      summary:       "Developed a hybrid machine learning and deep learning framework to quantify dark oxygen production (DOP) flux within the Clarion-Clipperton Zone — the world's most targeted region for commercial deep-sea mining. The model maps potential ecological consequences of seabed mining on this newly discovered oxygen-generating ecosystem and serves as a decision-support tool for international mining policy.",
      body: [
        "The Clarion-Clipperton Zone (CCZ) — a vast stretch of the central Pacific Ocean — is the world's most targeted region for commercial deep-sea mining due to its rich deposits of polymetallic nodules. In 2023, a landmark discovery revealed that these nodules are also the source of a previously unknown biological phenomenon: the production of oxygen at depths far below the photic zone, in complete darkness. This \"dark oxygen\" may have profound implications for the origins of aerobic life on Earth.",
        "This paper presents a novel hybrid machine learning and deep learning framework to quantify dark oxygen production (DOP) flux across the CCZ and model the potential consequences of large-scale seabed mining on this newly identified ecosystem. By training on available geochemical and hydrodynamic datasets, the framework generates spatially resolved predictions of oxygen flux and risk zones — offering a critical decision-support tool for international seabed mining policy."
      ],
      tags: ["Machine Learning", "Deep Learning", "Dark Oxygen Production", "Clarion-Clipperton Zone", "Deep-Sea Mining Policy", "Flux Modeling"],
      pdf:  null
    },
    {
      id:            "tidal-energy",
      journal_label: "Springer Publication",
      card_label:    "Springer · In Press 2026",
      title:         "A Novel Physics-Informed Deep Learning Framework for Tidal Energy Site Selection",
      journal:       "Springer",
      status:        "In Press — Spring 2026",
      badge:         "press",
      badge_text:    "In Press · Spring 2026",
      domain:        "Renewable Energy · Physics-Informed AI",
      recognition:   null,
      awards:        null,
      duration:      null,
      coauthors:     null,
      summary:       "Introduces a physics-informed deep learning algorithm that embeds hydrodynamic governing equations directly into the neural architecture for tidal energy site selection. By constraining predictions to physically plausible outcomes, the framework outperforms purely data-driven approaches — providing spatially explicit recommendations for offshore tidal energy deployment.",
      body: [
        "Optimal site selection is one of the most consequential decisions in tidal energy development — determining not only energy yield, but environmental impact and long-term viability. Traditional selection methods rely on empirical surveys and simplified hydrodynamic models that often fail to capture complex, nonlinear interactions between tidal flows, seabed bathymetry, and turbine placement.",
        "This paper introduces a physics-informed deep learning algorithm that embeds hydrodynamic governing equations directly into the neural network architecture, constraining predictions to be physically plausible even in data-sparse regions. The result is a site selection framework that outperforms purely data-driven approaches on accuracy and interpretability — providing actionable, spatially explicit recommendations for offshore tidal energy developers."
      ],
      tags: ["Physics-Informed ML", "Tidal Energy", "Renewable Energy", "Deep Learning", "Hydrodynamics"],
      pdf:  null
    },
    {
      id:            "mfc-research",
      journal_label: "Sustentabilis Terra · Vol. 3, Issue 2",
      card_label:    "Sustentabilis Terra · Published 2025",
      title:         "Electrogenic Biotransformation of Organic Substrates",
      journal:       "Sustentabilis Terra, Vol. 3, Issue 2",
      status:        "Published — 2025",
      badge:         "published",
      badge_text:    "Published 2025",
      domain:        "Bioelectrochemistry · Renewable Energy",
      recognition:   null,
      awards:        "EPA Award · ISEF Qualifier · IFoRE Finalist · OAS President's Award",
      duration:      "Nov 2023 – April 2025",
      coauthors:     null,
      summary:       "Independent investigation into compost-powered microbial fuel cells as low-cost, decentralized renewable energy. Designed and fabricated prototypes, conducted controlled electrochemical experiments, and analyzed voltage output and substrate longevity across 18 months of research. Earned the EPA Award and ISEF qualification; directly informed the LYKA Lamp proof-of-concept.",
      body: [
        "Access to reliable, affordable energy remains one of the most persistent barriers to development in low-resource communities. This project investigates microbial fuel cells (MFCs) as a decentralized, low-cost alternative — using the electrochemical activity of naturally occurring soil microbes, fed by organic compost, to generate usable electricity.",
        "Over 18 months of independent research, I designed and fabricated multiple MFC prototypes, systematically varied substrate compositions and electrode configurations, and conducted controlled electrochemical performance experiments. Key findings demonstrated consistent voltage output from compost-based bioanodic chambers, with substrate longevity as the primary variable in energy efficiency optimization. This work earned the EPA Award and ISEF qualification — and directly informed the LYKA Lamp project."
      ],
      tags: ["Microbial Fuel Cells", "Bioelectrochemistry", "Decentralized Energy", "Compost", "Renewable Energy"],
      pdf:  null
    },
    {
      id:            "solar-soil",
      secondary:     true,
      journal_label: "Independent Study · Ohio Academy of Science",
      card_label:    "Ohio Academy of Science · State Superior",
      title:         "Solar Panels' Effect on Soil Nutrients",
      journal:       "Ohio Academy of Science",
      status:        "OAS State Superior · 2023–2025",
      badge:         "published",
      badge_text:    "State Superior",
      domain:        "Environmental Chemistry · Soil Science",
      recognition:   null,
      awards:        "OAS State Superior",
      duration:      "Nov 2023 – April 2025",
      coauthors:     null,
      summary:       "Investigated the relationship between solar panel installation and changes in soil nutrient composition across multiple sites.",
      body: [
        "Investigated the relationship between solar panel installation and changes in soil nutrient composition across multiple sites. Collected soil samples using standardized protocols and applied spectroscopic analysis to determine mineral and macronutrient shifts. Findings contribute to understanding land-use tradeoffs in solar energy deployment. Recognized with a State Superior rating by the Ohio Academy of Science."
      ],
      tags: ["Soil Science", "Solar Energy", "Environmental Chemistry"],
      pdf:  null
    }
  ],

  // ── PROJECTS ────────────────────────────────────────────────
  // category: "Software" | "Engineering"
  // label: displayed in the card header (category · subcategory)
  projects: [
    {
      id:          "wastewise",
      label:       "Software · ML / Computer Vision",
      category:    "Software",
      title:       "WasteWise AI",
      role:        "Project Lead",
      date:        "April 2024",
      description: "AI-powered waste sorting system using computer vision to classify incoming items as organic, recyclable, or landfill trash — reducing contamination and methane emissions at the point of disposal.",
      tech:        ["Machine Learning", "Computer Vision", "Python"],
      award:       "1st Place, Ohio 4-H AI Competition · National Qualifier",
      status:      null
    },
    {
      id:          "class-companion",
      label:       "Software · Full-Stack",
      category:    "Software",
      title:       "Class Companion",
      role:        "Lead Developer",
      date:        "In Development",
      description: "Academic collaboration hub connecting OSU students for study groups and resource sharing. Building full-stack: real-time interaction, course-specific groupings, and mobile-first UI.",
      tech:        ["JavaScript", "Firebase", "HTML/CSS"],
      award:       null,
      status:      "In Development"
    },
    {
      id:          "ai-research-assistant",
      label:       "Software · AI Tools",
      category:    "Software",
      title:       "AI Research Assistant",
      role:        "Developer",
      date:        "In Development",
      description: "Private, AI-powered research assistant designed to streamline academic workflows, with a companion Chrome extension integrating research assistance directly into the browser.",
      tech:        ["JavaScript", "Chrome Extension API", "AI / LLM"],
      award:       null,
      status:      "In Development"
    },
    {
      id:          "pythagoras-plains",
      label:       "Software · Educational",
      category:    "Software",
      title:       "Pythagoras Plains",
      role:        "Programmer",
      date:        "Nov – Dec 2024",
      description: "Educational RPG built in MATLAB for a university engineering course. Players solve math problems to defeat enemies, with adaptive difficulty and interactive storylines.",
      tech:        ["MATLAB", "Game Design"],
      award:       null,
      status:      null
    },
    {
      id:          "aquatracker",
      label:       "Engineering · Sensors & Embedded Systems",
      category:    "Engineering",
      title:       "AquaTracker",
      role:        "Team Engineer",
      date:        "October 2024",
      description: "Autonomous water quality monitoring device measuring salinity, pH, and temperature in real time. Integrated environmental sensors with a microcontroller and wrote C++ firmware for automated data logging.",
      tech:        ["C++", "SolidWorks", "Sensor Integration", "Circuit Design"],
      award:       null,
      status:      null
    },
    {
      id:          "lyka-lamp",
      label:       "Engineering · Renewable Energy",
      category:    "Engineering",
      title:       "LYKA Lamp",
      role:        "Lead Designer",
      date:        "May 2024",
      description: "Renewable energy lamp powered entirely by compost-based microbial fuel cells. Designed circuitry with capacitors and voltage boost converters to store and regulate biological power output — a direct application of the MFC research.",
      tech:        ["Circuit Design", "MFC Fabrication", "Power Electronics"],
      award:       null,
      status:      null
    },
    {
      id:          "smart-energy-monitor",
      label:       "Engineering · Smart Systems",
      category:    "Engineering",
      title:       "Smart Energy Monitor",
      role:        "Project Lead",
      date:        "Concept Stage",
      description: "Startup concept for a household smart energy monitoring system to track consumption patterns and optimize efficiency — bridging personal energy data with actionable sustainability recommendations.",
      tech:        ["IoT", "Energy Systems", "Data Analysis"],
      award:       null,
      status:      "Concept / Prototyping"
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
    ],
    stats: [
      { num: "5",       lbl: "Team Members"     },
      { num: "10+",     lbl: "Science Fairs"    },
      { num: "Nov '25", lbl: "Founded"          },
      { num: "501c3",   lbl: "Nonprofit Status" }
    ]
  },

  // ── SPEAKING ─────────────────────────────────────────────────
  speaking: [
    {
      event:       "COSI Big Science Day — Invited Panelist",
      org:         "Center of Science and Industry",
      location:    "Columbus, Ohio",
      badge:       "Student Research Panel",
      description: "Selected as a student researcher panelist for Ohio's premier public science event, presenting original work on microbial fuel cells and renewable energy to a public audience at COSI. Engaged with scientists, educators, and community members on accessible, real-world STEM applications."
    },
    {
      event:       "International Science & Engineering Fair (ISEF) — Presenter",
      org:         "Society for Science · International",
      location:    "International",
      badge:       "EPA Award",
      description: "Qualified for and presented original research at ISEF — the world's largest pre-collegiate science competition — to an international panel of scientists and engineers. Recipient of the EPA Award for environmental impact research."
    },
    {
      event:       "State Science Day — Research Presenter",
      org:         "Ohio Academy of Science · Columbus, OH",
      location:    "Columbus, Ohio",
      badge:       "5× Superior · OAS President's Award · Melvin Scholar",
      description: "Presented original independent research to a statewide panel of scientists and educators at the Ohio Academy of Science's flagship event. Recipient of multiple Superior ratings across five appearances, the OAS President's Award, and the Melvin Scholar designation."
    },
    {
      event:       "UNA-USA Leadership Summit — OSU Representative",
      org:         "United Nations Association – USA · National",
      location:    "National Conference",
      badge:       "OSU Representative",
      description: "Selected to represent The Ohio State University at the national UNA-USA Leadership Summit, engaging on global policy, multilateral diplomacy, and international advocacy with student leaders and UN experts from across the country."
    },
    {
      event:       "Rotary Club Presentations",
      org:         "Rotary International · Allen County, OH",
      location:    "Allen County, Ohio",
      badge:       "Civic Audience",
      description: "Invited speaker at Rotary Club meetings in Allen County, delivering presentations on environmental research, renewable energy innovation, and the importance of STEM education to community and civic leaders."
    },
    {
      event:       "Juvenile Court Retreat — Selected Speaker",
      org:         "Allen County Juvenile Court · Allen County, OH",
      location:    "Allen County, Ohio",
      badge:       "Youth Audience",
      description: "Invited to speak at the Allen County Juvenile Court's retreat, addressing youth audiences on themes of leadership, opportunity in STEM, and the role of community engagement in shaping a purposeful future."
    }
  ],

  // ── SPEAKING TIMELINE ────────────────────────────────────────
  speaking_timeline: [
    {
      year: "2026",
      events: [
        { name: "HoosierMUN II — WHO Committee",  org: "OSU CCWA · Indiana University",                          badge: "MUN"           },
        { name: "UNA-USA Leadership Summit",       org: "United Nations Association – USA · OSU Representative",  badge: "Policy"        }
      ]
    },
    {
      year: "2025",
      events: [
        { name: "National Youth Science Camp — Ohio Delegate",        org: "NYSC · One of two Ohio representatives",                             badge: "National"      },
        { name: "IFoRE — Finalist",                                   org: "International Forum on Research Excellence",                         badge: "International" },
        { name: "AJAS Annual Conference",                             org: "American Junior Academy of Science · AJAS Fellow",                   badge: "National"      },
        { name: "International Science & Engineering Fair (ISEF)",    org: "Society for Science · EPA Award",                                    badge: "International" },
        { name: "OAS State Science Day",                              org: "Ohio Academy of Science · Melvin Scholar · OAS President's Award",   badge: "State"         }
      ]
    },
    {
      year: "Ongoing",
      events: [
        { name: "CCWA Model UN Competitions",          org: "OSU Collegiate Council on World Affairs", badge: "Collegiate MUN" },
        { name: "Future Environmental Leaders Summit", org: "Environmental advocacy programming",       badge: "Advocacy"       },
        { name: "Women in STEM Conference",            org: "Regional STEM equity programming",         badge: "Advocacy"       }
      ]
    }
  ],

  // ── AWARDS ──────────────────────────────────────────────────
  // Visual columns: (international + national) | state | (regional + academic)
  awards: {
    international: [
      { title: "IFoRE 2025 Finalist",        org: "International Forum on Research Excellence" },
      { title: "EPA Award — ISEF",           org: "U.S. Environmental Protection Agency"       },
      { title: "ISEF Qualifier & Presenter", org: "Society for Science"                        }
    ],
    national: [
      { title: "National Youth Science Camp — Ohio Delegate", org: "NYSC · One of two Ohio representatives" },
      { title: "AJAS Fellow",                                 org: "American Junior Academy of Science"     }
    ],
    state: [
      { title: "Melvin Scholar",                                       org: "Ohio Academy of Science"   },
      { title: "OAS President's Award",                                org: "Ohio Academy of Science"   },
      { title: "Governor's Thomas Edison Award for Excellence in STEM", org: "State of Ohio"            },
      { title: "1st Place, Ohio 4-H AI Competition",                   org: "Ohio 4-H · National Qualifier" },
      { title: "5× Superior Ratings, State Science Day",               org: "Ohio Academy of Science"   }
    ],
    regional: [
      { title: "Distinguished Young Woman of Allen County", org: "DYW Program" }
    ],
    academic: [
      { title: "Class Valedictorian, Rank 1",               org: "Bath High School · May 2025"  },
      { title: "National Honor Society",                    org: "Bath High School"             },
      { title: "Humanitarian Engineering Scholars Program", org: "The Ohio State University"    }
    ]
  },

  // ── INVOLVEMENT ──────────────────────────────────────────────
  involvement: [
    {
      org:         "FairGame Initiative",
      role:        "Founder & Executive Director",
      description: "Founded November 2025. Nonprofit closing the resource gap in STEM education. Manages 5-person team, oversees outreach across 10+ Ohio science fairs."
    },
    {
      org:         "OSU CCWA — Model United Nations",
      role:        "Competitor & UNA Member",
      description: "Competes on Ohio State's collegiate MUN team through the Council on World Affairs. Active member of the United Nations Association, advocating for diplomacy and human rights."
    },
    {
      org:         "Undergraduate Student Government — Sustainability Issues Team",
      role:        "Member",
      description: "Selected for OSU's sustainability committee to advance student-driven policy recommendations and integrate sustainable practices into university operations."
    },
    {
      org:         "Society of Women Engineers (SWE) & Engineers for a Sustainable World",
      role:        "Member",
      description: "Community building for gender equity in engineering; collaboration on sustainable engineering projects and devices alongside ESW's interdisciplinary team."
    }
  ]
};
