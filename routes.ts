const WORKFLOWS_BASE = "/workflows";
const CREDENTIALS_BASE = "/credentials";
const EXECUTIONS_BASE = "/executions";
const AUTH_BASE = "";

/**
 * Centralized application route definitions.
 * 
 * Public Routes: Home page (/).
 * Auth Routes: Login and Signup pages.
 * Protected Routes: Workflows, Credentials, and Executions dashboards and details.
 * 
 * @author Maruf Bepary
 */
export const ROUTES = {
  HOME: {
    path: "/",
    name: "Home",
  },
  AUTH: {
    LOGIN: {
      path: `${AUTH_BASE}/login`,
      name: "Login",
    },
    SIGNUP: {
      path: `${AUTH_BASE}/signup`,
      name: "Sign Up",
    },
  },
  WORKFLOWS: {
    INDEX: {
      path: WORKFLOWS_BASE,
      name: "Workflows",
    },
    EDITOR: (workflowId: string) => ({
      path: `${WORKFLOWS_BASE}/${workflowId}`,
      name: "Workflow Editor",
    }),
  },
  CREDENTIALS: {
    INDEX: {
      path: CREDENTIALS_BASE,
      name: "Credentials",
    },
    CREATE: {
      path: `${CREDENTIALS_BASE}/new`,
      name: "New Credential",
    },
    DETAIL: (credentialId: string) => ({
      path: `${CREDENTIALS_BASE}/${credentialId}`,
      name: "Credential Detail",
    }),
  },
  EXECUTIONS: {
    INDEX: {
      path: EXECUTIONS_BASE,
      name: "Executions",
    },
    DETAIL: (executionId: string) => ({
      path: `${EXECUTIONS_BASE}/${executionId}`,
      name: "Execution Detail",
    }),
  },
} as const;

export type Routes = typeof ROUTES;
