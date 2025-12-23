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

  This test suite focuses on validating the end-to-end workflow of the APIsec BOLT browser extension. It ensures that the extension performs as expected across all critical user journeys, from initialization to traffic capture and export. The scenarios covered include:

  - **FW-001:** Verifying extension initialization and loading in the browser.
  - **FW-002:** Testing the ability to start and stop API traffic capture.
  - **FW-003:** Validating the accuracy of captured REST API traffic.
  - **FW-004:** Validating the accuracy of captured GraphQL API traffic.
  - **FW-005:** Exporting captured traffic as an OpenAPI (OAS) file and verifying its contents.

  These tests ensure that the extension operates seamlessly in a real-world environment and that the exported OAS files meet the expected standards.

#### System Testing

**Focus:** Complete system validation across all features

- All test suites (EL, EC, TF, TC, GQL, UI)

  This refers to the comprehensive set of test suites designed to validate the functionality, reliability, and performance of the APIsec BOLT browser extension. Each suite focuses on a specific aspect of the extension:

  
  - **EL Suite (EL-001 to EL-003):** Tests related to the initialization and loading of the extension in the browser. These ensure that the extension is correctly loaded and ready for use without errors.
  - **EC Suite (EC-001 to EC-005):** Focuses on fault tolerance and error handling. These tests validate how the extension behaves under unexpected or extreme conditions, such as invalid inputs or network failures.
  - **TF Suite (TF-001 to TF-003):** Verifies the start/stop capture controls of the extension. These tests ensure that users can reliably toggle traffic capture on and off.
  - **TC Suite (TC-001 to TC-004):** Tests the accuracy and completeness of captured REST API traffic. These ensure that all relevant API calls are intercepted and recorded correctly.
  - **GQL Suite (GQL-001 to GQL-003):** Similar to the TC suite but focuses specifically on GraphQL API traffic. These tests validate the extension's ability to capture and process GraphQL queries and mutations.
  - **UI Suite (UI-001 to UI-004):** Tests the functionality and usability of the extension's user interface. These ensure that all UI elements, such as buttons and menus, work as expected and provide a seamless user experience.

  Together, these test suites provide full coverage of the extension's functionality, ensuring that it meets quality standards and performs reliably in real-world scenarios.

#### Compatibility Testing

**Focus:** Cross-browser validation

- Chrome: Full test coverage (expected pass)
- Edge: Compatibility validation (expected fail, documented)

### 2.2 Test Types

#### Functional Testing

- **Extension loading (EL suite):**  
  This suite focuses on verifying the initialization and loading of the APIsec BOLT browser extension in supported browsers. It ensures that the extension is correctly loaded without errors, is visible in the browser's extensions list, and is ready for use. Tests include scenarios such as loading the extension in different browser versions and validating its manifest file.
  - **EL-001:** Verify extension initialization in Chrome.
  - **EL-002:** Verify extension initialization in Edge.
  - **EL-003:** Validate the extension manifest file.

- **Capture controls (TF suite):**  
  This suite tests the functionality of the extension's start/stop capture controls. It ensures that users can reliably toggle traffic capture on and off, and that the extension correctly reflects the capture state in its UI. Scenarios include starting capture, stopping capture, and verifying that no traffic is captured when the extension is in the "stopped" state.
  - **TF-001:** Start traffic capture and verify state.
  - **TF-002:** Stop traffic capture and verify no traffic is captured.
  - **TF-003:** Toggle capture state multiple times and validate behavior.
 
- **Traffic capture accuracy (TC, GQL suites):**  
  These suites validate the extension's ability to accurately capture API traffic. The **TC suite** focuses on REST API traffic, ensuring that all relevant HTTP requests and responses are intercepted and recorded. The **GQL suite** focuses on GraphQL traffic, verifying that queries, mutations, and their responses are captured correctly. Both suites include tests for edge cases, such as handling large payloads and concurrent requests.
  - **TC-001:** Validate REST API traffic capture for GET requests.
  - **TC-002:** Validate REST API traffic capture for POST requests.
  - **TC-003:** Handle large REST API payloads.
  - **TC-004:** Concurrent REST API requests.
  - **GQL-001:** Validate GraphQL query capture.
  - **GQL-002:** Validate GraphQL mutation capture.
  - **GQL-003:** Handle large GraphQL payloads.

