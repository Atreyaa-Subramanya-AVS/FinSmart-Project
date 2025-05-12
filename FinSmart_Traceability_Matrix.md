# 📋 FinSmart Project - Test Traceability Matrices

## Backend Traceability Matrix (FinSmart)

| Test Case ID | Test File             | Description                                | Requirement ID | Status |
|--------------|-----------------------|--------------------------------------------|----------------|--------|
| TC-BE-01     | db.test.js            | Tests MongoDB connection & operations      | REQ-BE-DB      | Pass   |
| TC-BE-02     | oauth.test.js         | Tests Google/GitHub OAuth login            | REQ-BE-AUTH    | Pass   |
| TC-BE-03     | webhook.test.js       | Tests webhook endpoint & responses         | REQ-BE-WEBHOOK | Pass   |
| TC-BE-04     | security.test.js      | Tests middleware & security headers        | REQ-BE-SEC     | Pass   |
| TC-BE-05     | e2e.test.js           | End-to-End test of login and dashboard     | REQ-BE-E2E     | Pass   |
| TC-BE-06     | ai-insight.test.js    | AI Insight test using Gemini API           | REQ-BE-AI      | Pass   |


## Frontend Traceability Matrix (FinSmart)

| Test Case ID | Test File                     | Description                                  | Requirement ID   | Status |
|--------------|-------------------------------|----------------------------------------------|------------------|--------|
| TC-FE-01     | Home.test.jsx                 | Tests rendering and layout of Home page      | REQ-FE-HOME      | Pass   |
| TC-FE-02     | Hero.test.jsx                 | Tests Hero banner and visuals                | REQ-FE-HERO      | Pass   |
| TC-FE-03     | CircleProgressBar.test.jsx    | Tests financial goal progress component      | REQ-FE-GOAL-VIS  | Pass   |
| TC-FE-04     | Chatbot.test.jsx              | Tests AI Chatbot functionality and UI        | REQ-FE-CHATBOT   | Pass   |
| TC-FE-05     | FinancialAnalysis.test.jsx    | Tests financial analytics visualization      | REQ-FE-ANALYTICS | Pass   |
| TC-FE-06     | Illustration.test.jsx         | Tests static illustrations on UI             | REQ-FE-ILLUST    | Pass   |
| TC-FE-07     | SigninOTP.test.jsx            | Tests OTP verification and input fields      | REQ-FE-OTP       | Pass   |
| TC-FE-08     | Details.test.jsx              | Tests detailed transaction or user info page | REQ-FE-DETAILS   | Pass   |


*Total Test Cases Passed:* 14 Backend + 24 Frontend = *38 Tests Passed*

*Total Test Cases Failed:* 0  u can add this if eanted