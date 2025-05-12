import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chatbot from "../components/Dashboard Components/Chatbot";

const mockPost = jest.fn();

beforeEach(() => {
  HTMLDivElement.prototype.scrollIntoView = jest.fn();
});

// Mock axios
jest.mock("axios", () => ({
  post: (...args) => mockPost(...args),
}));

// Mock ldrs spinner
jest.mock("ldrs", () => ({
  leapfrog: Object.assign(() => <div data-testid="loader">Loading...</div>, {
    register: jest.fn(), // Include register as a mocked function
  }),
}));

// Mock icons
jest.mock("lucide-react", () => ({
  SendHorizontal: () => <svg data-testid="send-icon" />,
}));

// Mock react-markdown to just return its children
jest.mock("react-markdown", () => ({ children }) => <>{children}</>);

// Mock remark-gfm plugin (no-op function)
jest.mock("remark-gfm", () => () => {});

describe("Chatbot Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockPost.mockReset();
  });

  it("renders initial UI correctly", () => {
    render(<Chatbot />);
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ask your financial questions to our integrated AI chatbot."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Powered by Gemini Flash.")).toBeInTheDocument();
  });

  it("prevents sending empty message", () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("sends message and shows AI reply", async () => {
    const reply = "AI reply here.";
    mockPost.mockResolvedValueOnce({ data: { reply } });

    render(<Chatbot />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello AI" } });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Hello AI")).toBeInTheDocument();
      expect(screen.getByText(reply)).toBeInTheDocument();
    });
  });

  it("handles API failure", async () => {
    mockPost.mockRejectedValueOnce(new Error("Fail"));

    render(<Chatbot />);
    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: "Fail test" },
    });
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        screen.getByText("Oops! Something went wrong. Please try again later.")
      ).toBeInTheDocument();
    });
  });

  it("loads messages from sessionStorage", () => {
    const mockMessages = [
      { role: "User", text: "Hey there" },
      { role: "AI", text: "Hello user!" },
    ];
    sessionStorage.setItem("chatMessages", JSON.stringify(mockMessages));

    render(<Chatbot />);
    expect(screen.getByText("Hey there")).toBeInTheDocument();
    expect(screen.getByText("Hello user!")).toBeInTheDocument();
  });

  it("calls scrollIntoView", async () => {
    render(<Chatbot />);

    fireEvent.click(screen.getByRole("button"));

    expect(HTMLDivElement.prototype.scrollIntoView).toHaveBeenCalled();
  });
});