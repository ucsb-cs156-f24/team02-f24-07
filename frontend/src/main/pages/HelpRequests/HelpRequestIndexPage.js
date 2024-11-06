import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestsTable from "main/components/HelpRequests/HelpRequestsTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function HelpRequestIndexPage() {
  const currentUser = useCurrentUser();

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/helprequests/create"
          style={{ float: "right" }}
        >
          Create Help Request
        </Button>
      );
    }
  };

  const {
    data: helpRequests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/helprequests/all"],
    { method: "GET", url: "/api/helprequests/all" },
    [],
  );

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>Help Requests</h1>
        <HelpRequestsTable
          helpRequests={helpRequests}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
