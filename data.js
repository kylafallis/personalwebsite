// ============================================================
// data.js : Kyla Fallis Portfolio: Single Source of Truth
// Edit this file to update content across the entire site.
// ============================================================

const SITE_DATA = {

  // ── PERSONAL ────────────────────────────────────────────────
  name:     "Kyla Fallis",
  title:    "Chemical Engineer · Researcher · Builder",
  tagline:  "I work at the intersection of deep-sea electrochemistry, renewable energy, and global policy, building systems that close the gap between what science knows and what the world does.",
  email:    "hello@kylafallis.com",
  linkedin: "https://linkedin.com/in/kylafallis07",
  github:   "https://github.com/kylafallis",
  fairgame_url: "https://fairgameinitiative.org",
  resume:   "files/Kyla_Fallis_Resume.pdf",
  cv:       "files/Kyla_Fallis_CV.pdf",         // ← upload the PDF to files/ ; button hides while null
  cal:      "kylafallis",                       // ← Cal.com username
  site_url: "https://kylafallis.com",

  // Scholarly profiles: set once the papers are indexed; null hides the link.
  scholar:  null,                               // ← Google Scholar profile URL
  orcid:    null,                               // ← https://orcid.org/0000-...

  // ── HOMEPAGE HIGHLIGHTS BAR ──────────────────────────────────
  highlights: [
    {
      number: "10+",
      label:  "Awards & Honors",
      text:   "EPA Award, ISEF Qualifier, Melvin Scholar, NYSCamp Delegate, and more."
    },
    {
      number: "3",
      label:  "Publications",
      text:   "IEEE, Springer, and Sustentabilis Terra."
    },
    {
      number: "1,000+",
      label:  "Students Reached",
      text:   "FairGame Initiative, launching first-time science fair students across Ohio."
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
      title:  "Kyla Fallis: Speaking Engagement",   // TODO: replace with the real event name + year
      type:   "Video",
      url:    "https://www.youtube.com/watch?v=DCksEBo1YXc"
    },
    {
      source: "Sustentabilis Terra",
      title:  "Electrogenic Biotransformation of Organic Substrates · Vol. 3, Issue 2",
      type:   "Publication",
      url:    null   // ← TODO: paste the Sustentabilis Terra article link
    },
    {
      source: "IEEE",
      title:  "Hybrid ML/DL Framework for Dark Oxygen Flux Production · 2026",
      type:   "Publication",
      url:    null   // ← TODO: paste the IEEE Xplore / DOI link
    },
    {
      source: "Springer",
      title:  "Physics-Informed DL for Tidal Energy Site Selection · 2026",
      type:   "Publication",
      url:    null   // ← TODO: paste the SpringerLink / DOI link
    }
  ],

  // ── RESEARCH ────────────────────────────────────────────────
  // badge: "press" | "published"
  // secondary: true → renders under "Additional Independent Research"
  research: [
    {
      id:            "dark-oxygen",
      journal_label: "IEEE Conference Paper",
      card_label:    "IEEE · Published 2026",
      title:         "A Novel Hybrid ML/DL Framework for Assessing Dark Oxygen Flux Production in the Clarion-Clipperton Zone",
      journal:       "IEEE",
      status:        "Published 2026",
      badge:         "published",
      badge_text:    "Published 2026",
      domain:        "Ocean Science · ML/DL · Environmental Engineering",
      recognition:   "IEEE Conference Poster Presentation",
      awards:        null,
      duration:      null,
      coauthors:     "Simar Singh Rayat, Susheela Dahiya",
      summary:       "Developed a hybrid machine learning and deep learning framework to quantify dark oxygen production (DOP) flux within the Clarion-Clipperton Zone, the world's most targeted region for commercial deep-sea mining. The model maps potential ecological consequences of seabed mining on this newly discovered oxygen-generating ecosystem and serves as a decision-support tool for international mining policy.",
      body: [
        "The Clarion-Clipperton Zone (CCZ), a vast stretch of the central Pacific Ocean, is the world's most targeted region for commercial deep-sea mining due to its rich deposits of polymetallic nodules. In 2023, a landmark discovery revealed that these nodules are also the source of a previously unknown biological phenomenon: the production of oxygen at depths far below the photic zone, in complete darkness. This \"dark oxygen\" may have profound implications for the origins of aerobic life on Earth.",
        "This paper presents a novel hybrid machine learning and deep learning framework to quantify dark oxygen production (DOP) flux across the CCZ and model the potential consequences of large-scale seabed mining on this newly identified ecosystem. By training on available geochemical and hydrodynamic datasets, the framework generates spatially resolved predictions of oxygen flux and risk zones, offering a critical decision-support tool for international seabed mining policy."
      ],
      tags: ["Machine Learning", "Deep Learning", "Dark Oxygen Production", "Clarion-Clipperton Zone", "Deep-Sea Mining Policy", "Flux Modeling"],
      pdf:  null,                  // <- preprint or accepted-manuscript PDF, if permitted
      doi:  null,                  // TODO: "10.1109/XXXXX"
      venue_full: null,            // TODO: full conference/proceedings name
      authors: "Kyla Fallis, Simar Singh Rayat, Susheela Dahiya",   // TODO: confirm author order
      citation: null,              // TODO: full citation; a Cite button appears once set
      figure: null,                // e.g. "images/research/ccz-flux-map.jpg"
      figure_alt: null
    },
    {
      id:            "tidal-energy",
      journal_label: "Springer Publication",
      card_label:    "Springer · Published 2026",
      title:         "A Novel Physics-Informed Deep Learning Framework for Tidal Energy Site Selection",
      journal:       "Springer",
      status:        "Published 2026",
      badge:         "published",
      badge_text:    "Published 2026",
      domain:        "Renewable Energy · Physics-Informed AI",
      recognition:   null,
      awards:        null,
      duration:      null,
      coauthors:     null,
      summary:       "Introduces a physics-informed deep learning algorithm that embeds hydrodynamic governing equations directly into the neural architecture for tidal energy site selection. By constraining predictions to physically plausible outcomes, the framework outperforms purely data-driven approaches, providing spatially explicit recommendations for offshore tidal energy deployment.",
      body: [
        "Optimal site selection is one of the most consequential decisions in tidal energy development, determining not only energy yield, but environmental impact and long-term viability. Traditional selection methods rely on empirical surveys and simplified hydrodynamic models that often fail to capture complex, nonlinear interactions between tidal flows, seabed bathymetry, and turbine placement.",
        "This paper introduces a physics-informed deep learning algorithm that embeds hydrodynamic governing equations directly into the neural network architecture, constraining predictions to be physically plausible even in data-sparse regions. The result is a site selection framework that outperforms purely data-driven approaches on accuracy and interpretability, providing actionable, spatially explicit recommendations for offshore tidal energy developers."
      ],
      tags: ["Physics-Informed ML", "Tidal Energy", "Renewable Energy", "Deep Learning", "Hydrodynamics"],
      pdf:  null,
      doi:  null,                  // TODO: "10.1007/XXXXX"
      venue_full: null,            // TODO: full journal/book title
      authors: null,               // TODO: fill in co-authors + your position
      citation: null,              // TODO: full citation; a Cite button appears once set
      figure: null,
      figure_alt: null
    },
    {
      id:            "mfc-research",
      journal_label: "Sustentabilis Terra · Vol. 3, Issue 2",
      card_label:    "Sustentabilis Terra · Published 2025",
      title:         "Electrogenic Biotransformation of Organic Substrates",
      journal:       "Sustentabilis Terra, Vol. 3, Issue 2",
      status:        "Published 2025",
      badge:         "published",
      badge_text:    "Published 2025",
      domain:        "Bioelectrochemistry · Renewable Energy",
      recognition:   null,
      awards:        "EPA Award · ISEF Qualifier · IFoRE Finalist · OAS President's Award",
      duration:      "Nov 2023 – April 2025",
      coauthors:     null,
      summary:       "Independent investigation into compost-powered microbial fuel cells as low-cost, decentralized renewable energy. Designed and fabricated prototypes, conducted controlled electrochemical experiments, and analyzed voltage output and substrate longevity across 18 months of research. Earned the EPA Award and ISEF qualification; directly informed the LYKA Lamp proof-of-concept.",
      body: [
        "Access to reliable, affordable energy remains one of the most persistent barriers to development in low-resource communities. This project investigates microbial fuel cells (MFCs) as a decentralized, low-cost alternative, using the electrochemical activity of naturally occurring soil microbes, fed by organic compost, to generate usable electricity.",
        "Over 18 months of independent research, I designed and fabricated multiple MFC prototypes, systematically varied substrate compositions and electrode configurations, and conducted controlled electrochemical performance experiments. Key findings demonstrated consistent voltage output from compost-based bioanodic chambers, with substrate longevity as the primary variable in energy efficiency optimization. This work earned the EPA Award and ISEF qualification, and directly informed the LYKA Lamp project."
      ],
      tags: ["Microbial Fuel Cells", "Bioelectrochemistry", "Decentralized Energy", "Compost", "Renewable Energy"],
      pdf:  null,
      doi:  null,
      venue_full: "Sustentabilis Terra, Vol. 3, Issue 2",
      authors: "Kyla Fallis",
      citation: "Fallis, K. (2025). Electrogenic Biotransformation of Organic Substrates. Sustentabilis Terra, 3(2).",
      figure: null,
      figure_alt: null
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
      pdf:  null,
      doi:  null,
      venue_full: "Ohio Academy of Science",
      authors: "Kyla Fallis",
      citation: null,
      figure: null,
      figure_alt: null
    }
  ],

  // ── PROJECTS ────────────────────────────────────────────────
  // category: "Software" | "Engineering"
  // label: displayed in the card header (category · subcategory)
  projects: [
    {
      id:          "nasa-msfc",
      label:       "Engineering · Aerospace Testing",
      category:    "Engineering",
      title:       "Electromagnetic Environmental Effects at NASA Marshall",
      role:        "Intern, ES31",
      date:        "Summer 2026",
      description: "Worked in the Electromagnetic Environments Testing Branch (ES31) at NASA Marshall Space Flight Center on electromagnetic environmental effects, the discipline that keeps spacecraft electronics from interfering with each other or with their launch environment. Designed and built the Iron Hand Mark 3 test fixture during the placement.",
      tech:        ["Electromagnetic Testing", "Test Fixture Design", "Instrumentation"],
      award:       null,
      status:      null,
      outcome:     null,          // TODO: one line on what the Iron Hand Mark 3 does / measures
      image:       null,          // TODO: add once NASA media clearance is confirmed
      image_alt:   null,
      repo:        null,
      featured:    true
    },
    {
      id:          "eve-waste",
      label:       "Engineering · Bioprocess",
      category:    "Engineering",
      title:       "Modular Anaerobic Reactors, EvE Waste",
      role:        "Co-Founder & CTO",
      date:        "2024 – Present",
      description: "Modular anaerobic reactors that sit on-site at food manufacturers, digesting organic waste where it is produced instead of sending it to a landfill. The digestate that comes out is sold on as a nutrient additive, which turns a disposal cost into a product.",
      tech:        ["Anaerobic Digestion", "Bioprocess Design", "Modular Systems", "Waste Valorization"],
      award:       null,
      status:      "Active",
      outcome:     "Keeps food manufacturing waste out of landfill by digesting it on-site and selling the digestate.",
      image:       null,          // TODO: reactor photo or process diagram
      image_alt:   null,
      repo:        null,
      featured:    true
    },
    {
      id:          "wastewise",
      label:       "Software · ML / Computer Vision",
      category:    "Software",
      title:       "WasteWise AI",
      role:        "Project Lead",
      date:        "April 2024",
      description: "AI-powered waste sorting system using computer vision to classify incoming items as organic, recyclable, or landfill trash, reducing contamination and methane emissions at the point of disposal.",
      tech:        ["Machine Learning", "Computer Vision", "Python"],
      award:       "1st Place, Ohio 4-H AI Competition · National Qualifier",
      status:      null,
      outcome:     "Classifies organic, recyclable, and landfill waste at the point of disposal, cutting contamination before it reaches the facility.",
      image:       null,
      image_alt:   null,
      repo:        null
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
      status:      "In Development",
      outcome:     null,
      image:       null,
      image_alt:   null,
      repo:        null
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
      status:      "In Development",
      outcome:     null,
      image:       null,
      image_alt:   null,
      repo:        null
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
      status:      null,
      outcome:     null,
      image:       null,
      image_alt:   null,
      repo:        null
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
      status:      null,
      outcome:     "Logs salinity, pH, and temperature continuously in the field without a tethered operator.",
      image:       null,
      image_alt:   null,
      repo:        null
    },
    {
      id:          "lyka-lamp",
      label:       "Engineering · Renewable Energy",
      category:    "Engineering",
      title:       "LYKA Lamp",
      role:        "Lead Designer",
      date:        "May 2024",
      description: "Renewable energy lamp powered entirely by compost-based microbial fuel cells. Designed circuitry with capacitors and voltage boost converters to store and regulate biological power output, a direct application of the MFC research.",
      tech:        ["Circuit Design", "MFC Fabrication", "Power Electronics"],
      award:       null,
      status:      null,
      outcome:     "Runs a usable light source entirely on compost, with no grid and no batteries to replace.",
      image:       null,
      image_alt:   null,
      repo:        null
    },
    {
      id:          "smart-energy-monitor",
      label:       "Engineering · Smart Systems",
      category:    "Engineering",
      title:       "Smart Energy Monitor",
      role:        "Project Lead",
      date:        "Concept Stage",
      description: "Startup concept for a household smart energy monitoring system to track consumption patterns and optimize efficiency, bridging personal energy data with actionable sustainability recommendations.",
      tech:        ["IoT", "Energy Systems", "Data Analysis"],
      award:       null,
      status:      "Concept / Prototyping",
      outcome:     null,
      image:       null,
      image_alt:   null,
      repo:        null
    }
  ],

  // ── FAIRGAME ─────────────────────────────────────────────────
  fairgame: {
    title:       "FairGame Initiative",
    role:        "Founder & Executive Director",
    date:        "November 2025 – Present",
    url:         "https://fairgameinitiative.org",
    description: "FairGame is a nonprofit dedicated to closing the resource and opportunity gap in STEM education, starting with the science fair pipeline. As Founder and Executive Director, Kyla has grown it from a single-county effort into a program reaching more than 1,000 students, supported by a statewide teacher network and a free library of 288 resources.",
    highlights: [
      "Reached 1,000+ students, most entering a science fair for the first time",
      "Published a free library of 288 resources for teachers running fairs without a budget",
      "Directed outreach across 10+ school science fairs in Ohio",
      "Built a statewide network of teachers and mentors supporting first-time competitors",
      "Oversees nonprofit finances, legal compliance, and organizational strategy"
    ],
    stats: [
      { num: "1,000+",  lbl: "Students Reached"  },
      { num: "288",     lbl: "Teacher Resources" },
      { num: "10+",     lbl: "Science Fairs"     },
      { num: "Nov '25", lbl: "Founded"           }
    ]
  },

  // ── EVE WASTE ────────────────────────────────────
  // Rendered as a feature block on Projects and a section on the homepage,
  // the same treatment FairGame gets.
  eve: {
    title:       "EvE Waste",
    role:        "Co-Founder & CTO",
    date:        "2024 – Present",
    url:         null,              // TODO: company site, once there is one
    description: "EvE Waste builds modular anaerobic reactors that sit on-site at food manufacturers. Organic waste gets digested where it is produced instead of being trucked to a landfill, and the digestate that comes out the other end is sold on as a nutrient additive. As co-founder and CTO I lead the technical side: reactor design, the digestion process, and how a single module scales into a system.",
    highlights: [
      "Co-founded the company in 2024 and lead its technical direction as CTO",
      "Designs modular anaerobic reactors that deploy on-site at food manufacturers",
      "Diverts organic waste from landfill at the source, before it is ever hauled",
      "Pilot running at Clocktower, with testing underway on Ohio State's campus",   // TODO: confirm Clocktower's full name
      "Turns digestate into a saleable nutrient additive, so the waste stream pays for itself"
    ],
    stats: [
      { num: "Co-Founder", lbl: "& CTO"           },
      { num: "2024",       lbl: "Founded"         },
      { num: "2",          lbl: "Pilot Sites"     },
      { num: "On-Site",    lbl: "Waste Diversion" }
    ]
  },

  // ── SPEAKING ─────────────────────────────────────────────────
  speaking: [
    {
      event:       "COSI Big Science Day: Invited Panelist",
      org:         "Center of Science and Industry",
      location:    "Columbus, Ohio",
      year:        "2025",
      badge:       "Student Research Panel",
      description: "Selected as a student researcher panelist for Ohio's premier public science event, presenting original work on microbial fuel cells and renewable energy to a public audience at COSI. Engaged with scientists, educators, and community members on accessible, real-world STEM applications."
    },
    {
      event:       "International Science & Engineering Fair (ISEF): Presenter",
      org:         "Society for Science · International",
      location:    "International",
      year:        "2025",
      badge:       "EPA Award",
      description: "Qualified for and presented original research at ISEF, the world's largest pre-collegiate science competition, to an international panel of scientists and engineers. Recipient of the EPA Award for environmental impact research."
    },
    {
      event:       "State Science Day: Research Presenter",
      org:         "Ohio Academy of Science · Columbus, OH",
      location:    "Columbus, Ohio",
      year:        "2021–2025",
      badge:       "5× Superior · OAS President's Award · Melvin Scholar",
      description: "Presented original independent research to a statewide panel of scientists and educators at the Ohio Academy of Science's flagship event. Recipient of multiple Superior ratings across five appearances, the OAS President's Award, and the Melvin Scholar designation."
    },
    {
      event:       "UNA-USA Leadership Summit: OSU Representative",
      org:         "United Nations Association – USA · National",
      location:    "National Conference",
      year:        "2026",
      badge:       "OSU Representative",
      description: "Selected to represent The Ohio State University at the national UNA-USA Leadership Summit, engaging on global policy, multilateral diplomacy, and international advocacy with student leaders and UN experts from across the country."
    },
    {
      event:       "Rotary Club Presentations",
      org:         "Rotary International · Allen County, OH",
      location:    "Allen County, Ohio",
      year:        "2024–2025",
      badge:       "Civic Audience",
      description: "Invited speaker at Rotary Club meetings in Allen County, delivering presentations on environmental research, renewable energy innovation, and the importance of STEM education to community and civic leaders."
    },
    {
      event:       "Juvenile Court Retreat: Selected Speaker",
      org:         "Allen County Juvenile Court · Allen County, OH",
      location:    "Allen County, Ohio",
      year:        "2024",
      badge:       "Youth Audience",
      description: "Invited to speak at the Allen County Juvenile Court's retreat, addressing youth audiences on themes of leadership, opportunity in STEM, and the role of community engagement in shaping a purposeful future."
    }
  ],

  // ── SIGNATURE TALKS ──────────────────────────────────────────
  // Named talks an organizer can book, drawn from the work above.
  talks: [
    {
      title:    "The Ocean Is Making Oxygen in the Dark, and We're About to Mine It",
      audience: "Public · University · Policy",
      summary:  "In 2023 we learned the deep seafloor produces oxygen with no sunlight at all. The same seabed holds the metals the energy transition depends on. This talk covers what dark oxygen is, how I modeled its production across the Clarion-Clipperton Zone, and why the mining decision is arriving before the science does."
    },
    {
      title:    "Physics You Can't Argue With: Teaching Machine Learning the Rules",
      audience: "Technical · Engineering · Student researchers",
      summary:  "Most machine learning models will happily predict something physically impossible. Physics-informed models won't. Using tidal energy site selection as the worked example, this talk shows what changes when you build the governing equations into the network itself, and where that approach actually belongs."
    },
    {
      title:    "The Only Woman in the Room, and the Pipeline That Put Me There",
      audience: "Students · Educators · Civic & STEM equity",
      summary:  "I watched science fairs from the sidelines in Lima, Ohio long before I competed in one. This is the honest version of that path: what opened the door, what nearly closed it, and what FairGame has learned, across 1,000+ first-time competitors, about which barriers are real and which are simply unmarked."
    }
  ],

  // ── SPEAKING TIMELINE ────────────────────────────────────────
  speaking_timeline: [
    {
      year: "2026",
      events: [
        { name: "Climate Week NYC",                      org: "New York City · Attendee",                                   badge: "Climate"       },
        { name: "NASA Marshall Space Flight Center",    org: "Electromagnetic Environments Testing Branch (ES31) · Summer",  badge: "Research"      },
        { name: "United Nations Association of Ohio",   org: "Vice President · statewide chapter leadership",                badge: "Policy"        },
        { name: "UNA-USA Leadership Summit",            org: "United Nations Association – USA · OSU Representative",        badge: "Policy"        },
        { name: "HoosierMUN II: WHO Committee",        org: "OSU CCWA · Indiana University",                                badge: "MUN"           }
      ]
    },
    {
      year: "2025",
      events: [
        { name: "National Youth Science Camp: Ohio Delegate",     org: "NYSC · One of two Ohio representatives",                           badge: "National"      },
        { name: "IFoRE Finalist",                                org: "International Forum on Research Excellence",                       badge: "International" },
        { name: "AJAS Annual Conference",                          org: "American Junior Academy of Science · AJAS Fellow",                 badge: "National"      },
        { name: "International Science & Engineering Fair (ISEF)", org: "Society for Science · EPA Award",                                  badge: "International" },
        { name: "COSI Big Science Day: Invited Panelist",         org: "Center of Science and Industry · Columbus, OH",                    badge: "Public"        },
        { name: "OAS State Science Day",                           org: "Ohio Academy of Science · Melvin Scholar · President's Award",     badge: "State"         }
      ]
    },
    {
      year: "Ongoing",
      events: [
        { name: "FairGame teacher trainings & fair visits", org: "FairGame Initiative · schools across Ohio", badge: "Outreach"       },
        { name: "CCWA Model UN Competitions",               org: "OSU Collegiate Council on World Affairs",   badge: "Collegiate MUN" },
        { name: "Future Environmental Leaders Summit",      org: "Environmental advocacy programming",        badge: "Advocacy"       },
        { name: "Women in STEM Conference",                 org: "Regional STEM equity programming",          badge: "Advocacy"       }
      ]
    }
  ],

  // ── AWARDS ──────────────────────────────────────────────────
  // Visual columns: (international + national) | state | (regional + academic)
  awards: {
    international: [
      { title: "IFoRE 2025 Finalist",        org: "International Forum on Research Excellence" },
      { title: "EPA Award at ISEF",           org: "U.S. Environmental Protection Agency"       },
      { title: "ISEF Qualifier & Presenter", org: "Society for Science"                        }
    ],
    national: [
      { title: "National Youth Science Camp: Ohio Delegate", org: "NYSC · One of two Ohio representatives" },
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

  // ── SKILLS ──────────────────────────────────────────────────
  skills: [
    {
      label: "Research & Science",
      items: ["Electrochemistry", "Ocean Science", "Environmental Chemistry", "Soil Science", "Spectroscopic Analysis", "Experimental Design", "Scientific Writing", "Peer Review"]
    },
    {
      label: "Machine Learning & AI",
      items: ["Machine Learning", "Deep Learning", "Physics-Informed ML", "Computer Vision", "Python", "TensorFlow", "Data Analysis", "Flux Modeling"]
    },
    {
      label: "Engineering & Systems",
      items: ["Circuit Design", "Embedded Systems", "C++", "SolidWorks", "MATLAB", "IoT", "Sensor Integration", "Power Electronics"]
    },
    {
      label: "Policy & Communication",
      items: ["Model United Nations", "Public Speaking", "Science Policy", "Nonprofit Management", "International Relations", "Grant Writing", "Science Advocacy"]
    }
  ],

  // ── NOW ─────────────────────────────────────────────────────
  now: {
    updated: "October 2026",
    sections: [
      {
        label: "Research",
        items: [
          "Two papers out this year: dark oxygen flux in the Clarion-Clipperton Zone (IEEE) and physics-informed deep learning for tidal energy siting (Springer)",
          "Writing up electromagnetic environmental effects work from the summer at NASA Marshall",
          "Following on from the CCZ work into deep-sea mining law and ecological modeling"
        ]
      },
      {
        label: "Building",
        items: [
          "EvE Waste: leading the technical side as co-founder and CTO, with a reactor pilot running at Clocktower and testing underway on Ohio State's campus",
          "Class Companion: full-stack study hub for OSU students",
          "AI Research Assistant + companion Chrome extension"
        ]
      },
      {
        label: "FairGame Initiative",
        items: [
          "Past 1,000 students reached, most competing in a science fair for the first time",
          "Maintaining a free 288-resource library for teachers and a statewide mentor network",
          "Building out the 2026–27 season and the mentor network behind it"
        ]
      },
      {
        label: "Policy & Service",
        items: [
          "Vice President, United Nations Association of Ohio",
          "Attended Climate Week NYC alongside delegates from government, industry, and civil society",
          "NPIP placement with EDGE, carrying out the Eastland for Everyone plan in southeast Columbus"
        ]
      },
      {
        label: "At OSU",
        items: [
          "Second year, Chemical Engineering · Humanitarian Engineering Scholars Program",
          "CCWA Model UN · USG Sustainability Issues Team · SWE · Engineers for a Sustainable World"
        ]
      }
    ]
  },

  // ── INVOLVEMENT ──────────────────────────────────────────────
  involvement: [
    {
      org:         "FairGame Initiative",
      role:        "Founder & Executive Director",
      description: "Founded November 2025. Nonprofit closing the resource gap in STEM education, now reaching 1,000+ students through a statewide teacher network and a free 288-resource library."
    },
    {
      org:         "EvE Waste",
      role:        "Co-Founder & CTO",
      description: "Co-founded a startup in 2024 building modular anaerobic reactors that digest food manufacturing waste on-site and sell the digestate as a nutrient additive. Leads reactor design, the digestion process, and technical direction."
    },
    {
      org:         "United Nations Association of Ohio",
      role:        "Vice President",
      description: "Serves as Vice President of the statewide UNA chapter, supporting chapter programming, membership, and advocacy on global policy across Ohio."   // TODO: swap in one line on your actual portfolio
    },
    {
      org:         "Climate Week NYC",
      role:        "Attendee",
      description: "Attended Climate Week NYC, the largest annual climate event in North America, alongside delegates from government, industry, and civil society."   // TODO: add the year, and upgrade this if you had a formal role
    },
    {
      org:         "EDGE: Eastland for Everyone",
      role:        "NPIP Placement, 2026–27",
      description: "Nonprofit Internship Program placement supporting EDGE, the organization carrying out the city-backed Eastland for Everyone plan in southeast Columbus."
    },
    {
      org:         "OSU CCWA Model United Nations",
      role:        "Competitor",
      description: "Competes on Ohio State's collegiate MUN team through the Council on World Affairs, working at the intersection of technical knowledge and international policy."
    },
    {
      org:         "Undergraduate Student Government: Sustainability Issues Team",
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
