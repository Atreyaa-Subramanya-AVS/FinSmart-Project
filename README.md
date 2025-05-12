
# FinSmart 

FinSmart is an AI-powered personal finance management system designed to help users make informed financial decisions. It offers features like financial health tracking, AI-driven insights, stock suggestions, expense analysis, and integration with authentication providers (Google/GitHub). The system architecture includes a secure backend (Node.js + Express), MongoDB, Gemini AI API integration, and a responsive frontend built with React.

## Key Features

-  Google and GitHub OAuth Authentication
-  Financial Analysis and AI Insights (Gemini API)
-  Secure Login, Logout, and Token Handling
-  AI Chatbot for Finance Queries
-  Webhook-based Real-Time Updates
-  Security and Load Testing Implemented
-  Full Stack Test Coverage (Jest, Supertest)
-  CI/CD Deployment Ready

---

##  Test Traceability Matrix

To ensure quality and requirement coverage, we have developed and validated the following backend and frontend test cases. For detailed mapping, refer to the markdown file below:

 [View Traceability Matrix](FinSmart_Traceability_Matrix.md)

---

##  Technologies Used

- **Frontend:** React, Tailwind CSS, Chart.js
- **Backend:** Node.js, Express, MongoDB
- **AI:** Google Gemini API
- **Testing:** Jest, Supertest
- **DevOps:** GitHub Actions, CI/CD pipelines

---

##  Project Structure

```
FinSmart-Project/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── tests/
│   └── ...
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── __tests__/
│   └── ...
└── FinSmart_Traceability_Matrix.md
```