- **UI functionality (UI suite):**  
  This suite ensures that the extension's user interface is functional, intuitive, and responsive. It tests all UI elements, such as buttons, menus, and dialogs, to ensure they work as expected. Scenarios include verifying the visibility and functionality of the start/stop buttons, export options, and error messages. The suite also checks for UI consistency across different screen resolutions and browser settings.
  - **UI-001:** Verify start/stop buttons functionality.
  - **UI-002:** Validate export options in the UI.
  - **UI-003:** Check error messages for invalid inputs.
  - **UI-004:** Ensure UI consistency across resolutions.

#### Non-Functional Testing

- **Performance:** Concurrent request handling (500+ requests)  
  This testing ensures that the extension can handle a high volume of concurrent API requests without performance degradation or failures. The goal is to validate that the extension remains responsive and accurately captures traffic even when subjected to heavy loads, such as 500+ simultaneous requests.
  - **PER-001:** Validate the extension's ability to handle 500+ concurrent API requests without performance degradation.
  - **PER-002:** Measure response time under heavy load and ensure it remains within acceptable limits.
  - **PER-003:** Verify memory usage does not exceed 1GB during high-concurrency scenarios.
  - **PER-004:** Ensure the extension remains responsive during prolonged high-load testing.


- **Stress:** Large payload testing (10MB payloads)  
  Stress testing focuses on the extension's ability to process unusually large API payloads, such as requests or responses with sizes up to 10MB. This ensures that the extension can handle edge cases involving large data transfers without crashing, slowing down, or losing data.
  - **STR-001:** Test the extension's ability to process API payloads of 10MB or larger without crashing.
  - **STR-002:** Validate the extension's behavior when subjected to rapid bursts of API traffic.
  - **STR-003:** Simulate network latency and packet loss to ensure the extension handles degraded network conditions gracefully.


- **Reliability:** Multi-export, state persistence  
  Reliability testing verifies that the extension maintains consistent behavior over time and across multiple operations. This includes testing scenarios such as exporting captured traffic multiple times in a row, ensuring that the exported data is accurate, and validating that the extension retains its state (e.g., captured data) even after toggling capture on/off or during browser restarts.
  - **REL-001:** Verify the extension can export captured traffic multiple times without data corruption.
  - **REL-002:** Ensure the extension retains its state (e.g., captured data) after toggling capture on/off.
  - **REL-003:** Validate state persistence across browser restarts.
  - **REL-004:** Test the extension's ability to handle repeated start/stop capture cycles without errors.

- **Security:** XSS prevention, input sanitization  
  Security testing ensures that the extension is protected against common vulnerabilities, such as Cross-Site Scripting (XSS) attacks. It also validates that all user inputs and captured data are properly sanitized to prevent malicious code execution. This is critical for ensuring the safety of users and the integrity of the extension.
  - **SEC-001:** Validate that all user inputs are sanitized to prevent Cross-Site Scripting (XSS) attacks.
  - **SEC-002:** Test the extension's ability to handle malicious API payloads without executing harmful scripts.
  - **SEC-003:** Ensure sensitive data (e.g., API keys) is not exposed in logs or exported files.
  - **SEC-004:** Verify that the extension does not introduce vulnerabilities, such as open ports or insecure communication channels.

#### Regression Testing

- Full suite execution on code changes (requires CI/CD pipeline)
- Automated via CI/CD (planned for future implementation)

### 2.3 Test Automation Approach

#### Framework

- **Tool:** Playwright with TypeScript  
  Playwright is used for browser automation, providing reliable and fast testing across multiple browsers (e.g., Chrome, Edge). TypeScript ensures type safety, making the test code more maintainable and less prone to runtime errors.

- **Pattern:** Page Object Model (POM)  
  The Page Object Model abstracts UI interactions into reusable classes, improving test readability and maintainability. Each page or component of the application is represented as a class, encapsulating its locators and actions.

