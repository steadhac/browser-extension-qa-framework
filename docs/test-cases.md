# APIsec BOLT Extension - Test Cases

## Test Suite: Extension Loading (EL)

### EL-001: Load Extension Successfully

**Objective:** Verify extension service worker loads successfully  
**Prerequisites:** Extension installed in browser  
**Steps:**

1. Launch browser with extension
2. Wait for service worker registration
3. Verify service worker count > 0
4. Extract and validate extension ID

**Expected Result:** Extension ID extracted successfully, service worker active  
**Browser:** Chrome ✅ | Edge ❌  
**Priority:** P0 - Critical

---

### EL-002: Extension Pages Accessible

**Objective:** Verify extension UI pages are accessible  
**Prerequisites:** Extension loaded (EL-001)  
**Steps:**

1. Navigate to chrome-extension://{id}/panel.html
2. Verify page loads successfully
3. Validate page title exists

**Expected Result:** Panel page loads with valid title  
**Browser:** Chrome ✅ | Edge ❌  
**Priority:** P0 - Critical

---

## Test Suite: Edge Cases (EC)

### EC-001: Export with No Data

**Objective:** Verify export behavior when no API calls captured  
**Prerequisites:** Extension loaded and started  
**Steps:**

1. Start capture
2. Do not make any API calls
3. Attempt to export OAS

**Expected Result:** Export button disabled OR empty OAS with valid structure  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### EC-002: Concurrent API Calls

**Objective:** Verify extension handles 50 concurrent requests  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Fire 50 concurrent GET requests
3. Wait for completion
4. Export and validate OAS

**Expected Result:** All endpoints captured, OAS paths > 0  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### EC-003: Different HTTP Methods

**Objective:** Verify GET, POST, PUT, PATCH, DELETE capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Make requests with each HTTP method
3. Export OAS
4. Validate methods documented

**Expected Result:** All HTTP methods captured in OAS  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### EC-004: Failed Requests (404s)

**Objective:** Verify 404 error requests are captured  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Make request to invalid endpoint (404)
3. Export OAS
4. Verify error captured

**Expected Result:** 404 request included in OAS or handled gracefully  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### EC-005: Race Condition - Rapid Start/Stop

**Objective:** Verify extension survives rapid UI clicking  
**Prerequisites:** Extension panel open  
**Steps:**

1. Rapidly click start/stop 10 times
2. Verify extension still functional
3. Make API call and export

**Expected Result:** Extension remains functional, export succeeds  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### EC-006: Multiple Exports

**Objective:** Verify multiple consecutive exports work  
**Prerequisites:** Extension capturing data  
**Steps:**

1. Capture API traffic
2. Export OAS 3 times consecutively
3. Validate all exports succeed

**Expected Result:** All 3 exports succeed with valid OAS  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### EC-007: Large Payload (10MB)

**Objective:** Verify extension handles 10MB request body  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. POST 10MB payload
3. Wait for processing
4. Export and validate

**Expected Result:** Large request captured, OAS generated successfully  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### EC-008: Special Characters & XSS

**Objective:** Verify input sanitization and XSS prevention  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Make requests with XSS attempts, Unicode, emojis, path traversal
3. Export OAS
4. Validate JSON parses without errors

**Expected Result:** OAS valid JSON, no code injection  
**Browser:** Chrome ✅  
**Priority:** P0 - Critical (Security)

---

### EC-009: Invalid JSON Request

**Objective:** Verify malformed JSON handling  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. POST malformed JSON: `{this is not valid json}`
3. Export OAS
4. Validate OAS structure

**Expected Result:** Extension handles gracefully, OAS still valid  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### EC-010: Network Timeout

