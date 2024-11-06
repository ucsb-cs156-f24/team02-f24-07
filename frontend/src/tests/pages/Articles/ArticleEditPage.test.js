import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";
import ArticleEditPage from "main/pages/Articles/ArticleEditPage";

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

describe("ArticleEditPage tests", () => {
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but table is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Article");
      expect(
        screen.queryByTestId("ArticleForm-title"),
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
      axiosMock.onGet("/api/articles", { params: { id: 17 } }).reply(200, {
        id: "17",
        title: "Breaking News",
        url: "https://website.com",
        explanation: "Something has happened",
        email: "someone@website.com",
        dateAdded: "2022-12-25T15:00"
      });
      axiosMock.onPut("/api/articles").reply(200, {
        id: "17",
        title: "Normal News",
        url: "https://news.com",
        explanation: "Nothing has happened",
        email: "noone@news.com",
        dateAdded: "2022-12-25T08:00"
      });
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-title");
    });

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-title");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const emailField = screen.getByTestId("ArticleForm-email");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const dateAddedField = screen.getByTestId(
        "ArticleForm-dateAdded",
      );
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("Breaking News");
      expect(urlField).toHaveValue("https://website.com");
      expect(explanationField).toHaveValue("Something has happened");
      expect(emailField).toHaveValue("someone@website.com");
      expect(dateAddedField).toHaveValue("2022-12-25T15:00");
      expect(submitButton).toBeInTheDocument();
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <ArticleEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("ArticleForm-title");

      const idField = screen.getByTestId("ArticleForm-id");
      const titleField = screen.getByTestId("ArticleForm-title");
      const urlField = screen.getByTestId("ArticleForm-url");
      const emailField = screen.getByTestId("ArticleForm-email");
      const explanationField = screen.getByTestId("ArticleForm-explanation");
      const dateAddedField = screen.getByTestId(
        "ArticleForm-dateAdded",
      );
      const submitButton = screen.getByTestId("ArticleForm-submit");

      expect(idField).toHaveValue("17");
      expect(titleField).toHaveValue("Breaking News");
      expect(urlField).toHaveValue("https://website.com");
      expect(explanationField).toHaveValue("Something has happened");
      expect(emailField).toHaveValue("someone@website.com");
      expect(dateAddedField).toHaveValue("2022-12-25T15:00");
      expect(submitButton).toBeInTheDocument();

      fireEvent.change(titleField, { target: { value: "Normal News" } });
      fireEvent.change(urlField, { target: { value: "https://news.com" } });
      fireEvent.change(explanationField, { target: { value: "Nothing has happened" } });
      fireEvent.change(emailField, { target: { value: "noone@news.com" } });
      fireEvent.change(dateAddedField, {
        target: { value: "2022-12-25T08:00" },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toBeCalledWith(
        "Article Updated - id: 17 title: Normal News",
      );
      expect(mockNavigate).toBeCalledWith({ to: "/articles" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: "17" });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          title: "Normal News",
          url: "https://news.com",
          explanation: "Nothing has happened",
          email: "noone@news.com",
          dateAdded: "2022-12-25T08:00"
        }),
      ); // posted object
    });
  });
});
