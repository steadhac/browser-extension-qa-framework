**2. [docs/test-plan.md](docs/test-plan.md):**

```markdown
# APIsec BOLT Extension - Test Plan

## 1. Overview

### 1.1 Purpose

This test plan defines the testing strategy for the APIsec BOLT browser extension, which captures browser API traffic and generates OpenAPI specifications.

### 1.2 Scope

- ✅ Extension loading and initialization
- ✅ API traffic capture (REST and GraphQL)
- ✅ User interface functionality
- ✅ Edge cases and error handling
- ✅ Performance under load
- ✅ Cross-browser compatibility (Chrome, Edge)

### 1.3 Out of Scope

- ❌ Firefox browser (extension is Chrome-only)
- ❌ Mobile browser testing
- ❌ Production deployment testing

## 2. Test Strategy

### 2.1 Testing Levels

#### Unit Testing

Not in scope - handled by development team

#### Integration Testing

**Focus:** Full workflow tests validating end-to-end functionality

- Test Suite: FW-001 through FW-005
- Validates: Start → Capture → Export → Validate

#### System Testing

**Focus:** Complete system validation across all features

- All test suites (EL, EC, TF, TC, GQL, UI)
- Validates: Extension as complete system

#### Compatibility Testing

**Focus:** Cross-browser validation

- Chrome: Full test coverage (expected pass)
- Edge: Compatibility validation (expected fail, documented)

### 2.2 Test Types

#### Functional Testing

- Extension loading (EL suite)
- Capture controls (TF suite)
- Traffic capture accuracy (TC, GQL suites)
- UI functionality (UI suite)

#### Non-Functional Testing

- **Performance:** Concurrent request handling (500+ requests)
- **Stress:** Large payload testing (10MB payloads)
- **Reliability:** Multi-export, state persistence
- **Security:** XSS prevention, input sanitization

#### Regression Testing

- Full suite execution on code changes
- Automated via CI/CD (future)

### 2.3 Test Automation Approach

#### Framework

- **Tool:** Playwright with TypeScript
- **Pattern:** Page Object Model (POM)
- **Architecture:** Fixture-based for reusability

#### Page Objects

- `ExtensionPanel` - Extension UI interactions
- `TargetWebsitePage` - Test website API calls

#### Fixtures

- `extensionFixture` - Browser context with extension loaded
- Centralized constants in `sample-apis.ts`

## 3. Test Environment

### 3.1 Hardware

- **OS:** macOS, Windows, Linux
- **RAM:** Minimum 8GB
- **Disk:** 1GB free space for test artifacts

### 3.2 Software

- **Browsers:** Chrome (latest), Edge (latest)
- **Node.js:** v18+
- **Playwright:** Latest version
- **Extension:** APIsec BOLT v1.0.0

### 3.3 Test Data

- **Public APIs:** jsonplaceholder.typicode.com
- **GraphQL API:** countries.trevorblades.com
- **Centralized:** fixtures/sample-apis.ts

## 4. Test Deliverables

### 4.1 Documentation

- ✅ Test Plan (this document)
- ✅ Test Cases with IDs
- ✅ Test Results Report
- ✅ Coverage Analysis

### 4.2 Artifacts

- Test execution reports (HTML)
- Screenshots on failure
- Video recordings (on failure)
- Downloaded OAS files (validation)

## 5. Test Schedule

### 5.1 Execution Frequency

- **Daily:** Full regression suite
- **On PR:** Affected test suites
- **Release:** Complete validation + manual exploratory

### 5.2 Estimated Duration

- Full suite: ~15-20 minutes
- Single suite: ~2-3 minutes
- Smoke tests: ~5 minutes

## 6. Entry and Exit Criteria

### 6.1 Entry Criteria

- ✅ Extension build available
- ✅ Test environment configured
- ✅ All dependencies installed
- ✅ Browser drivers updated

### 6.2 Exit Criteria

- ✅ All critical tests passing (EL, FW, TC)
- ✅ 95%+ pass rate overall
- ✅ No P0/P1 bugs open
- ✅ Test report generated

## 7. Risk Assessment

### 7.1 High Risk Areas

- **Concurrent request handling:** Tested with 500+ requests
- **Large payload processing:** 10MB payload tests
- **Race conditions:** Rapid UI interaction tests

### 7.2 Mitigation

- Comprehensive edge case testing (EC suite)
- Performance validation (stress tests)
- UI stability testing (UI suite)

## 8. Roles and Responsibilities

| Role          | Responsibility                         |
| ------------- | -------------------------------------- |
| QA Engineer   | Test execution, reporting, maintenance |
| Developer     | Bug fixes, test support                |
| Product Owner | Requirements validation                |

## 9. Tools and Technologies

- **Playwright** - Browser automation
- **TypeScript** - Type-safe test code
- **VS Code** - IDE with Playwright extension
- **Git** - Version control
- **GitHub Actions** - CI/CD (future)

## 10. Success Metrics

- **Pass Rate:** Target 95%+
- **Coverage:** All critical user journeys
- **Execution Time:** < 20 minutes for full suite
- **Defect Detection:** Find bugs before release
```
