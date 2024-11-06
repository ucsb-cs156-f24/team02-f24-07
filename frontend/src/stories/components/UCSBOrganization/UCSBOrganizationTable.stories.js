import React from "react";
import OrganizationTable from "main/components/UCSBOrganization/UCSBOrganizationTable";
import { ucsbOrganizationFixtures } from "fixtures/ucsbOrganizationFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title: "components/UCSBOrganization/OrganizationTable",
  component: OrganizationTable,
};

const Template = (args) => {
  return <OrganizationTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  organizations: [],
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  organizations: ucsbOrganizationFixtures.threeOrganizations,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  organizations: ucsbOrganizationFixtures.threeOrganizations,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsborganization", () => {
      return HttpResponse.json(
        { message: "Organization deleted successfully" },
        { status: 200 },
      );
    }),
  ],
};
