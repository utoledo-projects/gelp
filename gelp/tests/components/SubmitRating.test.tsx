/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react";
import SubmitRating from "@/components/SubmitRating";

describe("SubmitRating", () => {

  it("renders submit button", () => {
    render(<SubmitRating />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("button is disabled initially", () => {
    render(<SubmitRating />);
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
  });

  it("handles click event without crashing", () => {
    render(<SubmitRating />);
    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(button).toBeInTheDocument();
  });

  it("renders multiple times without crashing", () => {
    render(<SubmitRating />);
    render(<SubmitRating />);

    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("renders component container", () => {
    const { container } = render(<SubmitRating />);
    expect(container).toBeTruthy();
  });

});