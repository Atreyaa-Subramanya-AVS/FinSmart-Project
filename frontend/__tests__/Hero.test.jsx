import React from "react";
import { render, screen } from "@testing-library/react";
import Hero from "../components/Hero";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

describe("Hero Component", () => {
  beforeEach(() => {
    // Clear all localStorage before each test
    localStorage.clear();
  });

  it("should render Hero component and link to /dashboard by default", () => {
    render(<Hero />);

    const button = screen.getByRole("button", { name: /go to dashboard/i });
    expect(button).toBeInTheDocument();

    const link = button.closest("a");
    expect(link).toHaveAttribute("href", "/signin");
  });

  it("should link to /signin if user is logged in", async () => {
    localStorage.setItem("username", "testuser");
    localStorage.setItem("email", "test@example.com");
    localStorage.setItem("profilePicture", "test.png");

    render(<Hero />);

    const button = await screen.findByRole("button", {
      name: /go to dashboard/i,
    });
    const link = button.closest("a");
    expect(link).toHaveAttribute("href", "/signin");
  });

  it("renders the feature list", () => {
    render(<Hero />);
    const features = [
      "Budget Planner",
      "Investement Tracker",
      "Financial Workspace",
      "AI Smart Chat",
      "AI Recommendations",
    ];

    features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });
});
