export interface TechItem {
    name: string;
    icon: string;
    level: number;
    description?: string;
}

export interface TechCategory {
    id: string;
    category: string;
    description: string;
    techs: TechItem[];
}

/**
 * Full DigiCraft technology map.
 * Icon files live in /public/tech/{filename} — add PNG/SVG assets as you expand the stack.
 */
export const TECH_STACK: TechCategory[] = [
    {
        id: "frontend",
        category: "Frontend & Web",
        description:
            "Modern interfaces, design systems, and high-performance web applications.",
        techs: [
            { name: "React", icon: "/tech/react.png", level: 95, description: "Component-driven UIs" },
            { name: "Next.js", icon: "/tech/nextjs.png", level: 92, description: "SSR, SSG & App Router" },
            { name: "TypeScript", icon: "/tech/typescript.png", level: 90, description: "Type-safe JavaScript" },
            { name: "Tailwind CSS", icon: "/tech/tailwind.svg", level: 94, description: "Utility-first styling" },
            { name: "JavaScript", icon: "/tech/javascript.png", level: 93, description: "Core web language" },
            { name: "HTML5", icon: "/tech/html5.png", level: 96, description: "Semantic markup" },
            { name: "CSS3", icon: "/tech/css3.png", level: 94, description: "Layouts & animations" },
            { name: "Vue.js", icon: "/tech/vue.png", level: 82, description: "Progressive framework" },
            { name: "Angular", icon: "/tech/angular.png", level: 78, description: "Enterprise SPAs" },
            { name: "Vite", icon: "/tech/vite.png", level: 88, description: "Fast dev tooling" },
            { name: "Redux", icon: "/tech/redux.png", level: 85, description: "Predictable state" },
            { name: "Zustand", icon: "/tech/zustand.png", level: 86, description: "Lightweight state" },
            { name: "Framer Motion", icon: "/tech/framer-motion.png", level: 84, description: "UI animation" },
            { name: "Three.js", icon: "/tech/threejs.png", level: 75, description: "3D web experiences" },
        ],
    },
    {
        id: "mobile",
        category: "Mobile & Cross-Platform",
        description:
            "Native-quality mobile apps and unified codebases for iOS, Android, and beyond.",
        techs: [
            { name: "React Native", icon: "/tech/react-native.png", level: 88, description: "Cross-platform apps" },
            { name: "Expo", icon: "/tech/expo.png", level: 86, description: "RN toolchain & OTA" },
            { name: "Flutter", icon: "/tech/flutter.png", level: 80, description: "Dart UI toolkit" },
            { name: "Swift", icon: "/tech/swift.png", level: 76, description: "Native iOS" },
            { name: "Kotlin", icon: "/tech/kotlin.png", level: 78, description: "Native Android" },
            { name: "iOS", icon: "/tech/ios.png", level: 80, description: "Apple ecosystem" },
            { name: "Android", icon: "/tech/android.png", level: 82, description: "Google ecosystem" },
            { name: "Capacitor", icon: "/tech/capacitor.png", level: 74, description: "Web-to-native shell" },
            { name: "Ionic", icon: "/tech/ionic.png", level: 72, description: "Hybrid mobile UI" },
            { name: "PWA", icon: "/tech/pwa.png", level: 85, description: "Installable web apps" },
        ],
    },
    {
        id: "backend",
        category: "Backend & APIs",
        description:
            "Scalable services, microservices, and API layers that power production systems.",
        techs: [
            { name: "Node.js", icon: "/tech/nodejs.png", level: 92, description: "JavaScript runtime" },
            { name: "Python", icon: "/tech/python.png", level: 90, description: "Versatile backend" },
            { name: "Express.js", icon: "/tech/express.png", level: 90, description: "Minimal Node APIs" },
            { name: "NestJS", icon: "/tech/nestjs.png", level: 85, description: "Structured Node APIs" },
            { name: "FastAPI", icon: "/tech/fastapi.png", level: 86, description: "High-speed Python APIs" },
            { name: "Django", icon: "/tech/django.png", level: 82, description: "Batteries-included Python" },
            { name: "Flask", icon: "/tech/flask.png", level: 80, description: "Lightweight Python" },
            { name: "GraphQL", icon: "/tech/graphql.png", level: 84, description: "Flexible query APIs" },
            { name: "REST APIs", icon: "/tech/rest.png", level: 94, description: "HTTP resource design" },
            { name: "gRPC", icon: "/tech/grpc.png", level: 72, description: "High-performance RPC" },
            { name: "Java", icon: "/tech/java.png", level: 75, description: "Enterprise backends" },
            { name: "Spring Boot", icon: "/tech/spring.png", level: 74, description: "Java microservices" },
            { name: "Go", icon: "/tech/golang.png", level: 78, description: "Concurrent services" },
            { name: "Rust", icon: "/tech/rust.png", level: 70, description: "Systems performance" },
        ],
    },
    {
        id: "database",
        category: "Databases & Storage",
        description:
            "Relational, document, cache, and search storage tuned for your data model.",
        techs: [
            { name: "MongoDB", icon: "/tech/mongodb.png", level: 90, description: "Document database" },
            { name: "PostgreSQL", icon: "/tech/postgresql.png", level: 88, description: "Relational SQL" },
            { name: "MySQL", icon: "/tech/mysql.png", level: 86, description: "Widely deployed SQL" },
            { name: "Redis", icon: "/tech/redis.png", level: 87, description: "In-memory cache" },
            { name: "Firebase", icon: "/tech/firebase.png", level: 84, description: "Realtime & auth backend" },
            { name: "Supabase", icon: "/tech/supabase.png", level: 83, description: "Postgres + BaaS" },
            { name: "Elasticsearch", icon: "/tech/elasticsearch.png", level: 78, description: "Search & analytics" },
            { name: "DynamoDB", icon: "/tech/dynamodb.png", level: 76, description: "Managed NoSQL" },
            { name: "Prisma", icon: "/tech/prisma.png", level: 88, description: "Type-safe ORM" },
            { name: "Mongoose", icon: "/tech/mongoose.png", level: 89, description: "MongoDB ODM" },
        ],
    },
    {
        id: "cloud",
        category: "Cloud & DevOps",
        description:
            "Infrastructure, containers, orchestration, and reliable delivery pipelines.",
        techs: [
            { name: "AWS", icon: "/tech/aws.png", level: 86, description: "Cloud infrastructure" },
            { name: "Google Cloud", icon: "/tech/gcp.png", level: 78, description: "GCP services" },
            { name: "Azure", icon: "/tech/azure.png", level: 76, description: "Microsoft cloud" },
            { name: "Docker", icon: "/tech/docker.png", level: 88, description: "Containerization" },
            { name: "Kubernetes", icon: "/tech/kubernetes.png", level: 80, description: "Container orchestration" },
            { name: "Terraform", icon: "/tech/terraform.png", level: 82, description: "Infrastructure as code" },
            { name: "GitHub Actions", icon: "/tech/github-actions.png", level: 90, description: "CI/CD automation" },
            { name: "Nginx", icon: "/tech/nginx.png", level: 84, description: "Reverse proxy & serving" },
            { name: "Vercel", icon: "/tech/vercel.png", level: 88, description: "Frontend deployment" },
            { name: "Cloudinary", icon: "/tech/cloudinary.png", level: 86, description: "Media CDN & transforms" },
            { name: "Linux", icon: "/tech/linux.png", level: 88, description: "Server environments" },
        ],
    },
    {
        id: "ai",
        category: "AI & Machine Learning",
        description:
            "LLMs, custom models, RAG pipelines, and intelligent product features.",
        techs: [
            { name: "OpenAI", icon: "/tech/openai.png", level: 88, description: "GPT & embeddings APIs" },
            { name: "LangChain", icon: "/tech/langchain.png", level: 84, description: "LLM orchestration" },
            { name: "TensorFlow", icon: "/tech/tensorflow.png", level: 80, description: "Deep learning" },
            { name: "PyTorch", icon: "/tech/pytorch.png", level: 82, description: "Research & training" },
            { name: "Hugging Face", icon: "/tech/huggingface.png", level: 83, description: "Model hub & transformers" },
            { name: "scikit-learn", icon: "/tech/scikit-learn.png", level: 85, description: "Classical ML" },
            { name: "RAG", icon: "/tech/rag.png", level: 86, description: "Retrieval-augmented generation" },
            { name: "Vector DBs", icon: "/tech/vector-db.png", level: 82, description: "Semantic search stores" },
            { name: "Whisper", icon: "/tech/whisper.png", level: 78, description: "Speech-to-text" },
            { name: "Computer Vision", icon: "/tech/computer-vision.png", level: 76, description: "Image & video ML" },
            { name: "NLP", icon: "/tech/nlp.png", level: 84, description: "Text understanding" },
            { name: "MLOps", icon: "/tech/mlops.png", level: 78, description: "Model deployment lifecycle" },
        ],
    },
    {
        id: "data",
        category: "Data Science & Analytics",
        description:
            "Pipelines, warehousing, visualization, and insight from raw data.",
        techs: [
            { name: "Pandas", icon: "/tech/pandas.png", level: 88, description: "Data manipulation" },
            { name: "NumPy", icon: "/tech/numpy.png", level: 87, description: "Numerical computing" },
            { name: "Jupyter", icon: "/tech/jupyter.png", level: 90, description: "Interactive notebooks" },
            { name: "Apache Spark", icon: "/tech/spark.png", level: 76, description: "Big data processing" },
            { name: "Apache Airflow", icon: "/tech/airflow.png", level: 80, description: "Workflow orchestration" },
            { name: "dbt", icon: "/tech/dbt.png", level: 78, description: "Analytics engineering" },
            { name: "Power BI", icon: "/tech/powerbi.png", level: 82, description: "Business dashboards" },
            { name: "Tableau", icon: "/tech/tableau.png", level: 78, description: "Data visualization" },
            { name: "ETL Pipelines", icon: "/tech/etl.png", level: 84, description: "Extract-transform-load" },
            { name: "Data Warehousing", icon: "/tech/data-warehouse.png", level: 80, description: "Snowflake, BigQuery" },
        ],
    },
    {
        id: "design",
        category: "Design & UX",
        description:
            "Product design, prototyping, and polished user experiences.",
        techs: [
            { name: "Figma", icon: "/tech/figma.png", level: 92, description: "UI/UX design" },
            { name: "Adobe XD", icon: "/tech/adobe-xd.png", level: 80, description: "Experience design" },
            { name: "Sketch", icon: "/tech/sketch.png", level: 75, description: "Interface design" },
            { name: "Framer", icon: "/tech/framer.png", level: 82, description: "Interactive prototypes" },
            { name: "Photoshop", icon: "/tech/photoshop.png", level: 78, description: "Visual assets" },
            { name: "Illustrator", icon: "/tech/illustrator.png", level: 76, description: "Vector graphics" },
            { name: "Design Systems", icon: "/tech/design-system.png", level: 88, description: "Reusable components" },
            { name: "Accessibility", icon: "/tech/accessibility.png", level: 85, description: "WCAG-compliant UX" },
        ],
    },
    {
        id: "testing",
        category: "Testing & Quality",
        description:
            "Automated testing, API validation, and confidence before every release.",
        techs: [
            { name: "Jest", icon: "/tech/jest.png", level: 90, description: "Unit & integration tests" },
            { name: "Cypress", icon: "/tech/cypress.png", level: 86, description: "E2E browser testing" },
            { name: "Playwright", icon: "/tech/playwright.png", level: 88, description: "Cross-browser E2E" },
            { name: "Selenium", icon: "/tech/selenium.png", level: 78, description: "Browser automation" },
            { name: "Postman", icon: "/tech/postman.png", level: 92, description: "API testing" },
            { name: "Vitest", icon: "/tech/vitest.png", level: 86, description: "Vite-native testing" },
            { name: "Load Testing", icon: "/tech/load-testing.png", level: 80, description: "Performance under scale" },
        ],
    },
    {
        id: "security",
        category: "Security & Authentication",
        description:
            "Secure auth flows, compliance-minded patterns, and hardened deployments.",
        techs: [
            { name: "OAuth 2.0", icon: "/tech/oauth.png", level: 88, description: "Delegated authorization" },
            { name: "JWT", icon: "/tech/jwt.png", level: 90, description: "Token-based auth" },
            { name: "NextAuth", icon: "/tech/nextauth.png", level: 89, description: "Auth for Next.js" },
            { name: "Auth0", icon: "/tech/auth0.png", level: 82, description: "Identity platform" },
            { name: "SSL/TLS", icon: "/tech/ssl.png", level: 92, description: "Encrypted transport" },
            { name: "OWASP", icon: "/tech/owasp.png", level: 86, description: "Security best practices" },
            { name: "RBAC", icon: "/tech/rbac.png", level: 84, description: "Role-based access" },
        ],
    },
    {
        id: "realtime",
        category: "Messaging & Real-Time",
        description:
            "Live updates, event streams, and asynchronous system communication.",
        techs: [
            { name: "WebSockets", icon: "/tech/websockets.png", level: 88, description: "Bidirectional live data" },
            { name: "Socket.io", icon: "/tech/socketio.png", level: 86, description: "Realtime Node layer" },
            { name: "RabbitMQ", icon: "/tech/rabbitmq.png", level: 78, description: "Message broker" },
            { name: "Apache Kafka", icon: "/tech/kafka.png", level: 76, description: "Event streaming" },
            { name: "Redis Pub/Sub", icon: "/tech/redis-pubsub.png", level: 82, description: "Lightweight messaging" },
            { name: "Server-Sent Events", icon: "/tech/sse.png", level: 80, description: "One-way live streams" },
        ],
    },
    {
        id: "cms",
        category: "CMS & E-Commerce",
        description:
            "Content platforms, headless CMS, and online store solutions.",
        techs: [
            { name: "WordPress", icon: "/tech/wordpress.png", level: 82, description: "Content management" },
            { name: "Shopify", icon: "/tech/shopify.png", level: 80, description: "E-commerce stores" },
            { name: "Strapi", icon: "/tech/strapi.png", level: 84, description: "Headless CMS" },
            { name: "Sanity", icon: "/tech/sanity.png", level: 82, description: "Structured content" },
            { name: "WooCommerce", icon: "/tech/woocommerce.png", level: 78, description: "WordPress commerce" },
            { name: "Stripe", icon: "/tech/stripe.png", level: 88, description: "Payments integration" },
        ],
    },
    {
        id: "blockchain",
        category: "Blockchain & Web3",
        description:
            "Smart contracts, decentralized apps, and on-chain integrations.",
        techs: [
            { name: "Ethereum", icon: "/tech/ethereum.png", level: 74, description: "Smart contract platform" },
            { name: "Solidity", icon: "/tech/solidity.png", level: 72, description: "Contract language" },
            { name: "Web3.js", icon: "/tech/web3js.png", level: 74, description: "Ethereum JavaScript API" },
            { name: "Hardhat", icon: "/tech/hardhat.png", level: 76, description: "Contract dev environment" },
            { name: "IPFS", icon: "/tech/ipfs.png", level: 70, description: "Decentralized storage" },
        ],
    },
    {
        id: "monitoring",
        category: "Monitoring & Observability",
        description:
            "Error tracking, metrics, logging, and production health visibility.",
        techs: [
            { name: "Sentry", icon: "/tech/sentry.png", level: 88, description: "Error monitoring" },
            { name: "Datadog", icon: "/tech/datadog.png", level: 80, description: "APM & infrastructure" },
            { name: "Grafana", icon: "/tech/grafana.png", level: 82, description: "Metrics dashboards" },
            { name: "Prometheus", icon: "/tech/prometheus.png", level: 78, description: "Time-series metrics" },
            { name: "Google Analytics", icon: "/tech/google-analytics.png", level: 86, description: "Product analytics" },
            { name: "Log Management", icon: "/tech/logging.png", level: 84, description: "Centralized logs" },
        ],
    },
    {
        id: "tools",
        category: "Tools & Collaboration",
        description:
            "Version control, project management, and day-to-day engineering workflow.",
        techs: [
            { name: "Git", icon: "/tech/git.png", level: 94, description: "Source control" },
            { name: "GitHub", icon: "/tech/github.png", level: 93, description: "Code hosting & PRs" },
            { name: "GitLab", icon: "/tech/gitlab.png", level: 82, description: "DevOps platform" },
            { name: "Jira", icon: "/tech/jira.png", level: 85, description: "Agile project tracking" },
            { name: "Slack", icon: "/tech/slack.png", level: 88, description: "Team communication" },
            { name: "Notion", icon: "/tech/notion.png", level: 84, description: "Docs & planning" },
            { name: "VS Code", icon: "/tech/vscode.png", level: 95, description: "Primary IDE" },
        ],
    },
];

export const TECH_STACK_STATS = {
    domains: TECH_STACK.length,
    technologies: TECH_STACK.reduce((sum, cat) => sum + cat.techs.length, 0),
};
