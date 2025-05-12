import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Home from "../components/Dashboard Components/Home";

// Mock axios
jest.mock("axios");

// Mock Loading_Dashboard component
jest.mock("../components/Dashboard Components/Loading_Dashboard", () => () => (
  <div data-testid="loading-dashboard">Loading...</div>
));

// Mock recharts components
jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => <div data-testid="pie-cell" />,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: ({ children }) => <div>{children}</div>,
  CartesianGrid: () => null,
  XAxis: () => null,
  Label: () => null,
  LabelList: () => null,
}));

// Mock icons
jest.mock("lucide-react", () => ({
  ArrowUpDown: () => <div data-testid="arrow-updown-icon" />,
  Banknote: () => <div data-testid="banknote-icon" />,
  BanknoteIcon: () => <div data-testid="banknote-icon" />,
  ChartPie: () => <div data-testid="chart-pie-icon" />,
  Coins: () => <div data-testid="coins-icon" />,
  CoinsIcon: () => <div data-testid="coins-icon" />,
  HandCoins: () => <div data-testid="hand-coins-icon" />,
  PiggyBank: () => <div data-testid="piggy-bank-icon" />,
  Pizza: () => <div data-testid="pizza-icon" />,
  ReceiptIndianRupee: () => <div data-testid="receipt-rupee-icon" />,
  ShoppingBag: () => <div data-testid="shopping-bag-icon" />,
  Triangle: () => <div data-testid="triangle-icon" />,
}));

describe("Home Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: { ID: "123" } });
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it("renders loading state initially", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/auth/user")) {
        return Promise.resolve({ data: { ID: "123" } });
      }
      return Promise.resolve({ data: { data: null } });
    });

    render(<Home />);
    expect(screen.getByTestId("loading-dashboard")).toBeInTheDocument();
  });

  it("renders no data message when data is empty", async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes("/auth/user")) {
        return Promise.resolve({ data: { ID: "123" } });
      }
      return Promise.resolve({ data: { data: null } });
    });

    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /No Data Available\. Add your Details from the "Details" Tab\./
        )
      ).toBeInTheDocument();
    });
  });
});
