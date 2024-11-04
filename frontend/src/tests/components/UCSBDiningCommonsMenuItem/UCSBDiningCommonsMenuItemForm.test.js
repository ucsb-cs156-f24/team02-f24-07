import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemsFixtures } from "fixtures/ucsbDiningCommonsMenuItemsFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItemForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );
    await screen.findByText(/Name/);
    await screen.findByText(/Dining Commons Code/);
    await screen.findByText(/Station/);
    await screen.findByText(/Create/);
    await screen.findByText(/Cancel/);
  });

  test("Renders correctly when passing in a ucsbDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm
          initialContents={ucsbDiningCommonsMenuItemsFixtures.oneUcsbDiningCommonsMenuItem}
        />
      </Router>
    );

    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-id");
    expect(screen.getByText(/Id/)).toBeInTheDocument();
    expect(screen.getByTestId("UCSBDiningCommonsMenuItemForm-id")).toHaveValue("1");
  });

  test("correct Error messages on bad input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );

    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "123" } });  // Invalid code
    fireEvent.change(nameField, { target: { value: "a".repeat(31) } });  // Over 30 chars
    fireEvent.change(stationField, { target: { value: "Test Station" } });
    fireEvent.click(submitButton);

    await screen.findByText(/Name must be 30 characters or less/);
    expect(screen.getByText(/Name must be 30 characters or less/)).toBeInTheDocument();
  });

  test("Displays correct error messages on empty input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );

    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");
    fireEvent.click(submitButton);

    await screen.findByText(/Dining Commons Code is required/);
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();
  });

  test("No error messages on valid input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>
    );

    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode");
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "valid_code" } });
    fireEvent.change(nameField, { target: { value: "Valid Name" } });
    fireEvent.change(stationField, { target: { value: "Valid Station" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());
  });

  test("Calls navigate(-1) when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>
    );

    const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel");
    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
