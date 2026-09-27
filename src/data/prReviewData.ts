import { ArchitectureRule, SecurityVulnerability, AgentTrack } from '../types/review';

export const SUBMITTED_CODE = `import os
import pymongo

# Global Configuration
API_SECRET_KEY = "sk-live-55829a8fbc89221a8cd34ee"  # Production key for access
DB_URI = "mongodb+srv://admin:password123@cluster0.mongodb.net/test"

def handle_user_request(request_data):
    # Direct database connection inside controller layer
    client = pymongo.MongoClient(DB_URI)
    db = client.user_database
    
    # Quick insertion without error handling
    db.users.insert_one({"user": request_data['username'], "email": request_data['email']})
    print("User inserted successfully!")`;

export const CORRECTED_CODE_SINGLE = `import os
import logging
from typing import Any, Dict, Optional
import pymongo
from pymongo.errors import PyMongoError

# Configure structured logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# ==========================================
# 1. Configuration Layer (Environment-based)
# ==========================================
class AppConfig:
    """Manages application credentials loaded strictly from the environment."""
    API_SECRET_KEY: str = os.getenv("API_SECRET_KEY", "")
    DB_URI: str = os.getenv("DB_URI", "")

    @classmethod
    def validate(cls) -> None:
        if not cls.DB_URI:
            raise EnvironmentError("Critical Error: 'DB_URI' environment variable is not configured.")
        if not cls.API_SECRET_KEY:
            logger.warning("Warning: 'API_SECRET_KEY' environment variable is unset.")


# ==========================================
# 2. Repository Layer (Data Access Pattern)
# ==========================================
class UserRepository:
    """Encapsulates all database operations, isolating MongoDB logic from controllers."""
    def __init__(self, db_client: pymongo.MongoClient, database_name: str = "user_database"):
        self.db = db_client[database_name]
        self.collection = self.db["users"]

    def create_user(self, username: str, email: str) -> Dict[str, Any]:
        """Inserts a new user record with error handling and returning created state."""
        try:
            user_doc = {"user": username, "email": email}
            result = self.collection.insert_one(user_doc)
            return {"id": str(result.inserted_id), "user": username, "email": email}
        except PyMongoError as exc:
            logger.error("Database operation failed in UserRepository.create_user: %s", exc)
            raise RuntimeError(f"Database insertion failed: {exc}") from exc


# ==========================================
# 3. Controller Layer (Presentation / Route)
# ==========================================
# Shared client instantiated once to prevent connection pool exhaustion
_db_client: Optional[pymongo.MongoClient] = None

def get_user_repository() -> UserRepository:
    global _db_client
    if _db_client is None:
        AppConfig.validate()
        _db_client = pymongo.MongoClient(AppConfig.DB_URI, serverSelectionTimeoutMS=5000)
    return UserRepository(_db_client)


def handle_user_request(request_data: Dict[str, Any], user_repo: Optional[UserRepository] = None) -> Dict[str, Any]:
    """Controller handling user registration with validation, repository pattern, and try-catch safety."""
    try:
        # Validate required payload fields
        if not isinstance(request_data, dict):
            return {"status": "error", "message": "Invalid request payload format."}, 400

        username = request_data.get('username')
        email = request_data.get('email')

        if not username or not email:
            return {"status": "error", "message": "Missing required fields: 'username' and 'email'."}, 400

        # Delegate persistence to Repository Layer
        repo = user_repo or get_user_repository()
        created_user = repo.create_user(username=username, email=email)
        logger.info("User %s created successfully with id %s", username, created_user['id'])

        return {
            "status": "success",
            "message": "User inserted successfully!",
            "data": created_user
        }, 201

    except PyMongoError as db_err:
        logger.error("Database error occurred while handling user request: %s", db_err)
        return {"status": "error", "message": "Service unavailable due to storage failure."}, 503

    except Exception as exc:
        logger.exception("Unexpected error processing user request: %s", exc)
        return {"status": "error", "message": "Internal server error occurred."}, 500
`;

