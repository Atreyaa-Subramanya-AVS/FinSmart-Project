import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SigninOTP from "../components/SigninOTP";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { act } from "react-dom/test-utils";

// Mocks
jest.mock("axios");
jest.mock("react-hot-toast");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("lucide-react", () => ({
  MinusIcon: () => <svg data-testid="minus-icon" />,
}));

describe("SigninOTP Component", () => {
  const mockPush = jest.fn();
  const mockSetEmailToParent = jest.fn();

  beforeEach(() => {
    useRouter.mockReturnValue({ push: mockPush });
    // Mock the /auth/user call
    axios.get.mockResolvedValue({
      status: 200,
      data: {
        ID: "123",
        username: "TestUser",
        email: "test@example.com",
        profilePicture: "http://img.test/profile.jpg",
      },
    });
    jest.useFakeTimers();
    localStorage.clear();
    mockPush.mockReset();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  afterEach(() => {
    // Wrap timer cleanup in act to avoid warnings
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it("renders user email, username and picture", async () => {
    // Wrap render in act so useEffect fetchUserData updates are flushed
    await act(async () => {
      render(
        <SigninOTP setEmailToParent={mockSetEmailToParent} showOTP={true} />
      );
    });

    // waitFor the username to appear
    await waitFor(() =>
      expect(screen.getByText("TestUser")).toBeInTheDocument()
    );
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
    expect(screen.getByAltText("profilePic")).toBeInTheDocument();

    // parent setter should have been called
    expect(mockSetEmailToParent).toHaveBeenCalledWith("test@example.com");
  });

  it("displays OTP timer and disables Submit initially", async () => {
    await act(async () => {
      render(
        <SigninOTP setEmailToParent={mockSetEmailToParent} showOTP={true} />
      );
    });

    // Wait for the timer text
    await screen.findByText(/OTP expires in:/);

    // Submit button is disabled until a full 6‑digit OTP is entered
    const submitBtn = screen.getByRole("button", { name: /submit/i });
    expect(submitBtn).toBeDisabled();
  });

  it("counts down timer every second", async () => {
    await act(async () => {
      render(
        <SigninOTP setEmailToParent={mockSetEmailToParent} showOTP={true} />
      );
    });

    // Initially shows 02:00
    expect(await screen.findByText("02:00")).toBeInTheDocument();

    // Advance 1 second
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByText("01:59")).toBeInTheDocument();

    // Advance to expiry
    act(() => {
      jest.advanceTimersByTime(119000);
    });
    expect(screen.getByText(/OTP has been Expired!/)).toBeInTheDocument();
  });
});
