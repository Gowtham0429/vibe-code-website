import { MasterProfile, ApplicationRecord } from '../types';

export const defaultMasterProfile: MasterProfile = {
  personalInfo: {
    fullName: "Alex Rivera",
    email: "alex.rivera.analytics@gmail.com",
    phone: "+1 (555) 234-5678",
    location: "New York, NY (Open to Remote / Hybrid)",
    linkedIn: "linkedin.com/in/alex-rivera-data",
    github: "github.com/alexrivera-data",
    portfolio: "alexrivera.dev/data-portfolio",
    workAuthorization: "Authorized to work in the US (US Citizen)",
    requiresSponsorship: "No",
    noticePeriod: "2 weeks",
    expectedSalary: "$80,000 - $95,000 / year",
    yearsOfExperience: "1.5"
  },
  headline: "Junior Data Analyst | SQL • Python • Tableau • Power BI • dbt",
  summary: "Detail-oriented Data Analyst with 1.5 years of experience delivering actionable insights through SQL data modeling, automated ETL pipelines, and interactive executive dashboards in Tableau and Power BI. Proven track record of reducing reporting turnaround times by 40% and translating complex datasets into clear strategic recommendations for cross-functional stakeholders.",
  skills: {
    sqlAndDatabases: ["SQL (PostgreSQL, MySQL)", "Complex Joins & Window Functions", "CTEs & Subqueries", "Query Optimization", "Schema Design"],
    programmingAndScripting: ["Python (Pandas, NumPy)", "Matplotlib & Seaborn", "Jupyter Notebooks", "REST APIs", "Git & GitHub"],
    biAndVisualization: ["Tableau Desktop", "Power BI (DAX, Power Query)", "Looker Studio", "Executive KPI Dashboards", "Data Storytelling"],
    cloudAndWarehouses: ["Google BigQuery", "Snowflake (Basics)", "dbt (Core data models)", "AWS S3 / Redshift exposure"],
    analyticsAndStatistics: ["Exploratory Data Analysis (EDA)", "A/B Testing & Hypothesis Testing", "Cohort Analysis", "Funnel Optimization", "Customer Segmentation"],
    toolsAndWorkflow: ["Excel (XLOOKUP, Pivot Tables, Macros)", "Jira / Agile", "Confluence", "VS Code"],
    softSkills: ["Cross-functional Communication", "Stakeholder Presentation", "Problem Solving", "Documentation", "Curiosity & Fast Learner"]
  },
  experience: [
    {
      id: "exp-1",
      role: "Associate Data Analyst",
      company: "Veloce Retail Solutions",
      location: "New York, NY",
      startDate: "2024-06",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected automated SQL views and scheduled BigQuery queries for daily e-commerce sales tracking, reducing manual report compilation time from 6 hours to 15 minutes weekly.",
        "Built and maintained 8+ production Tableau dashboards monitoring GMV, conversion rates, and inventory velocity for 12 category managers and executive leadership.",
        "Performed exploratory data analysis in Python (Pandas) across 1.2M customer orders, identifying 3 key churn indicators and contributing to a 4.2% lift in repeat customer retention.",
        "Collaborated with data engineering to define data quality validation checks using dbt tests, catching schema drift and NULL anomalies before downstream dashboard ingestion."
      ]
    },
    {
      id: "exp-2",
      role: "Junior Business Intelligence Intern",
      company: "Apex Media Analytics",
      location: "Boston, MA",
      startDate: "2023-09",
      endDate: "2024-05",
      current: false,
      bullets: [
        "Authored modular PostgreSQL queries to analyze campaign performance metrics (CTR, CPA, ROAS) across multi-channel advertising initiatives.",
        "Developed Power BI dashboards with dynamic DAX measures and custom drill-down hierarchies, adopted by 25+ account coordinators for client QBRs.",
        "Audited legacy spreadsheet reports and reconciled discrepancies across Google Analytics 4 and backend transaction databases.",
        "Presented monthly analytical summaries to marketing stakeholders, translating technical data findings into actionable budget reallocations."
      ]
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "E-Commerce Customer Lifetime Value (LTV) & Churn Predictor",
      tools: ["Python", "Pandas", "Scikit-Learn", "Streamlit", "PostgreSQL"],
      description: "End-to-end analytics workflow segmenting 50,000+ customer profiles using RFM scoring and logistic regression to identify high-risk churn cohorts.",
      bullets: [
        "Engineered behavioral RFM (Recency, Frequency, Monetary) features from raw SQL transactions using PostgreSQL window functions.",
        "Trained baseline classification model achieving 81% precision in predicting customer defection within 60 days.",
        "Deployed an interactive Streamlit dashboard allowing retention managers to filter at-risk accounts by predicted revenue loss."
      ],
      link: "github.com/alexrivera-data/customer-churn-rfm"
    },
    {
      id: "proj-2",
      title: "Real-Time SaaS Product Analytics Dashboard & Funnel Analysis",
      tools: ["Tableau", "SQL", "BigQuery", "dbt"],
      description: "Interactive KPI dashboard modeling user onboarding drop-off points, feature adoption rates, and subscription tier upgrades.",
      bullets: [
        "Constructed normalized dimensional models (Star Schema) in BigQuery with fact tables tracking 2M+ user telemetry events.",
        "Identified a 34% drop-off in the signup funnel at the workspace creation step, informing UX team's redesigned onboarding flow.",
        "Documented data dictionary and metric calculation logic in Confluence for organizational consistency."
      ],
      link: "public.tableau.com/profile/alexrivera"
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Information Systems & Business Analytics",
      institution: "Northeastern University",
      graduationYear: "2023",
      gpa: "3.75 / 4.0",
      location: "Boston, MA"
    }
  ],
  certifications: [
    {
      name: "Google Data Analytics Professional Certificate",
      issuer: "Coursera / Google",
      year: "2023"
    },
    {
      name: "Tableau Desktop Specialist",
      issuer: "Tableau",
      year: "2024"
    },
    {
      name: "dbt Fundamentals Certified",
      issuer: "dbt Labs",
      year: "2024"
    }
  ]
};