export const GIT_DIFF_PATCH = `--- a/controllers/user_controller.py
+++ b/controllers/user_controller.py
@@ -1,15 +1,63 @@
 import os
+import logging
+from typing import Any, Dict, Optional
 import pymongo
+from pymongo.errors import PyMongoError
 
-# Global Configuration
-API_SECRET_KEY = "sk-live-55829a8fbc89221a8cd34ee"  # Production key for access
-DB_URI = "mongodb+srv://admin:password123@cluster0.mongodb.net/test"
+logger = logging.getLogger(__name__)
 
-def handle_user_request(request_data):
-    # Direct database connection inside controller layer
-    client = pymongo.MongoClient(DB_URI)
-    db = client.user_database
-    
-    # Quick insertion without error handling
-    db.users.insert_one({"user": request_data['username'], "email": request_data['email']})
-    print("User inserted successfully!")
+# ========================================================
+# Config: Loaded securely via environment / secret manager
+# ========================================================
+class AppConfig:
+    API_SECRET_KEY = os.getenv("API_SECRET_KEY")
+    DB_URI = os.getenv("DB_URI")
+
+    @classmethod
+    def validate(cls):
+        if not cls.DB_URI:
+            raise EnvironmentError("Missing DB_URI environment variable.")
+
+# ========================================================
+# Repository Layer: Isolation of MongoDB queries & storage
+# ========================================================
+class UserRepository:
+    def __init__(self, client: pymongo.MongoClient):
+        self.collection = client.user_database.users
+
+    def create_user(self, username: str, email: str) -> Dict[str, Any]:
+        try:
+            res = self.collection.insert_one({"user": username, "email": email})
+            return {"id": str(res.inserted_id), "user": username, "email": email}
+        except PyMongoError as err:
+            logger.error("Repository persistence error: %s", err)
+            raise
+
+# Shared connection pool client
+_client: Optional[pymongo.MongoClient] = None
+def get_repo() -> UserRepository:
+    global _client
+    if _client is None:
+        AppConfig.validate()
+        _client = pymongo.MongoClient(AppConfig.DB_URI)
+    return UserRepository(_client)
+
+# ========================================================
+# Controller: Functional block with try/catch error safety
+# ========================================================
+def handle_user_request(request_data: Dict[str, Any]):
+    try:
+        if not isinstance(request_data, dict):
+            return {"error": "Invalid payload format"}, 400
+        
+        username = request_data.get('username')
+        email = request_data.get('email')
+        if not username or not email:
+            return {"error": "Fields 'username' and 'email' are required"}, 400
+
+        repo = get_repo()
+        user = repo.create_user(username, email)
+        logger.info("User created successfully: %s", username)
+        return {"status": "success", "data": user}, 201
+    except Exception as exc:
+        logger.exception("Controller execution failure: %s", exc)
+        return {"error": "Internal processing failure"}, 500
`;

export const ARCHITECTURE_RULES: ArchitectureRule[] = [
  {
    id: 'rule-repository-pattern',
    name: 'Repository Layer Pattern Enforcement',
    category: 'architecture',
    description: 'Every database interaction MUST use the repository layer pattern. Raw SQL queries or direct DB library calls inside views/controllers are strictly forbidden.',
    documentationQuote: 'Every database interaction MUST use the repository layer pattern. Raw SQL queries or direct DB library calls inside views/controllers are strictly forbidden.',
    status: 'violated',
    severity: 'critical',
    lineNumbers: [10, 11, 14],
    recommendation: 'Extract database initialization and queries into a dedicated UserRepository class. Inject or resolve the repository inside the controller rather than binding controller code directly to pymongo.',
  },
  {
    id: 'rule-hardcoded-secrets',
    name: 'Environment Variable & Secret Management',
    category: 'security',
    description: 'Sensitive environment variables (API keys, secrets, tokens) must never be hardcoded. They must be loaded via process environment configs or secret managers.',
    documentationQuote: 'Sensitive environment variables (API keys, secrets, tokens) must never be hardcoded. They must be loaded via process environment configs or secret managers.',
    status: 'violated',
    severity: 'critical',
    lineNumbers: [5, 6],
    recommendation: 'Immediately revoke both API_SECRET_KEY and the MongoDB cluster password. Fetch them dynamically via os.getenv() or a KMS / Vault secret manager.',
  },
  {
    id: 'rule-try-catch-handling',
    name: 'Comprehensive Try-Catch Error Boundary',
    category: 'reliability',
    description: 'All functional blocks must contain basic try-catch error handling logic to prevent runtime exceptions.',
    documentationQuote: 'All functional blocks must contain basic try-catch error handling logic to prevent runtime exceptions.',
    status: 'violated',
    severity: 'high',
    lineNumbers: [8, 14],
    recommendation: 'Wrap handle_user_request logic in structured try/except blocks to intercept KeyError on request_data and PyMongoError on database execution.',
  }
];

