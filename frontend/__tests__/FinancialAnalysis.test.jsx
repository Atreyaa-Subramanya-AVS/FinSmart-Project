import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import FinancialAnalysis from "../components/Dashboard Components/FinancialAnalysis";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock ldrs (loader)
jest.mock("ldrs", () => ({
  leapfrog: Object.assign(() => <div data-testid="loader">Loading...</div>, {
    register: jest.fn(),
  }),
}));

// Mock icons
jest.mock("lucide-react", () => ({
  SendHorizontal: () => <svg data-testid="send-icon" />,
}));

// Mock ReactMarkdown
jest.mock("react-markdown", () => ({ children }) => <>{children}</>);
jest.mock("remark-gfm", () => () => {});

describe("FinancialAnalysis", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("renders UI after fetching data", async () => {
    axios.get.mockResolvedValueOnce({ data: { ID: "user-id" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<FinancialAnalysis />);

    await screen.findByText("Generate Financial Plan");

    expect(screen.getByPlaceholderText("Ask for insights...")).toBeInTheDocument();
    expect(screen.getByText("Generate Financial Plan")).toBeInTheDocument();
  });

  it("allows typing and pressing Enter", async () => {
    axios.get.mockResolvedValueOnce({ data: { ID: "user-id" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<FinancialAnalysis />);
    const textarea = await screen.findByPlaceholderText("Ask for insights...");

    fireEvent.change(textarea, { target: { value: "Hello world" } });
    expect(textarea.value).toBe("Hello world");

    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

    await waitFor(() =>
      expect(screen.getByText("Generate Financial Plan")).toBeInTheDocument()
    );
  });

  it("submits analysis request and shows result", async () => {
    axios.get.mockResolvedValueOnce({ data: { ID: "user-id" } });
    axios.get.mockResolvedValueOnce({ data: { data: [] } });

    axios.post.mockResolvedValueOnce({
      data: { response: "Goals: Save money\nIncome Sources: Job" },
    });

    render(<FinancialAnalysis />);
    const textarea = await screen.findByPlaceholderText("Ask for insights...");

    fireEvent.change(textarea, { target: { value: "Request analysis" } });

    const button = screen.getByText("Generate Financial Plan");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Generate Financial Plan")).toBeInTheDocument();
    });
  });
});
