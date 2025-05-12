import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Illustration from "../components/Illustration";

jest.mock("next/image", () => (props) => {
  return <img {...props} alt={props.alt || "mocked image"} />;
});

describe("Illustration", () => {
  test("renders main heading correctly", () => {
    render(<Illustration />);
    expect(
      screen.getByText(/Analyze\. Predict\. Invest\./i)
    ).toBeInTheDocument();
  });

  test("renders description paragraph", () => {
    render(<Illustration />);

    const paragraphText =
      /Make smarter investments with FinSmart's AI-powered Indian stock analysis/i;

    expect(screen.getByText(paragraphText)).toBeInTheDocument();
  });

  test("renders image with alt text", () => {
    render(<Illustration />);
    expect(screen.getByAltText(/Bg-Image/i)).toBeInTheDocument();
  });
});