- **Architecture:** Fixture-based for reusability  
  Custom Playwright fixtures are used to set up and tear down the browser context, load the extension, and inject reusable page objects. This ensures consistent test environments, reduces boilerplate code, and allows shared context across tests.

#### Page Objects

- `ExtensionPanel` - Extension UI interactions  
  This page object represents the browser extension's user interface. It encapsulates all interactions with the extension's panel, such as starting and stopping traffic capture, exporting captured data, and verifying the state of the extension. By centralizing these interactions, the `ExtensionPanel` ensures that tests remain maintainable and reusable even if the UI changes.

- `TargetWebsitePage` - Test website API calls  
  This page object represents the target website used for testing API traffic capture. It provides methods to simulate API calls (e.g., REST or GraphQL requests) that the extension is expected to capture. By abstracting these interactions, the `TargetWebsitePage` simplifies test logic and ensures consistency across test cases.

#### Fixtures

- `extensionFixture` - Browser context with extension loaded  
  The `extensionFixture` is a custom Playwright fixture that sets up a browser context with the APIsec BOLT extension preloaded. It ensures that the extension is consistently loaded in the browser for all tests, providing a clean and isolated environment. This fixture also injects reusable page objects (e.g., `ExtensionPanel`, `TargetWebsitePage`) into the test context, simplifying test setup and teardown.

- Centralized constants in `sample-apis.ts`  
  The `sample-apis.ts` file contains centralized constants for API endpoints and test data used across the test suites. By storing these values in a single location, the framework avoids hardcoding URLs or data in individual tests, making it easier to update and maintain. This approach ensures consistency and reduces duplication, improving the overall reliability of the tests.

## 3. Test Environment

### 3.1 Hardware
- **OS:** macOS, Windows, Linux  
  The testing framework is designed to be cross-platform, ensuring compatibility with major operating systems. This allows the tests to be executed in diverse environments, reflecting real-world usage scenarios.

- **RAM:** Minimum 8GB  
  A minimum of 8GB of RAM is required to ensure smooth execution of the browser-based tests, especially when running multiple tests concurrently or handling large payloads during stress testing.

- **Disk:** 1GB free space for test artifacts  
  At least 1GB of free disk space is needed to store test artifacts, such as screenshots, video recordings, and exported OpenAPI (OAS) files generated during test execution.

### 3.2 Software

- **Browsers:** Chrome (latest), Edge (latest)  
  The framework supports testing on the latest versions of Chrome and Edge to ensure compatibility with modern browsers. This reflects the primary target environments for the APIsec BOLT extension.

- **Node.js:** v18+  
  Node.js is required to run the Playwright framework and the test scripts. Version 18 or higher is recommended to leverage the latest features and maintain compatibility with the framework.

- **Playwright:** Latest version  
  Playwright is the core testing tool used for browser automation. Using the latest version ensures access to the most recent features, bug fixes, and browser support.

- **Extension:** APIsec BOLT v1.0.0  
  The tests are designed for version 1.0.0 of the APIsec BOLT extension. This ensures that the tests align with the specific features and functionality of this version.

### 3.3 Test Data
- **Public APIs:** jsonplaceholder.typicode.com  
  This is a widely used public REST API that provides placeholder data for testing. It is used to simulate real-world API traffic, such as GET, POST, PUT, and DELETE requests, allowing the extension to capture and process REST API interactions.

- **GraphQL API:** countries.trevorblades.com  
  This is a public GraphQL API that provides data about countries, including their names, codes, and continents. It is used to test the extension's ability to capture and process GraphQL queries and mutations, ensuring compatibility with GraphQL traffic.

- **Centralized:** fixtures/sample-apis.ts  
  This file centralizes all API endpoints and test data used across the test suites. By storing these constants in a single location, the framework avoids hardcoding values in individual tests, making it easier to update and maintain. This approach ensures consistency and reduces duplication, improving the reliability of the tests.

## 4. Test Deliverables
### 4.1 Documentation

- ✅ **Test Plan (this document):**  
  This document outlines the overall testing strategy, including the scope, objectives, test levels, types, environment, and deliverables. It serves as a blueprint for the testing process and ensures alignment among stakeholders.

