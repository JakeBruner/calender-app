// import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Calendar from "./index";

describe("Calendar", () => {
  it("should render the correct month and year", () => {
    const { getByTestId } = render(<Calendar />);

    // Check that the component renders the correct month and year
    expect(getByTestId("month").textContent).toEqual(
      new Date().getMonth()
    );
    expect(getByTestId("year").textContent).toEqual(new Date().getFullYear());
  });

  it("should change the month and year when the user clicks the previous/next buttons", () => {
    const { getByTestId } = render(<Calendar />);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Click the previous button
    fireEvent.click(getByTestId("previous-button"));

    // Check that the month and year are updated
    expect(getByTestId("month").textContent).toEqual(currentMonth - 1);
    expect(getByTestId("year").textContent).toEqual(currentYear);

    // Click the next button
    fireEvent.click(getByTestId("next-button"));

    // Check that the month and year are updated
    expect(getByTestId("month").textContent).toEqual(currentMonth);
    expect(getByTestId("year").textContent).toEqual(currentYear);
  });

  it("should render the correct number of days", () => {
    const { getAllByTestId } = render(<Calendar />);

    // Check that the correct number of days are rendered
    expect(getAllByTestId("day").length).toEqual(
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    );
  });

  it("should highlight the selected day", () => {
    const { getAllByTestId } = render(<Calendar />);

    // Select a day
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fireEvent.click(getAllByTestId("day")[0]!);

    // Check that the selected day is highlighted
    expect(getAllByTestId("day")[0]?.classList.contains("is-selected")).toBe(
      true
    );
  });
});