export const sampleJobDescriptions = [
  {
    id: "jd-spotify",
    title: "Junior Product Analyst",
    company: "Spotify",
    location: "New York, NY (Hybrid)",
    url: "https://www.lifeatspotify.com/jobs/junior-product-analyst-nyc",
    text: `Job Title: Junior Product Analyst - Core Experience
Company: Spotify
Location: New York, NY

About the Role:
We are seeking an enthusiastic Junior Product Analyst to join our Core Experience Product Insights team. In this role, you will partner closely with Product Managers, Engineers, and Designers to understand how millions of listeners discover and interact with audio content.

Responsibilities:
- Write robust, performant SQL queries across Petabyte-scale BigQuery and Cloud data warehouses.
- Design, evaluate, and analyze A/B tests to optimize user retention, playlist discovery, and session length.
- Build automated, intuitive dashboards in Tableau to democratize access to key product metrics (DAU, WAU, churn, skip rate).
- Perform deep-dive exploratory data analysis using Python (Pandas, NumPy) to unearth actionable behavioral patterns.
- Partner with product managers to define success metrics (OKRs/KPIs) for new feature rollouts.
- Communicate complex quantitative findings clearly to non-technical stakeholders through data storytelling.

Requirements & Qualifications:
- 1-2 years of relevant experience in product analytics, data analytics, or business intelligence.
- High proficiency in SQL (joins, aggregations, window functions, query optimization).
- Hands-on experience with data visualization tools (Tableau strongly preferred, or Looker).
- Working proficiency in Python for data wrangling, statistical analysis, and exploratory analysis.
- Understanding of basic statistical principles, hypothesis testing, and A/B test analysis.
- Strong written and verbal communication skills; ability to articulate business implications from raw numbers.
- Experience with cloud data warehouses like BigQuery or Snowflake is a strong plus.`
  },
  {
    id: "jd-doordash",
    title: "BI & Operations Analyst",
    company: "DoorDash",
    location: "San Francisco, CA / Remote",
    url: "https://careers.doordash.com/jobs/bi-operations-analyst",
    text: `Role: Business Intelligence & Operations Analyst
Company: DoorDash
Location: Remote (US)

DoorDash is looking for a data-driven BI & Operations Analyst to scale our merchant logistics operations. You will turn raw delivery telemetry and partner data into actionable efficiency initiatives.

Key Responsibilities:
- Develop scalable data models and analytical pipelines in Snowflake and PostgreSQL.
- Build automated Power BI and Tableau dashboards tracking courier dispatch efficiency, delivery fulfillment times, and merchant defect rates.
- Identify operational bottlenecks using SQL and Python; synthesize recommendations for market operations managers.
- Design cohort analyses to track courier onboarding velocity and retention across tier-1 cities.
- Maintain data integrity by conducting root cause analyses on telemetry tracking anomalies.

Qualifications:
- Bachelor's degree in quantitative field (Analytics, Statistics, Computer Science, Economics) or equivalent practical experience.
- 1-3 years experience utilizing SQL daily in a commercial environment.
- Demonstrated experience building enterprise dashboards in Power BI (including DAX formulas and data modeling) or Tableau.
- Proficiency in Excel for rapid financial modeling and ad-hoc data analysis.
- Experience with Snowflake or AWS Redshift.
- High ownership mindset and comfort with fast-paced, ambiguous operational environments.`
  },
  {
    id: "jd-stripe",
    title: "Analytics Engineer (Early Career)",
    company: "Stripe",
    location: "Seattle, WA / Remote",
    url: "https://stripe.com/jobs/early-career-analytics-engineer",
    text: `Position: Analytics Engineer - Early Career
Company: Stripe
Location: Seattle, WA (Remote friendly)

At Stripe, we're building economic infrastructure for the internet. The Analytics Engineering team bridges the gap between raw backend transaction logs and clean, trusted business intelligence models.

What you'll do:
- Transform raw, messy event streams into performant dimensional models using dbt (data build tool) and SQL.
- Implement rigorous testing suites (dbt tests, schema validations) to enforce data quality and reduce pipeline downtime.
- Collaborate with downstream finance and fraud analysts to ensure BI metrics reflect single-source-of-truth logic.
- Maintain version-controlled data transformations using Git, CI/CD workflows, and comprehensive metric documentation.
- Optimize slow-running queries and partitions in Snowflake/BigQuery to lower warehouse compute costs.

Who you are:
- 1+ years of data modeling or analytics experience.
- Strong SQL fundamentals: understanding query execution plans, CTEs, and star-schema dimensional modeling.
- Exposure to dbt (dbt Core or dbt Cloud) and Git version control.
- Familiarity with cloud data warehouses (Snowflake, BigQuery, or Databricks).
- Passion for clean documentation, modular code, and reliable data governance.`
  }
];

