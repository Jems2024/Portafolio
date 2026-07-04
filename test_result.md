#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Portfolio web premium cinematográfico para Jared Durón, filmmaker & graphic designer basado en Barcelona.
  Debe posicionarse como uno de los mejores portfolios de filmmaker de Barcelona, optimizado para captar
  trabajo con productoras, agencias, estudios de publicidad y marcas premium.
  Multi-idioma ES/EN/CA, SEO completo, integración real con proyectos Behance de jaredduron.
  Datos del CV: filmmaker + graphic designer, +7 años exp, clientes reales (KNX, WWF, John Deere, BCIE,
  Grupo Roble, Miniso), teléfono +34 637 43 42 35, email jaredmisaelduron@gmail.com.

backend:
  - task: "Contact form endpoint - POST /api/contact"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "POST /api/contact accepts { name, email, company, budget, projectType, message, locale }, validates required fields (name, email, message), stores in MongoDB collection 'contact_leads' with UUID id and ISO timestamp. Returns { ok:true, id } on success or { error } with 400/500. Uses cached MongoClient. Requires MONGO_URL and optional DB_NAME env vars."
        - working: true
          agent: "testing"
          comment: "✅ ALL TESTS PASSED. Verified: (1) Happy path with full payload returns 200 with valid UUID v4 id, (2) Data persists correctly to MongoDB collection 'contact_leads' with all fields including createdAt ISO timestamp, (3) Validation correctly rejects missing name/email/message with 400 error, (4) Minimal payload (name+email+message) works with correct defaults (company/budget/projectType=null, locale='es'), (5) CORS headers present in all responses."

  - task: "Health check endpoint - GET /api"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "GET /api and GET /api/health should return { ok:true, service:'jared-duron-portfolio' }. Any other path should return 404."
        - working: true
          agent: "testing"
          comment: "✅ ALL TESTS PASSED. Verified: (1) GET /api returns 200 with correct JSON body {ok:true, service:'jared-duron-portfolio'}, (2) GET /api/health returns identical response, (3) Both include CORS headers (Access-Control-Allow-Origin: *), (4) Unknown paths (GET/POST /api/nonexistent) correctly return 404 with {error:'Not found'}."

  - task: "CORS + OPTIONS support"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "OPTIONS returns 204 with Access-Control-Allow-Origin/Methods/Headers. All GET/POST responses include CORS headers via cors() helper."
        - working: true
          agent: "testing"
          comment: "✅ ALL TESTS PASSED. Verified: (1) OPTIONS /api/contact returns 204 status, (2) CORS headers present: Access-Control-Allow-Origin=*, Access-Control-Allow-Methods includes POST, Access-Control-Allow-Headers=* (wildcard allows all headers including Content-Type), (3) All GET/POST responses include CORS headers. Note: Cloudflare proxy enhances headers to wildcard which is more permissive than code's explicit list."

frontend:
  - task: "Cinematic hero with video + Play Reel modal"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Full-screen hero with Pexels cinematic video (poster fallback). Play Reel button opens modal with controls-enabled video."

  - task: "Behance real projects gallery + modal"
    implemented: true
    working: "NA"
    file: "/app/app/page.js and /app/lib/projects.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "12 real projects from Behance jaredduron with cover images (Behance CDN). Modal shows real gallery images and VIEW ON BEHANCE CTA. Dior project removed per user request."

  - task: "About with real profile photo + updated bio + 4 stats"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Uses real photo from customer-assets. Bio mentions real clients (KNX, WWF, John Deere, BCIE, Grupo Roble, Miniso, Juan Lucho, Prósperos). Stats: 7+ years, 120+ projects, 30+ premium brands, 2 disciplines (Film & Design). Countries filmed stat removed."

  - task: "Floating WhatsApp button on all pages"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Green WhatsApp button appears bottom-right after scrolling 400px. Uses wa.me/34637434235 with pre-filled localized message. Animated ping ring, tooltip on hover."

  - task: "Multi-language ES/EN/CA switcher"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "Language toggle in nav switches all T strings live and persists to localStorage."

metadata:
  created_by: "main_agent"
  version: "2.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Portfolio Jared Durón MVP finalizado con datos reales del CV y proyectos Behance.
        Solo el backend necesita testing. Frontend está verificado visualmente via screenshots.
        Backend endpoints a testear:
        1. GET /api → debe devolver { ok:true, service:'jared-duron-portfolio' }
        2. GET /api/health → mismo comportamiento
        3. POST /api/contact con { name, email, message } válidos → debe devolver { ok:true, id:<uuid> } y persistir en MongoDB (colección contact_leads)
        4. POST /api/contact sin campos requeridos → debe devolver 400 con error
        5. OPTIONS /api → debe devolver 204 con headers CORS
        6. GET /api/path-inexistente → debe devolver 404
        Base URL: {NEXT_PUBLIC_BASE_URL}/api (leer de /app/.env)
        NO probar frontend todavía (esperar autorización del usuario).
    - agent: "testing"
      message: |
        ✅ BACKEND TESTING COMPLETE - ALL TESTS PASSED (6/6 test suites)
        
        Tested all backend API endpoints at https://filmmaker-barcelona.preview.emergentagent.com/api
        
        Results:
        1. ✅ Health Endpoints (GET /api, GET /api/health) - Working correctly
        2. ✅ CORS Preflight (OPTIONS /api/contact) - Working correctly  
        3. ✅ Contact Happy Path (POST /api/contact with full data) - Working correctly, MongoDB persistence verified
        4. ✅ Contact Validation (missing required fields) - Working correctly
        5. ✅ Contact Minimal Payload (only required fields) - Working correctly with proper defaults
        6. ✅ Unknown Paths (404 handling) - Working correctly
        
        MongoDB verification: All contact form submissions persist correctly to 'contact_leads' collection with UUID ids, ISO timestamps, and all expected fields.
        
        No critical issues found. Backend is production-ready.