- ✅ **Test Cases with IDs:**  
  A detailed list of test cases, each with a unique identifier, describing the specific scenarios to be tested. These include preconditions, test steps, expected results, and actual results. The test cases ensure comprehensive coverage of all functionalities.

- ✅ **Test Results Report:**  
  A report summarizing the outcomes of test executions, including pass/fail statuses, defect details, and metrics such as test coverage and execution time. This report provides insights into the quality of the extension and highlights areas requiring improvement.

- ✅ **Coverage Analysis:**  
  An analysis of the test coverage, identifying which parts of the codebase, features, or user journeys are covered by the tests. This ensures that critical areas are adequately tested and helps identify gaps in the testing process.

### 4.2 Artifacts

- **Test execution reports (HTML):**  
  These reports provide a detailed summary of the test execution results, including the status of each test (pass/fail), execution time, and any errors encountered. The HTML format makes it easy to review and share the results with stakeholders.

- **Screenshots on failure:**  
  Screenshots are automatically captured when a test fails, providing a visual representation of the issue. These are invaluable for debugging and understanding the exact state of the application at the time of failure.

- **Video recordings (on failure):**  
  Video recordings capture the entire test execution process, allowing testers to review the sequence of actions leading to a failure. This is particularly useful for identifying intermittent issues or verifying complex workflows.

- **Downloaded OAS files (validation):**  
  The OpenAPI Specification (OAS) files generated by the extension during testing are downloaded and validated. These files are used to ensure that the captured API traffic is accurately represented and meets the expected standards.

## 5. Test Schedule

### 5.1 Execution Frequency

- **Daily:** Full regression suite (manually triggered or scheduled via scripts)
- **On PR:** Affected test suites (manually identified and executed)
- **Release:** Complete validation + manual exploratory

### 5.2 Estimated Duration

- Full suite: ~15-20 minutes
- Single suite: ~2-3 minutes
- Smoke tests: ~5 minutes

## 6. Entry and Exit Criteria
### 6.1 Entry Criteria

- ✅ **Extension build available:**  
  A stable and testable build of the APIsec BOLT extension must be available. This ensures that the tests are executed on a version of the extension that is ready for validation.

- ✅ **Test environment configured:**  
  The test environment, including hardware, software, and network configurations, must be set up and verified. This ensures consistency and reliability during test execution.

- ✅ **All dependencies installed:**  
  All required dependencies, such as Node.js, Playwright, and other libraries, must be installed and up to date. This ensures that the test framework runs without errors.

- ✅ **Browser drivers updated:**  
  The latest versions of browser drivers (e.g., ChromeDriver, EdgeDriver) must be installed to ensure compatibility with the browsers being tested.

### 6.2 Exit Criteria

- ✅ **All critical tests passing (EL, FW, TC):**  
  All critical test suites, including Extension Loading (EL), Full Workflow (FW), and Traffic Capture (TC), must pass successfully. This ensures that the core functionalities of the extension are working as expected.

- ✅ **95%+ pass rate overall:**  
  The overall pass rate for all test suites must be 95% or higher. This ensures that the majority of the extension's features are functioning correctly.

- ✅ **No P0/P1 bugs open:**  
  All Priority 0 (critical) and Priority 1 (high) bugs must be resolved before exiting the testing phase. This ensures that no major issues are present in the extension.

- ✅ **Test report generated:**  
  A comprehensive test report must be generated, summarizing the test results, pass/fail statuses, and any identified issues. This report provides stakeholders with a clear understanding of the extension's quality.

## 7. Risk Assessment

### 7.1 High Risk Areas

- **Concurrent request handling:** Tested with 500+ requests  
  Handling a high volume of concurrent API requests is a critical risk area. The extension must remain responsive and accurately capture traffic under heavy load. Failure to handle concurrency could result in missed requests, performance degradation, or crashes.

- **Large payload processing:** 10MB payload tests  
  Large API payloads, such as requests or responses with sizes up to 10MB, pose a risk to the extension's stability and performance. The extension must process these payloads without crashing, slowing down, or losing data.

- **Race conditions:** Rapid UI interaction tests  
  Rapid or simultaneous user interactions, such as toggling capture on/off quickly or exporting data while capturing, can lead to race conditions. These scenarios may cause unexpected behavior, data corruption, or crashes if not handled properly.