export const seedApplications: ApplicationRecord[] = [
  {
    id: "app-101",
    company_name: "Spotify",
    job_title: "Junior Product Analyst",
    job_url: "https://www.lifeatspotify.com/jobs/junior-product-analyst-nyc",
    match_score: 91,
    tailored_resume_path: "/resumes/Alex_Rivera_Spotify_Tailored.pdf",
    applied_date: "2026-10-18",
    status: "INTERVIEW",
    last_updated: "2026-10-24",
    notes: "Passed recruiter screen. 45-min technical interview on SQL window functions & A/B testing metric definitions scheduled for Thursday.",
    salary_range: "$88,000 - $98,000",
    location: "New York, NY (Hybrid)",
    missing_skills: ["Petabyte Scale Data", "Advanced Audio Analytics"],
    matched_skills: ["SQL", "BigQuery", "Tableau", "Python (Pandas)", "A/B Testing", "Funnel Analysis", "Data Storytelling"],
    applied_via: "Greenhouse ATS (Copilot Auto-Filled)"
  },
  {
    id: "app-102",
    company_name: "DoorDash",
    job_title: "BI & Operations Analyst",
    job_url: "https://careers.doordash.com/jobs/bi-operations-analyst",
    match_score: 87,
    tailored_resume_path: "/resumes/Alex_Rivera_DoorDash_Tailored.pdf",
    applied_date: "2026-10-15",
    status: "SHORTLISTED",
    last_updated: "2026-10-22",
    notes: "Recruiter emailed expressing interest in Power BI DAX portfolio project. Asked for availability next week.",
    salary_range: "$85,000 - $92,000",
    location: "Remote (US)",
    missing_skills: ["Advanced Snowflake", "Courier Logistics"],
    matched_skills: ["SQL", "Power BI", "DAX", "Tableau", "PostgreSQL", "Cohort Analysis", "Excel"],
    applied_via: "Workday Portal"
  },
  {
    id: "app-103",
    company_name: "Stripe",
    job_title: "Analytics Engineer (Early Career)",
    job_url: "https://stripe.com/jobs/early-career-analytics-engineer",
    match_score: 85,
    tailored_resume_path: "/resumes/Alex_Rivera_Stripe_Tailored.pdf",
    applied_date: "2026-10-12",
    status: "UNDER_REVIEW",
    last_updated: "2026-10-20",
    notes: "Application viewed by hiring manager. Highlighted dbt test validation work from Veloce Retail.",
    salary_range: "$95,000 - $110,000",
    location: "Seattle, WA / Remote",
    missing_skills: ["CI/CD Pipeline Automation", "Databricks"],
    matched_skills: ["dbt", "SQL", "Dimensional Modeling", "BigQuery", "Git", "Schema Design"],
    applied_via: "Lever ATS"
  },
  {
    id: "app-104",
    company_name: "Capital One",
    job_title: "Junior Data Analyst - Risk & Compliance",
    job_url: "https://capitalonecareers.com/job/data-analyst-risk",
    match_score: 82,
    tailored_resume_path: "/resumes/Alex_Rivera_CapitalOne_Tailored.pdf",
    applied_date: "2026-10-08",
    status: "INTERVIEW",
    last_updated: "2026-10-23",
    notes: "Round 2 Case Study presentation: SQL query optimization and anomaly detection.",
    salary_range: "$90,000 - $100,000",
    location: "McLean, VA / Hybrid",
    missing_skills: ["AWS Redshift", "SAS"],
    matched_skills: ["SQL", "Python", "Data Quality Auditing", "Tableau", "Financial Reporting"],
    applied_via: "Workday Portal"
  },
  {
    id: "app-105",
    company_name: "Uber",
    job_title: "Operations Data Analyst",
    job_url: "https://uber.com/careers/operations-analyst",
    match_score: 76,
    tailored_resume_path: "/resumes/Alex_Rivera_Uber_Tailored.pdf",
    applied_date: "2026-09-28",
    status: "REJECTED",
    last_updated: "2026-10-06",
    notes: "Automated rejection email received. Missing heavy Apache Spark / PySpark distributed computing experience required for driver marketplace routing.",
    salary_range: "$92,000 - $105,000",
    location: "San Francisco, CA",
    missing_skills: ["Apache Spark / PySpark", "Distributed Systems", "Geospatial Analytics (H3)"],
    matched_skills: ["SQL", "Python", "Tableau", "Cohort Analysis"],
    applied_via: "Uber Careers"
  },
  {
    id: "app-106",
    company_name: "Airbnb",
    job_title: "Data Analyst, Search & Discovery",
    job_url: "https://airbnb.com/careers/data-analyst-search",
    match_score: 72,
    tailored_resume_path: "/resumes/Alex_Rivera_Airbnb_Tailored.pdf",
    applied_date: "2026-09-24",
    status: "REJECTED",
    last_updated: "2026-10-03",
    notes: "Rejected after screening. Feedback indicated strong preference for candidates with direct production Apache Airflow DAG scheduling and Machine Learning feature stores.",
    salary_range: "$95,000 - $115,000",
    location: "Remote",
    missing_skills: ["Apache Airflow", "ML Feature Store", "Search Ranking Metrics (NDCG)"],
    matched_skills: ["SQL", "A/B Testing", "Python", "Tableau"],
    applied_via: "Greenhouse ATS"
  },
  {
    id: "app-107",
    company_name: "Wayfair",
    job_title: "Supply Chain Analytics Associate",
    job_url: "https://wayfair.com/careers/supply-chain-analytics",
    match_score: 84,
    tailored_resume_path: "/resumes/Alex_Rivera_Wayfair_Tailored.pdf",
    applied_date: "2026-10-21",
    status: "APPLIED",
    last_updated: "2026-10-21",
    notes: "Submitted tailored resume emphasizing inventory velocity dashboards and automated BigQuery views.",
    salary_range: "$82,000 - $90,000",
    location: "Boston, MA",
    missing_skills: ["Supply Chain Forecasting", "SAP ERP"],
    matched_skills: ["SQL", "BigQuery", "Tableau", "Inventory Analytics", "Python"],
    applied_via: "Greenhouse ATS (Copilot Auto-Filled)"
  },
  {
    id: "app-108",
    company_name: "Etsy",
    job_title: "Junior Marketplace Analyst",
    job_url: "https://etsy.com/careers/marketplace-analyst",
    match_score: 89,
    tailored_resume_path: "/resumes/Alex_Rivera_Etsy_Tailored.pdf",
    applied_date: "2026-10-22",
    status: "APPLIED",
    last_updated: "2026-10-22",
    notes: "Applied with tailored summary emphasizing customer lifetime value and e-commerce churn analysis project.",
    salary_range: "$85,000 - $95,000",
    location: "Brooklyn, NY (Hybrid)",
    missing_skills: ["Looker / LookML"],
    matched_skills: ["SQL", "Python", "Tableau", "RFM Segmentation", "E-commerce Analytics"],
    applied_via: "Lever ATS (Copilot Auto-Filled)"
  }
];
