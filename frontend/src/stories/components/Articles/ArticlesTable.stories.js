import React from "react";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";
import ArticlesTable from "main/components/Articles/ArticlesTable";
import { articleFixtures } from "fixtures/articleFixtures";

export default {
  title: "components/Articles/ArticlesTable",
  component: ArticlesTable,
};

const Template = (args) => {
  return <ArticlesTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  articles: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  articles: articleFixtures.threeArticles,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  articles: articleFixtures.threeArticles,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/articles", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
