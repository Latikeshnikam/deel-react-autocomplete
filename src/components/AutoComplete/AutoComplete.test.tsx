import { render, fireEvent, screen } from "@testing-library/react";
import AutoComplete from ".";

describe("AutoComplete", () => {
  it("does not render dropdown when input value is empty", () => {
    const data = ["Item 1", "Item 2", "Item 3"];
    render(<AutoComplete data={data} />);

    const input = screen.getByPlaceholderText("Search for countries...");
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "" } });

    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Item 3")).not.toBeInTheDocument();
  });
});
