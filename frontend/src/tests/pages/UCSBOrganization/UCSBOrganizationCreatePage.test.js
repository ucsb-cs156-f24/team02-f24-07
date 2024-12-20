import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBOrganizationCreatePage from "main/pages/UCSBOrganization/UCSBOrganizationCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("UCSBOrganizationCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    jest.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Organization Code")).toBeInTheDocument();
    });
    expect(
      screen.getByLabelText("Short Organization Translation"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Organization Translation"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Inactive")).toBeInTheDocument();
  });

  test("on submit, makes request to backend, and redirects to /ucsborganization", async () => {
    const queryClient = new QueryClient();
    const organization = {
      orgCode: "osli",
      orgTranslationShort: "STUD LIFE",
      orgTranslation: "OFFICE OF STUDENT LIFE",
      inactive: true,
    };

    axiosMock.onPost("/api/ucsborganization/post").reply(202, organization);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <UCSBOrganizationCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Organization Code")).toBeInTheDocument();
    });

    const codeInput = screen.getByLabelText("Organization Code");
    expect(codeInput).toBeInTheDocument();
    const translationInput = screen.getByLabelText("Organization Translation");
    expect(translationInput).toBeInTheDocument();
    const shortTranslationInput = screen.getByLabelText(
      "Short Organization Translation",
    );
    expect(shortTranslationInput).toBeInTheDocument();
    const inactiveInput = screen.getByLabelText("Inactive");
    expect(inactiveInput).toBeInTheDocument();

    const createButton = screen.getByText("Create");
    expect(createButton).toBeInTheDocument();

    fireEvent.change(codeInput, { target: { value: "osli" } });
    fireEvent.change(translationInput, {
      target: { value: "OFFICE OF STUDENT LIFE" },
    });
    fireEvent.change(shortTranslationInput, { target: { value: "STUD LIFE" } });
    fireEvent.click(inactiveInput);
    fireEvent.click(createButton);

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      orgCode: "osli",
      orgTranslationShort: "STUD LIFE",
      orgTranslation: "OFFICE OF STUDENT LIFE",
      inactive: true,
    });

    // assert - check that the toast was called with the expected message
    expect(mockToast).toBeCalledWith(
      "New organization Created - code: osli short translation: STUD LIFE translation: OFFICE OF STUDENT LIFE inactive: true",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/ucsborganization" });
  });
});