export const SECURITY_VULNERABILITIES: SecurityVulnerability[] = [
  {
    cwe: 'CWE-798',
    title: 'Hard-coded API Secret Key Leak',
    severity: 'critical',
    lineNumber: 5,
    snippet: 'API_SECRET_KEY = "sk-live-55829a8fbc89221a8cd34ee"',
    description: 'Production API secret key exposed directly in source code. Any reader with repository access can impersonate the service.',
    remediation: 'Rotate the exposed key immediately in production provider console. Replace with os.getenv("API_SECRET_KEY").',
  },
  {
    cwe: 'CWE-798',
    title: 'Hard-coded Database Credentials in Connection URI',
    severity: 'critical',
    lineNumber: 6,
    snippet: 'DB_URI = "mongodb+srv://admin:password123@cluster0.mongodb.net/test"',
    description: 'Administrative credentials (admin:password123) for MongoDB Atlas cluster hardcoded in code.',
    remediation: 'Change cluster admin password. Load database connection string from environment configuration.',
  },
  {
    cwe: 'CWE-400',
    title: 'Unbounded Connection Pool Creation / Resource Exhaustion',
    severity: 'high',
    lineNumber: 10,
    snippet: 'client = pymongo.MongoClient(DB_URI)',
    description: 'Creating a new MongoClient on every request triggers heavy socket overhead, leading to server thread and connection exhaustion under moderate traffic.',
    remediation: 'Instantiate MongoClient as a singleton or scoped service reused across requests.',
  },
  {
    cwe: 'CWE-754',
    title: 'Improper Input Check Leading to KeyError Denial-of-Service',
    severity: 'medium',
    lineNumber: 14,
    snippet: "request_data['username'], request_data['email']",
    description: 'Direct dictionary indexing without existence validation triggers unhandled KeyError when malformed payloads are supplied.',
    remediation: 'Use request_data.get() with explicit field validation and defensive payload checks.',
  }
];