### 7.2 Mitigation

- **Comprehensive edge case testing (EC suite):**  
  The Edge Cases (EC) test suite is designed to simulate and validate the extension's behavior under extreme or unexpected conditions. This includes invalid inputs, network failures, and rapid user interactions.

- **Performance validation (stress tests):**  
  Stress tests are conducted to evaluate the extension's performance under heavy load, such as handling 500+ concurrent requests or processing large payloads. These tests ensure that the extension remains stable and responsive.

- **UI stability testing (UI suite):**  
  The User Interface (UI) test suite focuses on validating the stability and reliability of the extension's UI under various scenarios. This includes testing rapid interactions, verifying state persistence, and ensuring that the UI remains functional and responsive.

## 8. Roles and Responsibilities

| Role          | Responsibility                         |
| ------------- | -------------------------------------- |
| QA Engineer   | Test execution, reporting, maintenance |
| Developer     | Bug fixes, test support                |
| Product Owner | Requirements validation                |

## 9. Tools and Technologies

- **Playwright** - Browser automation  
  Playwright is used to automate browser interactions, enabling reliable and efficient testing across multiple browsers (e.g., Chrome, Edge). It supports modern web features and provides powerful debugging tools.

- **TypeScript** - Type-safe test code  
  TypeScript ensures type safety in the test code, reducing runtime errors and improving maintainability. It provides better developer experience with features like autocompletion and static type checking.

- **VS Code** - IDE with Playwright extension  
  Visual Studio Code is the integrated development environment (IDE) used for writing and managing test scripts. The Playwright extension enhances the development experience by providing debugging tools and test execution capabilities directly within the IDE.

- **Git** - Version control  
  Git is used to manage the source code and test scripts, enabling collaboration, version tracking, and rollback capabilities. It ensures that changes to the test framework are tracked and can be reviewed.

- **GitHub Actions** - CI/CD (future)  
  GitHub Actions is planned for future integration to automate the execution of test suites in a Continuous Integration/Continuous Deployment (CI/CD) pipeline. This will ensure that tests are run automatically on code changes, providing faster feedback and improving development efficiency.

## 10. Success Metrics

- **Pass Rate:** Target 95%+  
  The goal is to achieve a pass rate of 95% or higher for all automated tests, ensuring that the majority of critical functionalities are working as expected.

- **Coverage:** All critical user journeys  
  The test framework aims to cover all critical user journeys, ensuring that the most important workflows are thoroughly tested and validated.

- **Execution Time:** < 20 minutes for full suite  
  The full regression suite should execute in under 20 minutes to provide quick feedback to developers and maintain efficiency in the testing process.

- **Defect Detection:** Find bugs before release  
  The primary objective of the testing framework is to identify and address defects before the extension is released, ensuring a high-quality product for end users.
```

## 11. Glossary

- **API:** Application Programming Interface, a set of rules that allows different software entities to communicate with each other.
- **CI/CD:** Continuous Integration/Continuous Deployment, a practice of automating the integration and deployment of code changes.
- **EC Suite:** Edge Cases test suite, focusing on fault tolerance and error handling.
- **EL Suite:** Extension Loading test suite, validating the initialization and loading of the extension.
- **FW Suite:** Full Workflow test suite, validating end-to-end functionality of the extension.
- **GQL Suite:** GraphQL Capture test suite, validating the capture and processing of GraphQL API traffic.
- **OAS:** OpenAPI Specification, a standard for defining RESTful APIs.
- **POM:** Page Object Model, a design pattern that abstracts UI interactions into reusable classes.
- **REST:** Representational State Transfer, an architectural style for designing networked applications.
- **TC Suite:** Traffic Capture test suite, validating the accuracy of captured REST API traffic.
- **TF Suite:** Toggle Functionality test suite, verifying the start/stop capture controls of the extension.
- **UI Suite:** User Interface test suite, validating the functionality and usability of the extension's UI.
- **XSS:** Cross-Site Scripting, a security vulnerability that allows attackers to inject malicious scripts into web pages.