/**
 * Sample questions for local development and POST /api/questions/seed
 * `title` is stored as the Question document's `question` field.
 */
module.exports = [
  {
    title: 'Explain the difference between let, const, and var in JavaScript and when you would choose each.',
    type: 'technical',
    domain: 'frontend',
    difficulty: 'easy',
    expectedAnswer: 'Use const for bindings that should not be reassigned, let for block-scoped variables that may change, and avoid var because it is function-scoped and hoisted in confusing ways. Choose const by default, then let when reassignment is required.'
  },
  {
    title: 'How does the event loop in Node.js differ from threading models in traditional servers?',
    type: 'technical',
    domain: 'backend',
    difficulty: 'medium',
    expectedAnswer: 'Node.js uses a single-threaded event loop with non-blocking I/O and a worker pool for some tasks, whereas traditional servers often use a thread or process per request. The event loop schedules callbacks after I/O completes, which scales well for I/O-bound work but needs care for CPU-heavy tasks.'
  },
  {
    title: 'Describe a time you had a conflict with a teammate and how you resolved it professionally.',
    type: 'behavioral',
    domain: 'general',
    difficulty: 'easy',
    expectedAnswer: 'I focused on understanding their perspective, scheduled a private conversation, referenced shared goals, proposed a compromise, and followed up to ensure the working relationship stayed constructive and delivery stayed on track.'
  },
  {
    title: 'What strategies do you use to optimize React rendering performance in a large application?',
    type: 'technical',
    domain: 'frontend',
    difficulty: 'hard',
    expectedAnswer: 'I profile with React DevTools, memoize expensive components with React.memo, stabilize callbacks with useCallback, split state to avoid broad re-renders, virtualize long lists, code-split routes, and move heavy work off the main thread where appropriate.'
  },
  {
    title: 'How would you design a REST API for pagination, filtering, and sorting on a resource list?',
    type: 'mixed',
    domain: 'backend',
    difficulty: 'medium',
    expectedAnswer: 'Use query parameters such as page and limit or cursor-based tokens for pagination, dedicated filter fields validated against an allow-list, and a sort parameter with safe column mapping. Return total counts or cursors, consistent error shapes, and index the database for common filters.'
  },
  {
    title: 'What is the purpose of an ingress controller in Kubernetes and how does it relate to services?',
    type: 'technical',
    domain: 'devops',
    difficulty: 'medium',
    expectedAnswer: 'An ingress controller implements HTTP and HTTPS routing rules to cluster services, often handling TLS termination and host or path-based routing. Services expose pods inside the cluster while ingress provides a single entry point from outside the cluster according to ingress resources.'
  },
  {
    title: 'Walk through how you would debug a production issue where API latency suddenly doubled.',
    type: 'mixed',
    domain: 'devops',
    difficulty: 'hard',
    expectedAnswer: 'I would check recent deployments, metrics and traces, database slow queries, saturation of CPU or memory, dependency health, and error rates. I narrow the blast radius, reproduce in staging if possible, roll forward or back as needed, and document a post-incident summary with preventive actions.'
  },
  {
    title: 'Explain CORS and why a browser might block a request even when the server returns 200.',
    type: 'technical',
    domain: 'frontend',
    difficulty: 'medium',
    expectedAnswer: 'Cross-Origin Resource Sharing is a browser security model. The browser may block reading the response if the server does not send appropriate Access-Control-Allow-Origin headers for the requesting origin, even if the server processed the request and returned HTTP 200.'
  },
  {
    title: 'How do you approach estimating work for a sprint when requirements are still evolving?',
    type: 'behavioral',
    domain: 'general',
    difficulty: 'medium',
    expectedAnswer: 'I break work into smallest deliverable slices, flag unknowns early, use ranges or spikes for discovery, align with the product owner on must-haves, and revisit estimates as scope clarifies while communicating risk transparently to stakeholders.'
  },
  {
    title: 'Compare SQL and NoSQL databases and give an example where MongoDB is a good fit.',
    type: 'mixed',
    domain: 'backend',
    difficulty: 'easy',
    expectedAnswer: 'SQL databases use structured schemas and strong relational guarantees while NoSQL systems favor flexible schemas and horizontal scaling tradeoffs. MongoDB fits when the domain model is document-oriented, schema flexibility helps iteration, and workload patterns match its query model.'
  },
  {
    title: 'What steps do you take to secure secrets in a CI/CD pipeline?',
    type: 'technical',
    domain: 'devops',
    difficulty: 'easy',
    expectedAnswer: 'I store secrets in a dedicated vault or CI secret store, inject them at runtime, rotate credentials regularly, avoid logging secret values, restrict IAM scopes, and audit access. I never commit secrets to the repository and scan history if leaks occur.'
  },
  {
    title: 'Tell me about a project where you improved reliability or observability. What metrics did you track?',
    type: 'behavioral',
    domain: 'general',
    difficulty: 'hard',
    expectedAnswer: 'I added structured logging, tracing, and dashboards for golden signals like latency, traffic, errors, and saturation. We set SLOs with alerting on burn rate, reduced noisy pages, and used runbooks so on-call could respond faster with clearer root-cause data.'
  }
];
