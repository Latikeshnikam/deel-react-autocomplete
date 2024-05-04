import { render, fireEvent, screen } from "@testing-library/react";
import Dropdown from ".";

describe("Dropdown", () => {
  it("renders dropdown items with correct styling and handles click events", () => {
    const filteredData = ["Item 1", "Item 2", "Item 3"];
    const handleClick = jest.fn();
    const highlightMatch = (item: string) => <span>{item}</span>;

    render(
      <Dropdown
        filteredData={filteredData}
        handleClick={handleClick}
        highlightMatch={highlightMatch}
      />
    );

    const dropdownItems = filteredData.map((item) =>
      screen.getByText(item, { exact: false })
    );

    dropdownItems.forEach((item, index) => {
      expect(item).toBeInTheDocument();
      fireEvent.click(item);
      expect(handleClick).toHaveBeenCalledWith(filteredData[index]);
    });
  });
});
