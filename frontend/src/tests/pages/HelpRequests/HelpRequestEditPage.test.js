import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequests/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

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
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("HelpRequestEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("HelpRequestForm-solved")
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "noahwang1@ucsb.edu",
        teamId: "07",
        tableOrBreakoutRoom: "table",
        requestTime: "2022-01-02T12:00",
        explanation: "help",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 17,
        requesterEmail: "noahwang114@ucsb.edu",
        teamId: "027",
        tableOrBreakoutRoom: "breakout",
        requestTime: "2023-01-02T12:00",
        explanation: "npx error",
        solved: true,
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("HelpRequestForm-solved");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("HelpRequestForm-solved");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail"
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom"
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime"
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation"
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("noahwang1@ucsb.edu");
      expect(teamIdField).toHaveValue("07");
      expect(tableOrBreakoutRoomField).toHaveValue("table");
      expect(requestTimeField).toHaveValue("2022-01-02T12:00");
      expect(explanationField).toHaveValue("help");
      expect(solvedField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestEditPage />
          </MemoryRouter>
        </QueryClientProvider>
      );

      await screen.findByTestId("HelpRequestForm-solved");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail"
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom"
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime"
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation"
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toHaveValue("noahwang1@ucsb.edu");
      expect(teamIdField).toHaveValue("07");
      expect(tableOrBreakoutRoomField).toHaveValue("table");
      expect(requestTimeField).toHaveValue("2022-01-02T12:00");
      expect(explanationField).toHaveValue("help");
      expect(solvedField).not.toBeChecked();
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(idField, { target: { value: "17" } });
      fireEvent.change(requesterEmailField, {
        target: { value: "noahwang114@ucsb.edu" },
      });
      fireEvent.change(teamIdField, { target: { value: "027" } });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "breakout" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2023-01-02T12:00" },
      });
      fireEvent.change(explanationField, { target: { value: "npx error" } });
      fireEvent.click(solvedField);

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Help Request Updated - id: 17 team: 027"
      );
      expect(mockNavigate).toBeCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "noahwang114@ucsb.edu",
          teamId: "027",
          tableOrBreakoutRoom: "breakout",
          requestTime: "2023-01-02T12:00",
          explanation: "npx error",
          solved: true,
        })
      ); // posted object
    });
  });
});