export const DUAL_AGENT_TRACKS: AgentTrack[] = [
  {
    id: 'devsecops',
    agentName: 'GuardrailAI DevSecOps Specialist',
    title: 'Security & Secret Inspection Track',
    framework: 'IBM Bob 2.0 Agentic Framework · Security Engine',
    avatarIcon: 'ShieldAlert',
    status: 'flagged',
    verdict: 'BLOCKED · 2 Critical Vulnerabilities (CWE-798, CWE-400)',
    summary: 'Detected 2 high-entropy hardcoded secrets in source code (live API key and MongoDB admin connection string), plus connection leak hazards.',
    findingsCount: 4,
    steps: [
      {
        id: 'sec-1',
        timestamp: '14:02:11.204',
        phase: 'Entropy & Secret Scanning',
        thought: 'Scanning global constants and string literals for API key formats and credentials.',
        detail: 'Flagged line 5: API_SECRET_KEY matches live secret pattern (sk-live-*). Plaintext credential exposure.',
        verdict: 'flagged',
        ruleRef: 'CWE-798 / Rule 2'
      },
      {
        id: 'sec-2',
        timestamp: '14:02:11.289',
        phase: 'Database URI Credential Extraction',
        thought: 'Analyzing MongoDB connection string parameters.',
        detail: 'Flagged line 6: DB_URI contains plaintext authentication pair "admin:password123". Critical exposure of production data store.',
        verdict: 'flagged',
        ruleRef: 'CWE-798 / Rule 2'
      },
      {
        id: 'sec-3',
        timestamp: '14:02:11.341',
        phase: 'Resource Lifecycle & DoS Audit',
        thought: 'Evaluating pymongo client lifecycle inside request handler handle_user_request.',
        detail: 'Flagged line 10: Instantiating pymongo.MongoClient(DB_URI) inside controller creates a fresh TCP socket pool per request. Risk of socket starvation.',
        verdict: 'flagged',
        ruleRef: 'CWE-400'
      },
      {
        id: 'sec-4',
        timestamp: '14:02:11.412',
        phase: 'Payload Parsing & Boundary Sanitization',
        thought: 'Checking dictionary access on user-controlled input.',
        detail: 'Flagged line 14: Direct indexing request_data["username"] without validation or sanitization throws unhandled KeyError.',
        verdict: 'flagged',
        ruleRef: 'CWE-754 / Rule 3'
      }
    ]
  },
  {
    id: 'architect',
    agentName: 'GuardrailAI Senior Code Architect',
    title: 'Software Architecture & Compliance Track',
    framework: 'IBM Bob 2.0 Agentic Framework · Architecture Engine',
    avatarIcon: 'Layers',
    status: 'flagged',
    verdict: 'CHANGES REQUESTED · 3 ARCHITECTURE.md Guideline Violations',
    summary: 'Code directly couples presentation layer with data driver, bypasses repository pattern, uses hardcoded configs, and lacks exception boundaries.',
    findingsCount: 3,
    steps: [
      {
        id: 'arch-1',
        timestamp: '14:02:11.215',
        phase: 'Layered Architecture Compliance (Rule 1)',
        thought: 'Checking database interaction patterns against ARCHITECTURE.md.',
        detail: 'VIOLATION OF RULE 1: Controller "handle_user_request" directly invokes pymongo.MongoClient and db.users.insert_one(). Bypasses mandatory repository layer.',
        verdict: 'flagged',
        ruleRef: 'ARCHITECTURE.md - Rule 1'
      },
      {
        id: 'arch-2',
        timestamp: '14:02:11.294',
        phase: 'Configuration & Twelve-Factor Compliance (Rule 2)',
        thought: 'Checking configuration loading mechanisms against ARCHITECTURE.md.',
        detail: 'VIOLATION OF RULE 2: API_SECRET_KEY and DB_URI defined statically in code rather than loaded from environment configs or secret managers.',
        verdict: 'flagged',
        ruleRef: 'ARCHITECTURE.md - Rule 2'
      },
      {
        id: 'arch-3',
        timestamp: '14:02:11.365',
        phase: 'Fault Tolerance & Resilience Boundary (Rule 3)',
        thought: 'Inspecting exception handling and recovery workflows in functional blocks.',
        detail: 'VIOLATION OF RULE 3: Function "handle_user_request" contains 0 try-catch blocks. Any database network partition or malformed request will crash runtime unhandled.',
        verdict: 'flagged',
        ruleRef: 'ARCHITECTURE.md - Rule 3'
      },
      {
        id: 'arch-4',
        timestamp: '14:02:11.430',
        phase: 'Code Quality & Production Standards',
        thought: 'Evaluating observability and logging practices.',
        detail: 'Flagged line 15: Raw print() statement used instead of structured logger with level semantics (logging.info / logging.error).',
        verdict: 'flagged',
        ruleRef: 'Best Practices'
      }
    ]
  }
];

