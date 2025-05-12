import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Details from "../components/Dashboard Components/Details";
import axios from "axios";
import { toast } from "react-hot-toast";

// Mock dependencies
jest.mock("axios");
jest.mock("react-hot-toast", () => ({
  Toaster: () => null,
  toast: {
    error: jest.fn(),
    promise: jest.fn(),
  },
}));

// Mock icons
jest.mock("lucide-react", () => ({
  CirclePlus: () => <div data-testid="circle-plus-icon" />,
  PlusCircle: () => <div data-testid="plus-circle-icon" />,
}));

// Mock Loading_Dashboard
jest.mock("../components/Dashboard Components/Loading_Dashboard", () => () => (
  <div data-testid="loading-dashboard">Loading...</div>
));

// Mock DashboardDropDown
jest.mock("../components/DashboardDropDown", () => ({
  __esModule: true,
  default: ({ setSampleData }) => (
    <div data-testid="dashboard-dropdown" onClick={() => setSampleData("Test")}>
      Dropdown
    </div>
  ),
}));

const mockFormData = {
  goals: [{ Goal: "Save money", Value: "10000" }],
  balanceTracker: {
    currentBalance: "50000",
    totalAmount: "100000",
  },
  moneyInMoneyOut: {
    moneyIn: "20000",
    moneyOut: "10000",
    previousBalance: "40000",
  },
  moneyDistribution: [
    { category: "Food", amount: 5000, color: "hsl(var(--chart-1))" },
  ],
  expectedIncome: {
    moneyIn: "30000",
    expected: "35000",
  },
  expectedBudget: {
    expenses: "15000",
    budget: "20000",
  },
  billsBudget: {
    bills: "8000",
    budget: "10000",
  },
  debtsPaymentGoal: {
    debtsPaid: "20000",
    goal: "50000",
  },
  savingsGoal: {
    moneySaved: "25000",
    goal: "100000",
  },
  miscellaneousExpenses: {
    expenses: "2000",
    budget: "5000",
  },
  expenseCategories: [
    { category: "Food", amount: 5000, color: "hsl(var(--chart-1))" },
  ],
  billsCategories: [
    { category: "Rent", amount: 15000, color: "hsl(var(--chart-1))" },
  ],
  debtsCategories: [
    { category: "Loan", amount: 50000, color: "hsl(var(--chart-1))" },
  ],
  incomeSourcesGraph: [{ source: "Salary", amount: 50000 }],
  investmentDistributionGraph: [{ type: "Stocks", amount: 10000 }],
  notes: "Test notes",
};

describe("Details Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();

    axios.get.mockImplementation((url) => {
      if (url.includes("/auth/user")) {
        return Promise.resolve({ data: { ID: "123" } });
      }
      if (url.includes("/api/details")) {
        return Promise.resolve({ data: { data: mockFormData } });
      }
      return Promise.reject(new Error("Invalid URL"));
    });
  });

  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    console.log.mockRestore();
  });

  it("fetches and displays user data on mount", async () => {
    await act(async () => {
      render(<Details />);
    });

    await waitFor(() => {
      expect(screen.getByText("Details")).toBeInTheDocument();
      expect(screen.getByText("Goals")).toBeInTheDocument();
      expect(screen.getByText("Balance Info")).toBeInTheDocument();
    });
  });

});
