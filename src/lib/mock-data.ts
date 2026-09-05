import { ProjectBlueprint, StudentProfile } from "./types";

export const CURATED_PROJECT_BLUEPRINTS: ProjectBlueprint[] = [
  {
    id: "proj-curated-healthcare-01",
    title: "MediVerify: Clinical Drug Interaction & Prescription Safety Engine",
    concept:
      "A privacy-first clinical assistant that scans digitized prescriptions for dangerous drug-drug interactions, contraindications, and dosage anomalies before dispensing.",
    problem:
      "Adverse drug reactions cause over 100,000 hospitalizations annually in outpatient care, particularly in understaffed community health centers where doctors lack automated cross-referencing tools.",
    suitability:
      "Directly leverages Python and NLP/NER pipelines while offering a clean React/Next.js interface. Provides clear separation between medical knowledge extraction and clinical presentation.",
    targetUsers: [
      "Junior resident doctors in outpatient clinics",
      "Hospital clinical pharmacists",
      "Telemedicine triage practitioners",
    ],
    coreFeatures: [
      {
        title: "Prescription OCR & Entity Extraction",
        description: "Extracts medicine names, dosages, frequencies, and patient age/allergies from uploaded digital prescriptions.",
        priority: "High",
      },
      {
        title: "Multi-Drug Interaction Graph Traversal",
        description: "Queries an indexed graph of FDA & NIH drug interactions to flag severe synergistic or antagonistic effects.",
        priority: "High",
      },
      {
        title: "Alternative Medication Recommender",
        description: "Suggests safer bio-equivalent or therapeutic alternative molecules within the same chemical class.",
        priority: "Medium",
      },
      {
        title: "Audit Log & Pharmacovigilance Report",
        description: "Generates exportable PDF clinical advisory reports for patient records with references to clinical literature.",
        priority: "Low",
      },
    ],
    techStack: {
      frontend: ["Next.js 15", "React 19", "Tailwind CSS", "Lucide React"],
      backend: ["FastAPI (Python)", "Next.js Route Handlers"],
      database: ["PostgreSQL (with pgvector for drug embeddings)"],
      cloudDevOps: ["Docker", "Vercel / Render", "GitHub Actions CI"],
      aiMl: ["HuggingFace Transformers (BioBERT)", "OpenFDA Drug API", "LangChain"],
    },
    aiMlComponent: {
      included: true,
      description:
        "Fine-tuned BioBERT model for Named Entity Recognition (NER) to extract pharmacological dosage and drug names from unstructured clinical notes.",
      modelOrApi: "BioLinkBERT / PubMedBERT via HuggingFace or Gemini Flash for entity structured extraction",
      dataRequirements: "OpenFDA National Drug Code Directory and MIMIC-III open sample subsets.",
      datasetRecommendation: "FDA Adverse Event Reporting System (FAERS) public dump and DrugBank open database.",
    },
    difficulty: "Intermediate",
    estimatedScope: {
      totalWeeks: 12,
      hoursPerWeek: 12,
      teamSizeRecommendation: "2-3 students",
    },
    mvpVersion: {
      summary:
        "Core MVP accepts text input of 2 to 5 medications, checks against the OpenFDA interaction table, and highlights high-risk contraindications in under 1.5 seconds.",
      keyFeatures: [
        "Manual and sample prescription input",
        "Deterministic contraindication lookup engine",
        "Severity severity scoring (Mild, Moderate, Critical)",
      ],
      buildTimelineWeeks: 3,
      deliverable: "Live web application with 50 common cardiovascular and antibiotic drug interaction test cases.",
    },
    roadmap: [
      {
        phaseNumber: 1,
        title: "Data Pipeline & Clinical Knowledge Modeling",
        durationWeeks: 3,
        milestones: [
          "Ingest OpenFDA interaction datasets into PostgreSQL",
          "Build drug synonym normalization mapping (generic vs brand)",
        ],
        deliverables: ["Tested database schema with 1,200 indexed drug entities and interaction pairs"],
      },
      {
        phaseNumber: 2,
        title: "NLP Entity Extraction & Scoring Engine",
        durationWeeks: 4,
        milestones: [
          "Implement medical NER pipeline for prescription text extraction",
          "Develop interaction graph severity weighting algorithm",
        ],
        deliverables: ["FastAPI service exposing /extract-prescription and /evaluate-interactions endpoints"],
      },
      {
        phaseNumber: 3,
        title: "Full-Stack Dashboard & Clinical UI",
        durationWeeks: 3,
        milestones: [
          "Construct interactive prescription review card with severity indicators",
          "Integrate alternative suggestion drawer and citation links",
        ],
        deliverables: ["Responsive Next.js web application with immediate visual feedback"],
      },
      {
        phaseNumber: 4,
        title: "Validation, Edge Testing & Capstone Packaging",
        durationWeeks: 2,
        milestones: [
          "Test with 100 historical prescription scenarios",
          "Benchmark latency and verify HIPAA-style de-identification",
        ],
        deliverables: ["Capstone documentation, IEEE-style final paper, and production deployment"],
      },
    ],
    possibleImprovements: [
      "Voice dictation for doctors during clinical examination",
      "Barcode/QR scanner for pharmaceutical packaging",
      "Kidney/Liver function (eGFR) automated dose adjustment calculator",
    ],
    futureScope: [
      "Integration with hospital HL7/FHIR electronic health record systems",
      "Federated learning across regional hospitals to discover novel localized drug side-effects",
    ],
    risksAndChallenges: [
      {
        risk: "Medical liability and hallucination of clinical advice",
        severity: "High",
        mitigation: "Strictly enforce human-in-the-loop: system acts solely as a cross-referencing checker with clear disclaimers and deterministic FDA reference links.",
      },
      {
        risk: "Variations in brand names across international markets",
        severity: "Medium",
        mitigation: "Normalize all brands to WHO ATC (Anatomical Therapeutic Chemical) and RxNorm codes before matching.",
      },
    ],
    architectureOverview:
      "Next.js frontend connects via secure server actions to FastAPI microservice. BioBERT extracts drug tokens which are resolved against a cached PostgreSQL relation of verified drug-drug interaction pairs.",
  },
  {
    id: "proj-curated-fintech-02",
    title: "MicroCred: Explainable Alternative Credit Scoring for Micro-Merchants",
    concept:
      "An explainable creditworthiness assessment platform for unbanked micro-entrepreneurs using cash-flow telemetry, digital payment regularity, and inventory turnover metrics.",
    problem:
      "Over 40% of small informal business owners are rejected for formal bank loans due to lack of traditional credit bureau history, forcing them into predatory informal lending.",
    suitability:
      "Ideal for students with skills in Python, Data Science, and full-stack development. High academic value due to model interpretability (SHAP values) required in regulated financial contexts.",
    targetUsers: [
      "Non-Banking Financial Companies (NBFC) loan officers",
      "Informal street vendors and micro-retailers seeking working capital",
      "Microfinance institution credit analysts",
    ],
    coreFeatures: [
      {
        title: "Transaction & Utility Receipt Ingestion",
        description: "Uploads CSV/Excel bank statements, UPI/QR transaction exports, and utility payment logs.",
        priority: "High",
      },
      {
        title: "Cash-Flow Volatility & Resiliency Scoring",
        description: "Calculates weekly net cash inflow, expense stability, debt service capacity, and cash buffer index.",
        priority: "High",
      },
      {
        title: "Explainable Risk Breakdown (SHAP Visualizer)",
        description: "Interactive visual waterfall chart showing exactly why a score was generated and how the applicant can improve.",
        priority: "High",
      },
      {
        title: "Micro-Loan Simulation & Repayment Scheduler",
        description: "Simulates affordable loan amounts with dynamic daily or weekly micro-amortization schedules.",
        priority: "Medium",
      },
    ],
    techStack: {
      frontend: ["Next.js 15", "TypeScript", "Tailwind CSS", "Recharts"],
      backend: ["Python (FastAPI)", "Pandas", "Scikit-Learn", "LightGBM"],
      database: ["Supabase / PostgreSQL"],
      cloudDevOps: ["Docker", "Vercel", "GitHub Actions"],
      aiMl: ["LightGBM Classifier", "SHAP (SHapley Additive exPlanations)", "XGBoost"],
    },
    aiMlComponent: {
      included: true,
      description:
        "Supervised gradient boosting model trained on non-traditional cash-flow indicators combined with TreeSHAP for deterministic local feature attribution.",
      modelOrApi: "LightGBM with TreeExplainer; optional Gemini API for generating plain-English improvement advice",
      dataRequirements: "Anonymized micro-business loan default datasets (e.g. Kaggle Home Credit or Lending Club filtered subsets).",
      datasetRecommendation: "Kaggle Financial Inclusion in Africa dataset or simulated SME transaction ledger dataset.",
    },
    difficulty: "Intermediate",
    estimatedScope: {
      totalWeeks: 10,
      hoursPerWeek: 12,
      teamSizeRecommendation: "2-3 students",
    },
    mvpVersion: {
      summary:
        "Upload a sample 3-month merchant transaction CSV, automatically compute 8 liquidity features, and generate a 300-850 credit score with top 3 positive and negative contributing factors.",
      keyFeatures: [
        "CSV statement parser",
        "Rule-based liquidity score combined with LightGBM risk classifier",
        "Clear visual breakdown of credit drivers",
      ],
      buildTimelineWeeks: 3,
      deliverable: "Working web portal where a user uploads a statement and sees the interactive credit report in under 2 seconds.",
    },
    roadmap: [
      {
        phaseNumber: 1,
        title: "Feature Engineering & Dataset Preparation",
        durationWeeks: 2,
        milestones: [
          "Curate synthetic 1,000-merchant transaction dataset with seasonal swings",
          "Engineer cash-flow volatility, recurring payment ratio, and net margin features",
        ],
        deliverables: ["Clean Jupyter benchmark notebook demonstrating 82%+ ROC-AUC on holdout split"],
      },
      {
        phaseNumber: 2,
        title: "Model Training & Explainability Pipeline",
        durationWeeks: 3,
        milestones: [
          "Train calibrated LightGBM model with cross-validation",
          "Integrate SHAP explainer to calculate feature contributions per applicant",
        ],
        deliverables: ["Inference API returning credit score, probability of default, and top 5 SHAP values"],
      },
      {
        phaseNumber: 3,
        title: "Underwriter & Applicant Portal UI",
        durationWeeks: 3,
        milestones: [
          "Build responsive dashboard with Recharts waterfall breakdown",
          "Create plain-language 'Path to Loan Eligibility' recommendations card",
        ],
        deliverables: ["Full-stack web application with file dropzone and PDF export"],
      },
      {
        phaseNumber: 4,
        title: "Stress Testing & Fairness Audit",
        durationWeeks: 2,
        milestones: [
          "Evaluate model fairness across demographic subgroups to prevent bias",
          "Write comprehensive capstone report with regulatory compliance considerations",
        ],
        deliverables: ["Complete project documentation, model card, and presentation slides"],
      },
    ],
    possibleImprovements: [
      "SMS transaction parser for offline phone banking telemetry",
      "Integration with Account Aggregator API standards",
      "Merchant peer benchmark: 'How your store performs against similar neighborhood grocers'",
    ],
    futureScope: [
      "Smart contract-based automated micro-repayment upon point-of-sale settlement",
      "Multi-currency support for cross-border remittance-backed lending",
    ],
    risksAndChallenges: [
      {
        risk: "Algorithmic bias against non-standard seasonal business cycles",
        severity: "High",
        mitigation: "Incorporate seasonal detrending filters and allow merchant notes explaining one-off capital expenditures.",
      },
      {
        risk: "Data privacy of merchant financial statements",
        severity: "Medium",
        mitigation: "De-identify sensitive account numbers client-side before sending data to the feature extraction pipeline.",
      },
    ],
    architectureOverview:
      "Next.js frontend manages CSV upload and client visualization. A Python analytics worker computes cash-flow statistics, executes model inference with SHAP, and returns structured risk indicators.",
  },
  {
    id: "proj-curated-cybersecurity-03",
    title: "SentinAI: Automated DevSecOps API Gateway & PII Leakage Sentry",
    concept:
      "A lightweight reverse proxy and CI/CD security scanner that intercepts API traffic in real-time to detect accidental exposure of PII, API tokens, and injection vulnerabilities.",
    problem:
      "Modern microservices frequently leak sensitive customer data (SSNs, emails, credit card fragments) and developer secrets via uncensored JSON responses and verbose debugging logs.",
    suitability:
      "Perfect for students interested in Backend Engineering, Cloud, and Cybersecurity. Direct practical applicability with immediate demonstration value in tech interviews.",
    targetUsers: [
      "Software engineering teams shipping rapid microservice updates",
      "Security engineers auditing internal API endpoints",
      "Compliance officers preparing for SOC2 / GDPR compliance",
    ],
    coreFeatures: [
      {
        title: "Real-Time Traffic Inspection Reverse Proxy",
        description: "Zero-latency middleware that inspects inbound requests and outbound response payloads.",
        priority: "High",
      },
      {
        title: "Deep PII & Secret Pattern Detection",
        description: "Combines high-speed regex with lightweight transformer models to flag credit cards, JWTs, and health data.",
        priority: "High",
      },
      {
        title: "Automated Data Redaction / Masking",
        description: "Configurable masking engine that replaces detected secrets with tokens before forwarding to client.",
        priority: "Medium",
      },
      {
        title: "Interactive Vulnerability Map & Alert Feed",
        description: "Web dashboard highlighting which endpoints have compliance risks, frequency of breaches, and OWASP Top 10 ratings.",
        priority: "High",
      },
    ],
    techStack: {
      frontend: ["Next.js 15", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js / Express or Go proxy", "Next.js Server Actions"],
      database: ["SQLite / PostgreSQL", "Redis for high-speed counter caching"],
      cloudDevOps: ["Docker Compose", "GitHub Actions", "Caddy / Envoy"],
      aiMl: ["Presidio Analyzer / Microsoft NER", "Pattern heuristics"],
    },
    aiMlComponent: {
      included: true,
      description:
        "Context-aware entity classification to distinguish harmless random hashes from true API keys and confidential medical codes.",
      modelOrApi: "Microsoft Presidio / RoBERTa token classification for contextual PII detection",
      dataRequirements: "Synthetic API traffic logs and OWASP benchmark datasets.",
      datasetRecommendation: "OWASP DevSecOps synthetic log suite and Kaggle API security benchmark.",
    },
    difficulty: "Advanced",
    estimatedScope: {
      totalWeeks: 12,
      hoursPerWeek: 14,
      teamSizeRecommendation: "2-4 students",
    },
    mvpVersion: {
      summary:
        "A proxy service that intercepts JSON responses from a sample mock API, identifies exposed email addresses and bearer tokens, and masks them with [REDACTED] in real time.",
      keyFeatures: [
        "Local reverse proxy listening on port 8080",
        "Real-time inspection of 5 major PII types",
        "Live web UI showing incoming requests with security status badges",
      ],
      buildTimelineWeeks: 3,
      deliverable: "Deployable Docker container proxying traffic with live dashboard demonstration.",
    },
    roadmap: [
      {
        phaseNumber: 1,
        title: "Proxy Core & Regex Engine",
        durationWeeks: 3,
        milestones: [
          "Build streaming reverse proxy using Node.js / Go",
          "Implement high-throughput regex library for credit cards, SSNs, and AWS keys",
        ],
        deliverables: ["Working proxy with <10ms added latency on 1MB payloads"],
      },
      {
        phaseNumber: 2,
        title: "Context-Aware ML Classifier",
        durationWeeks: 3,
        milestones: [
          "Integrate lightweight NER model to catch context-dependent sensitive names and medical terms",
          "Build scoring confidence threshold to prevent false positives",
        ],
        deliverables: ["Combined rule + ML hybrid detection pipeline"],
      },
      {
        phaseNumber: 3,
        title: "Security Operations Dashboard",
        durationWeeks: 3,
        milestones: [
          "Develop Next.js dashboard with live WebSocket security feed",
          "Implement endpoint categorization, risk scoring, and rule config toggles",
        ],
        deliverables: ["Production-ready UI with filtering, search, and exportable audit logs"],
      },
      {
        phaseNumber: 4,
        title: "CI/CD Integration & Benchmarking",
        durationWeeks: 3,
        milestones: [
          "Package as GitHub Action for automated pull request scanning",
          "Conduct performance load test (1,000 req/sec benchmark)",
        ],
        deliverables: ["Final project report, benchmark charts, and open-source GitHub release"],
      },
    ],
    possibleImprovements: [
      "Automated pull request creation with recommended code fixes in controllers",
      "Synthetic test data generator for QA teams using sanitized production traffic",
      "Support for GraphQL query depth and batch attack detection",
    ],
    futureScope: [
      "eBPF-based kernel level packet inspection for Kubernetes clusters",
      "Zero-knowledge proof verification for verified third-party API communication",
    ],
    risksAndChallenges: [
      {
        risk: "Latency overhead slowing down production API response times",
        severity: "High",
        mitigation: "Use async non-blocking tap architecture for logging, and only run lightweight regex in the synchronous inline path.",
      },
      {
        risk: "False positives masking valid business data like public contact emails",
        severity: "Medium",
        mitigation: "Provide granular endpoint whitelisting and regex boundary scoping.",
      },
    ],
    architectureOverview:
      "A reverse proxy filters HTTP traffic between clients and backend microservices. Traffic anomalies are logged to SQLite/Redis and streamed via Server-Sent Events to the Next.js control center.",
  },
  {
    id: "proj-curated-edtech-04",
    title: "ConceptGraph: Adaptive Knowledge-Graph Tutor for Computer Science",
    concept:
      "An intelligent self-paced learning tutor that constructs a directed prerequisite graph of programming concepts, detects student misconceptions via interactive coding quizzes, and generates personalized micro-remediations.",
    problem:
      "Traditional online courses present static linear modules where students get stuck on hidden foundational prerequisites (e.g., struggling with dynamic programming due to weak recursion fundamentals).",
    suitability:
      "Strong blend of graph algorithms, web development, and generative AI. Highly relevant to students who want to build software for fellow students.",
    targetUsers: [
      "Undergraduate computer science students learning data structures",
      "Self-taught software engineering bootcamp learners",
      "Teaching assistants managing large introductory courses",
    ],
    coreFeatures: [
      {
        title: "Interactive Concept Prerequisite Topology",
        description: "Visual node-link graph of 50+ core CS topics with color-coded mastery levels and prerequisite edges.",
        priority: "High",
      },
      {
        title: "Diagnostic Micro-Assessment Engine",
        description: "Generates targeted 2-minute diagnostic challenges designed to isolate specific conceptual misunderstandings.",
        priority: "High",
      },
      {
        title: "Root-Cause Prerequisite Remediation",
        description: "When a student fails a problem, the system walks backward down the concept graph to pinpoint the exact unmastered concept.",
        priority: "High",
      },
      {
        title: "Personalized Code Playground with Stepwise Hints",
        description: "Browser-based Python/JS sandbox with AI hints that guide without giving away the complete answer.",
        priority: "Medium",
      },
    ],
    techStack: {
      frontend: ["Next.js 15", "React 19", "Tailwind CSS", "Cytoscape.js / React Flow"],
      backend: ["Next.js Route Handlers", "Node.js"],
      database: ["PostgreSQL", "Prisma ORM"],
      cloudDevOps: ["Vercel", "Supabase", "GitHub Actions"],
      aiMl: ["Gemini 1.5/2.0 API for Socratic hint generation", "AST (Abstract Syntax Tree) Parser"],
    },
    aiMlComponent: {
      included: true,
      description:
        "Socratic LLM prompt chain that receives student code AST and test failure logs, generating guiding questions rather than direct code solutions.",
      modelOrApi: "Gemini 2.5 Flash / 1.5 Flash structured reasoning",
      dataRequirements: "Curated taxonomy of Computer Science concepts and benchmark bug-fix pairs.",
      datasetRecommendation: "ACM Computing Classification System and open-source introductory CS curriculum graphs.",
    },
    difficulty: "Intermediate",
    estimatedScope: {
      totalWeeks: 10,
      hoursPerWeek: 12,
      teamSizeRecommendation: "2-3 students",
    },
    mvpVersion: {
      summary:
        "Interactive directed graph covering 'Arrays -> Pointers -> Linked Lists -> Trees', with diagnostic questions for each node and automated prerequisite traversal upon wrong answers.",
      keyFeatures: [
        "Interactive node graph view with progress coloring",
        "Diagnostic question modal with immediate feedback",
        "Prerequisite fallback recommendation",
      ],
      buildTimelineWeeks: 3,
      deliverable: "Working web application with 15 concepts, interactive quiz flows, and Socratic hint generator.",
    },
    roadmap: [
      {
        phaseNumber: 1,
        title: "Curriculum Graph Modeling & Schema",
        durationWeeks: 2,
        milestones: [
          "Define JSON schema for concepts, prerequisites, and mastery criteria",
          "Curate initial 20-node Data Structures prerequisite tree",
        ],
        deliverables: ["Relational graph schema populated with verified educational links"],
      },
      {
        phaseNumber: 2,
        title: "Graph Visualization & Quiz Runner",
        durationWeeks: 3,
        milestones: [
          "Implement interactive React Flow graph with zoom/pan and node status styling",
          "Build adaptive quiz player that records accuracy and attempt duration",
        ],
        deliverables: ["Interactive frontend graph viewer synced with user session state"],
      },
      {
        phaseNumber: 3,
        title: "Diagnostic AI Socratic Assistant",
        durationWeeks: 3,
        milestones: [
          "Implement server-side prompt chain for analyzing code syntax mistakes",
          "Ensure hints do not reveal answers through strict guardrails",
        ],
        deliverables: ["Real-time hint generation drawer with response streaming"],
      },
      {
        phaseNumber: 4,
        title: "Analytics, User Testing & Final Paper",
        durationWeeks: 2,
        milestones: [
          "Conduct user trial with 20 undergraduate classmates",
          "Measure time-to-mastery improvement compared to traditional linear reading",
        ],
        deliverables: ["Final capstone report, empirical comparison graphs, and live deployment"],
      },
    ],
    possibleImprovements: [
      "In-browser WebAssembly code execution (Pyodide) for safe client-side code running",
      "Spaced repetition flashcards integrated into graph nodes",
      "Teacher dashboard to inspect cohort weakness clusters",
    ],
    futureScope: [
      "Automated extraction of concept graphs from any PDF textbook or course syllabus",
      "Peer-to-peer study buddy matching based on complementary graph mastery",
    ],
    risksAndChallenges: [
      {
        risk: "AI tutor hallucinating incorrect algorithmic explanations",
        severity: "Medium",
        mitigation: "Constrain prompts with verified algorithmic invariants and ground references to standard textbook chapters.",
      },
      {
        risk: "Graph complexity overwhelming beginner students",
        severity: "Low",
        mitigation: "Implement 'fog of war' progressive disclosure that only unmasks adjacent prerequisite nodes.",
      },
    ],
    architectureOverview:
      "Next.js App Router renders a React Flow canvas. User responses update mastery states stored in PostgreSQL. Socratic hints are processed via server-side Gemini API calls.",
  },
  {
    id: "proj-curated-climate-05",
    title: "EcoWatt: Campus Smart-Grid Energy Disaggregation & Carbon Footprint Forecaster",
    concept:
      "An IoT and machine learning platform that analyzes aggregate smart meter electricity data to disaggregate individual appliance power loads and forecast peak carbon intensity periods.",
    problem:
      "University campuses and commercial facilities consume enormous amounts of peak power without granular visibility into which sub-systems (HVAC, server labs, lighting) drive excess cost and emissions.",
    suitability:
      "Ideal for students with interests in IoT, Time-Series Forecasting, and CleanTech. Shows interdisciplinary rigor combining data engineering with environmental impact.",
    targetUsers: [
      "University sustainability & campus facility directors",
      "Energy managers in commercial real estate",
      "Student environmental advocacy groups tracking net-zero goals",
    ],
    coreFeatures: [
      {
        title: "Smart Meter Telemetry Ingestion Pipeline",
        description: "Accepts high-frequency current/voltage or 15-minute interval power consumption time-series.",
        priority: "High",
      },
      {
        title: "Non-Intrusive Load Monitoring (NILM)",
        description: "Disaggregates overall building consumption into HVAC, refrigeration, computing, and lighting baselines.",
        priority: "High",
      },
      {
        title: "Carbon Intensity Forecast & Shift Alerts",
        description: "Predicts optimal low-carbon hours for scheduling energy-intensive tasks (e.g. lab computing clusters).",
        priority: "Medium",
      },
      {
        title: "Interactive Campus Building Heatmap",
        description: "Real-time energy dashboard showing building comparisons, anomaly spikes, and monthly cost projections.",
        priority: "High",
      },
    ],
    techStack: {
      frontend: ["Next.js 15", "TypeScript", "Tailwind CSS", "Recharts"],
      backend: ["Python (FastAPI)", "Pandas", "TimescaleDB / PostgreSQL"],
      database: ["TimescaleDB for high-volume time-series storage"],
      cloudDevOps: ["MQTT broker", "Docker", "AWS / Vercel"],
      aiMl: ["NILMTK (Non-Intrusive Load Monitoring Toolkit)", "Prophet / LSTM for forecasting"],
    },
    aiMlComponent: {
      included: true,
      description:
        "1D-CNN or Factorial Hidden Markov Model for appliance load disaggregation, paired with Prophet for 24-hour predictive energy forecasting.",
      modelOrApi: "1D-CNN NILM classifier and Prophet time-series model",
      dataRequirements: "Public smart meter datasets (e.g. REDD, UK-DALE, or Pecan Street Dataport).",
      datasetRecommendation: "REDD (Reference Energy Disaggregation Data Set) and National Grid Carbon Intensity API.",
    },
    difficulty: "Advanced",
    estimatedScope: {
      totalWeeks: 12,
      hoursPerWeek: 14,
      teamSizeRecommendation: "2-4 students",
    },
    mvpVersion: {
      summary:
        "Upload a 24-hour smart meter load profile CSV, automatically isolate HVAC cycling intervals, and predict next-day peak energy usage with 80%+ directional accuracy.",
      keyFeatures: [
        "Time-series CSV loader with visual load curve",
        "Heuristic + ML appliance load disaggregator",
        "Peak demand alert recommendations",
      ],
      buildTimelineWeeks: 3,
      deliverable: "Live dashboard charting aggregate load vs disaggregated appliances with carbon score badge.",
    },
    roadmap: [
      {
        phaseNumber: 1,
        title: "Time-Series Data Pipeline & Storage",
        durationWeeks: 3,
        milestones: [
          "Format public REDD dataset into 15-minute standard telemetry batches",
          "Setup TimescaleDB hypertable for efficient metric downsampling",
        ],
        deliverables: ["Ingestion pipeline capable of processing 10,000 data points per second"],
      },
      {
        phaseNumber: 2,
        title: "NILM Disaggregation & Forecast Model",
        durationWeeks: 4,
        milestones: [
          "Train 1D convolutional model to detect distinct appliance signatures",
          "Integrate National Grid live carbon intensity API for real-time emission factor mapping",
        ],
        deliverables: ["Python inference service returning disaggregated kWh breakdown per appliance"],
      },
      {
        phaseNumber: 3,
        title: "Campus Facility Command Center",
        durationWeeks: 3,
        milestones: [
          "Build responsive dashboard with Recharts area and bar breakdowns",
          "Implement cost savings calculator and PDF sustainability report generator",
        ],
        deliverables: ["Next.js web portal with interactive time-range selector and alerts"],
      },
      {
        phaseNumber: 4,
        title: "Validation, Deployment & Presentation",
        durationWeeks: 2,
        milestones: [
          "Benchmark disaggregation error (MAE / F1-score)",
          "Formulate presentation deck highlighting campus ROI ($14k projected annual savings)",
        ],
        deliverables: ["Complete project report, video walkthrough, and production deployment"],
      },
    ],
    possibleImprovements: [
      "Hardware prototype using ESP32 and CT clamp sensors for real-time live lab monitoring",
      "Automated smart plug relay control to shed non-critical loads during peak hours",
      "Gamified student dorm energy conservation leaderboard",
    ],
    futureScope: [
      "Integration with battery energy storage systems (BESS) for automated peak shaving",
      "Campus solar PV generation matching and microgrid islanding simulation",
    ],
    risksAndChallenges: [
      {
        risk: "Appliance overlap causing signature interference in noisy buildings",
        severity: "High",
        mitigation: "Combine spectral load analysis with temporal probability priors (e.g. HVAC cycles regularly, lighting corresponds to office hours).",
      },
      {
        risk: "High data volume overloading standard databases",
        severity: "Medium",
        mitigation: "Apply automatic data retention policies and aggregate older logs into hourly and daily summary bins.",
      },
    ],
    architectureOverview:
      "Telemetry streams into TimescaleDB. A Python worker performs load disaggregation and forecasting. Next.js App Router displays real-time load analytics and actionable peak shaving advisories.",
  },
];

/**
 * Filter and adapt curated blueprints to match student profile parameters
 */
export function getCuratedBlueprintsForProfile(profile: StudentProfile): ProjectBlueprint[] {
  // Normalize domain matching
  const targetDomain = profile.domain.toLowerCase();
  
  // Find closest matches
  const sorted = [...CURATED_PROJECT_BLUEPRINTS].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Domain similarity
    if (a.title.toLowerCase().includes(targetDomain) || a.concept.toLowerCase().includes(targetDomain)) scoreA += 5;
    if (b.title.toLowerCase().includes(targetDomain) || b.concept.toLowerCase().includes(targetDomain)) scoreB += 5;

    // Skill overlap
    profile.skills.forEach((skill) => {
      const s = skill.toLowerCase();
      const allTechA = [...a.techStack.frontend, ...a.techStack.backend, ...a.techStack.aiMl].join(" ").toLowerCase();
      const allTechB = [...b.techStack.frontend, ...b.techStack.backend, ...b.techStack.aiMl].join(" ").toLowerCase();
      if (allTechA.includes(s)) scoreA += 2;
      if (allTechB.includes(s)) scoreB += 2;
    });

    // Experience match
    if (a.difficulty === profile.experienceLevel) scoreA += 2;
    if (b.difficulty === profile.experienceLevel) scoreB += 2;

    return scoreB - scoreA;
  });

  // Return top 3 tailored blueprints with dynamic adjustments for the student's constraints
  return sorted.slice(0, 3).map((bp, idx) => {
    return {
      ...bp,
      id: `curated-${profile.domain.toLowerCase().replace(/\s+/g, "-")}-${idx + 1}-${Date.now()}`,
      suitability: `Tailored for a ${profile.teamSize === 1 ? "solo student" : `team of ${profile.teamSize}`} with ${profile.experienceLevel} expertise. Employs your core skills (${profile.skills.slice(0, 3).join(", ")}) and matches your ${profile.timeframeWeeks}-week schedule.`,
      estimatedScope: {
        totalWeeks: profile.timeframeWeeks,
        hoursPerWeek: profile.teamSize === 1 ? 14 : 10,
        teamSizeRecommendation: profile.teamSize === 1 ? "Solo Student" : `${profile.teamSize} Students`,
      },
      mvpVersion: {
        ...bp.mvpVersion,
        buildTimelineWeeks: Math.max(2, Math.floor(profile.timeframeWeeks / 3)),
      },
    };
  });
}