export const GITHUB_MARKDOWN_COMMENT = `## GuardrailAI Pull Request Review Summary

**Status:** 🔴 **CHANGES REQUESTED** (Policy & Security Violations Detected)  
**Execution Engine:** IBM Bob 2.0 Agentic Framework (Dual-Track Parallel Analysis)  
**Reviewed Changes:** \`controllers/user_controller.py\`

---

### Parallel Track Analysis Findings

#### 1. DevSecOps Security Track
* **[CRITICAL] Hardcoded Live API Secret Key (CWE-798 / Rule 2 Violation):**  
  Line 5 hardcodes an active production secret: \`API_SECRET_KEY = "sk-live-55829a8fbc89221a8cd34ee"\`.  
  *Action Required:* Revoke and rotate this credential immediately in the service provider console; fetch dynamically from environment variables.
* **[CRITICAL] Hardcoded Database Credentials (CWE-798 / Rule 2 Violation):**  
  Line 6 exposes administrative credentials in plaintext (\`admin:password123\`) in the connection URI: \`DB_URI = "mongodb+srv://admin:password123@cluster0.mongodb.net/test"\`.  
  *Action Required:* Rotate MongoDB cluster password and read connection URI from \`os.getenv("DB_URI")\`.
* **[HIGH] Connection Lifecycle / Resource Exhaustion (CWE-400):**  
  Line 10 instantiates \`pymongo.MongoClient(DB_URI)\` inside \`handle_user_request\`. Creating a new client on each request leaks sockets and exhausts database connection pools.
* **[MEDIUM] Missing Payload Validation / Denial-of-Service Risk (CWE-754):**  
  Direct dictionary indexing \`request_data['username']\` on user input will raise an unhandled \`KeyError\` if any parameter is missing.

#### 2. Software Architect Track (Cross-Referencing \`ARCHITECTURE.md\`)
* **[BLOCKING] Rule 1 Violation — Repository Layer Pattern Required:**  
  *Guideline:* *"Every database interaction MUST use the repository layer pattern. Raw SQL queries or direct DB library calls inside views/controllers are strictly forbidden."*  
  *Finding:* Controller \`handle_user_request\` directly instantiates MongoDB connections and calls \`db.users.insert_one(...)\`.
* **[BLOCKING] Rule 2 Violation — No Hardcoded Secrets/Variables:**  
  *Guideline:* *"Sensitive environment variables (API keys, secrets, tokens) must never be hardcoded. They must be loaded via process environment configs or secret managers."*  
  *Finding:* Static definitions of \`API_SECRET_KEY\` and \`DB_URI\` in module scope violate Twelve-Factor app architecture.
* **[BLOCKING] Rule 3 Violation — Mandatory Try-Catch Error Handling:**  
  *Guideline:* *"All functional blocks must contain basic try-catch error handling logic to prevent runtime exceptions."*  
  *Finding:* \`handle_user_request\` contains zero \`try...except\` blocks; database timeouts or payload errors crash execution without fallback responses.

---

### Ready-to-Commit Code Patch

\`\`\`python
import os
import logging
from typing import Any, Dict, Optional
import pymongo
from pymongo.errors import PyMongoError

logger = logging.getLogger(__name__)

# ========================================================
# 1. Configuration: Loaded safely via environment variables
# ========================================================
class AppConfig:
    API_SECRET_KEY = os.getenv("API_SECRET_KEY")
    DB_URI = os.getenv("DB_URI")

    @classmethod
    def validate(cls) -> None:
        if not cls.DB_URI:
            raise EnvironmentError("Missing required environment variable: DB_URI")


# ========================================================
# 2. Repository Layer: Data access encapsulation (Rule 1)
# ========================================================
class UserRepository:
    def __init__(self, client: pymongo.MongoClient, database_name: str = "user_database"):
        self.db = client[database_name]
        self.collection = self.db["users"]

    def create_user(self, username: str, email: str) -> Dict[str, Any]:
        """Encapsulated database interaction with native PyMongo exception handling."""
        try:
            result = self.collection.insert_one({"user": username, "email": email})
            return {"id": str(result.inserted_id), "user": username, "email": email}
        except PyMongoError as err:
            logger.error("Failed to insert user into MongoDB: %s", err)
            raise


# Reusable connection pool client (avoids per-request socket leaks)
_mongo_client: Optional[pymongo.MongoClient] = None

def get_user_repository() -> UserRepository:
    global _mongo_client
    if _mongo_client is None:
        AppConfig.validate()
        _mongo_client = pymongo.MongoClient(AppConfig.DB_URI, serverSelectionTimeoutMS=5000)
    return UserRepository(_mongo_client)


# ========================================================
# 3. Controller Layer: Input validation & try-catch (Rule 3)
# ========================================================
def handle_user_request(request_data: Dict[str, Any], repo: Optional[UserRepository] = None) -> tuple[Dict[str, Any], int]:
    """Controller entry point with explicit try-catch error boundary and input checks."""
    try:
        if not isinstance(request_data, dict):
            return {"status": "error", "message": "Invalid request payload format."}, 400

        username = request_data.get('username')
        email = request_data.get('email')

        if not username or not email:
            return {"status": "error", "message": "Missing required fields: 'username' and 'email'."}, 400

        # Interacting with the database via Repository Layer only
        user_repo = repo or get_user_repository()
        created_user = user_repo.create_user(username=username, email=email)
        
        logger.info("User created successfully: %s", username)
        return {
            "status": "success",
            "message": "User inserted successfully!",
            "data": created_user
        }, 201

    except PyMongoError as db_err:
        logger.error("Database connection failure in handle_user_request: %s", db_err)
        return {"status": "error", "message": "Database service unavailable."}, 503

    except Exception as exc:
        logger.exception("Unexpected error in handle_user_request: %s", exc)
        return {"status": "error", "message": "Internal server error occurred."}, 500
\`\`\`
`;
