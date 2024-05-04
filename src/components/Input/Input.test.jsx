import { render, fireEvent, screen } from "@testing-library/react";
import Input from ".";

test("renders input component", () => {
  const placeholderText = "Enter text...";
  const onChange = jest.fn();
  render(<Input value="" onChange={onChange} placeholder={placeholderText} />);

  const inputElement = screen.getByPlaceholderText(placeholderText);

  expect(inputElement).toBeInTheDocument();

  fireEvent.change(inputElement, { target: { value: "test" } });

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith("test");
});
