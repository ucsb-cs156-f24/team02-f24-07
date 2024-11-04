import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import UCSBDiningCommonsMenuItemForm from "main/components/UCSBDiningCommonsMenuItem/UCSBDiningCommonsMenuItemForm";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("UCSBDiningCommonsMenuItem tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByText(/Dining Commons Code/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in a UCSBDiningCommonsMenuItem", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm initialContents={ucsbDiningCommonsMenuItemFixtures.oneUcsbDiningCommonsMenuItem}/>
      </Router>,
    );
    await screen.findByTestId(/UCSBDiningCommonsMenuItemForm-id/);
    expect(screen.getByText(/ID/)).toBeInTheDocument();
    expect(screen.getByTestId(/UCSBDiningCommonsMenuItemForm-id/)).toHaveValue("1");
  });

  test("Correct Error messsages on missing input", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-submit");


    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

    fireEvent.click(submitButton);

    await screen.findByText(/DiningCommonsCode is required/);
    expect(screen.getByText(/Station is required/)).toBeInTheDocument();
    expect(screen.getByText(/Name is required/)).toBeInTheDocument();
  });

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  test("No Error messsages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm submitAction={mockSubmitAction} />
      </Router>,
    );
    await screen.findByTestId(
      "UCSBDiningCommonsMenuItemForm-diningCommonsCode",
    );

    const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-diningCommonsCode",);
    const stationField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-station",);
    const nameField = screen.getByTestId("UCSBDiningCommonsMenuItemForm-name");
    const submitButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-submit");

    fireEvent.change(diningCommonsCodeField, { target: { value: "1" } });
    fireEvent.change(stationField, { target: { value: "Ortega" } });
    fireEvent.change(nameField, { target: { value: "Pasta" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitAction).toHaveBeenCalledTimes(1);
    });

    expect(
      screen.queryByText(/DiningCommonsCode is required/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Station is required/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Name is required/)).not.toBeInTheDocument();
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <Router>
        <UCSBDiningCommonsMenuItemForm />
      </Router>,
    );
    await screen.findByTestId("UCSBDiningCommonsMenuItemForm-cancel");
    const cancelButton = screen.getByTestId("UCSBDiningCommonsMenuItemForm-cancel",);

    fireEvent.click(cancelButton);

    await waitFor(() => {expect(mockedNavigate).toHaveBeenCalledTimes(1);});
  });
});