**Objective:** Verify export works with pending requests  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Trigger slow request (10s timeout)
3. Export immediately (don't wait for response)
4. Validate export succeeds

**Expected Result:** Export succeeds despite pending request  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

## Test Suite: Toggle Functionality (TF)

### TF-001: Toggle Capture On/Off

**Objective:** Verify start/stop capture toggle  
**Prerequisites:** Extension panel open  
**Steps:**

1. Click Start
2. Verify stop button appears
3. Click Stop
4. Verify capture stopped

**Expected Result:** UI reflects capture state accurately  
**Browser:** Chrome ✅  
**Priority:** P0 - Critical

---

### TF-002: Capture Only When Started

**Objective:** Verify data captured only when active  
**Prerequisites:** Extension panel open  
**Steps:**

1. Make API call (capture OFF)
2. Start capture
3. Make another API call
4. Export and validate

**Expected Result:** Only second call captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TF-003: Multiple Start/Stop Cycles

**Objective:** Verify multiple toggle cycles work  
**Prerequisites:** Extension panel open  
**Steps:**

1. Start → Capture → Stop (3 cycles)
2. Verify each cycle works
3. Export final data

**Expected Result:** All cycles functional, data captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TF-004: State Persists During Navigation

**Objective:** Verify capture continues across page navigation  
**Prerequisites:** Capture started  
**Steps:**

1. Start capture
2. Navigate to page 1, make API call
3. Navigate to page 2, make API call
4. Export and validate

**Expected Result:** Both API calls captured despite navigation  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

## Test Suite: Full Workflow (FW)

### FW-001: Complete Workflow

**Objective:** Validate full end-to-end workflow  
**Prerequisites:** Extension installed  
**Steps:**

1. Navigate to test website
2. Open extension, start capture
3. Make API calls (GET, POST)
4. Export OAS
5. Validate OAS structure

**Expected Result:** Complete workflow succeeds, valid OAS generated  
**Browser:** Chrome ✅  
**Priority:** P0 - Critical

---

### FW-002: Multi-Endpoint Capture

**Objective:** Verify multiple endpoints with different methods  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Call /posts (GET, POST, PUT, DELETE)
3. Call /users (GET)
4. Export and validate

**Expected Result:** Multiple endpoints captured with various methods  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### FW-003: Concurrent Request Workflow

**Objective:** Validate workflow with concurrent load  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Fire 10 concurrent requests
3. Export OAS
4. Validate all captured

**Expected Result:** All concurrent requests captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### FW-004: Start/Stop/Restart Workflow

**Objective:** Verify workflow across capture cycles  
**Prerequisites:** Extension panel open  
**Steps:**

1. Start, capture data, stop
2. Restart, capture more data
3. Export final OAS
4. Validate cumulative data

**Expected Result:** Data from both cycles captured  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### FW-005: Multiple Export Workflow

**Objective:** Verify multiple exports in one session  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture, make API call
2. Export 3 times consecutively
3. Validate all exports

**Expected Result:** All 3 exports succeed with consistent data  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

## Test Suite: Traffic Capture (TC)

### TC-001: Basic REST Capture

**Objective:** Verify basic REST API capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. GET /posts/1
3. GET /users/1
4. Export and validate

**Expected Result:** Both endpoints captured in OAS  
**Browser:** Chrome ✅  
**Priority:** P0 - Critical

---

### TC-002: JSON Content Type

**Objective:** Verify JSON request/response handling  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. POST with JSON body
3. Export OAS
4. Validate JSON schema

**Expected Result:** JSON content captured correctly  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TC-003: Query Parameters

**Objective:** Verify query string capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. GET /posts?userId=1
3. GET /posts?\_limit=5&\_page=1
4. Export and validate

**Expected Result:** Query parameters documented in OAS  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TC-004: Path Parameters

**Objective:** Verify dynamic path detection  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. GET /posts/1, /posts/2, /posts/3
3. Export OAS
4. Validate path parameterization

**Expected Result:** Path parameter detected (e.g., /posts/{id})  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TC-005: Header Capture

**Objective:** Verify request/response header documentation  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. POST with custom headers
3. Export OAS
4. Validate headers documented

**Expected Result:** Headers included in OAS  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### TC-006: Concurrent Traffic

**Objective:** Verify capture under concurrent load  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Fire 10 concurrent requests
3. Export and validate

**Expected Result:** All concurrent requests captured without loss  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TC-007: Multi-Endpoint Accuracy

**Objective:** Verify multiple endpoint capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Call /posts, /users, /comments
3. Export OAS
4. Validate all endpoints present

**Expected Result:** >= 2 endpoints captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### TC-008: Success and Error Responses

**Objective:** Verify both 2xx and error status capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Make successful request (200)
3. Make failed request (404)
4. Export and validate

**Expected Result:** Both response types captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

## Test Suite: GraphQL Capture (GQL)

### GQL-001: Query Capture

**Objective:** Verify GraphQL query detection  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. POST GraphQL query to endpoint
3. Export OAS
4. Validate query captured

**Expected Result:** GraphQL query captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### GQL-002: Mutation Capture

**Objective:** Verify GraphQL mutation detection  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. POST GraphQL mutation with variables
3. Export OAS
4. Validate mutation captured

**Expected Result:** Mutation and variables captured  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### GQL-003: Multiple Operations

**Objective:** Verify batch GraphQL operation capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Send 3 different GraphQL queries
3. Export and validate

**Expected Result:** All GraphQL operations captured  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### GQL-004: Introspection Query

**Objective:** Verify schema introspection capture  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Send \_\_schema introspection query
3. Export OAS
4. Validate captured

**Expected Result:** Introspection query captured  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

### GQL-005: Error Handling

**Objective:** Verify invalid GraphQL query handling  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Send invalid GraphQL query
3. Export OAS
4. Validate error handled

**Expected Result:** Error response captured gracefully  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

## Test Suite: Plugin UI (UI)

### UI-001: Panel Rendering

**Objective:** Verify extension panel loads with UI elements  
**Prerequisites:** Extension installed  
**Steps:**

1. Open extension panel
2. Verify Start button visible
3. Verify Export button exists in DOM

**Expected Result:** Essential UI elements present  
**Browser:** Chrome ✅  
**Priority:** P0 - Critical

---

### UI-002: Button State Changes

**Objective:** Verify start button state transitions  
**Prerequisites:** Panel open  
**Steps:**

1. Verify Start button enabled
2. Click Start
3. Verify state change (stop button appears OR text changes)

**Expected Result:** UI reflects capture state  
**Browser:** Chrome ✅  
**Priority:** P0 - Critical

---

### UI-003: Export Disabled (No Data)

**Objective:** Verify export button disabled without data  
**Prerequisites:** Panel open, no capture  
**Steps:**

1. Start and stop capture immediately
2. Check export button state

**Expected Result:** Export button disabled or hidden  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### UI-004: Export Enabled (With Data)

**Objective:** Verify export button enabled with captured data  
**Prerequisites:** Data captured  
**Steps:**

1. Start capture
2. Make API call
3. Check export button state

**Expected Result:** Export button enabled and visible  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### UI-005: Panel Title Display

**Objective:** Verify panel title/branding  
**Prerequisites:** Panel open  
**Steps:**

1. Open panel
2. Get page title
3. Validate non-empty

**Expected Result:** Title displayed  
**Browser:** Chrome ✅  
**Priority:** P3 - Low

---

### UI-006: UI Responsiveness During Capture

**Objective:** Verify UI remains responsive while capturing  
**Prerequisites:** Extension capturing  
**Steps:**

1. Start capture
2. Make API calls
3. Bring panel to foreground
4. Verify UI interactive

**Expected Result:** UI buttons remain clickable/visible  
**Browser:** Chrome ✅  
**Priority:** P1 - High

---

### UI-007: Panel Reopen

**Objective:** Verify panel can be reopened after closing  
**Prerequisites:** Panel opened once  
**Steps:**

1. Open panel, verify title
2. Close panel
3. Reopen panel
4. Verify title again

**Expected Result:** Panel reopens successfully  
**Browser:** Chrome ✅  
**Priority:** P2 - Medium

---

## Summary Statistics

| Suite     | Total Tests | Priority P0 | Priority P1 | Priority P2 | Priority P3 |
| --------- | ----------- | ----------- | ----------- | ----------- | ----------- |
| EL        | 2           | 2           | 0           | 0           | 0           |
| EC        | 10          | 1           | 5           | 4           | 0           |
| TF        | 4           | 1           | 3           | 0           | 0           |
| FW        | 5           | 1           | 2           | 2           | 0           |
| TC        | 8           | 1           | 5           | 2           | 0           |
| GQL       | 5           | 0           | 2           | 3           | 0           |
| UI        | 7           | 2           | 3           | 1           | 1           |
| **Total** | **41**      | **8**       | **20**      | **12**      | **1**       |

## Priority Definitions

- **P0 - Critical:** Core functionality, must pass for release
- **P1 - High:** Important features, should pass
- **P2 - Medium:** Edge cases, can have known issues
- **P3 - Low:** Nice to have, cosmetic issues acceptable

```

```
