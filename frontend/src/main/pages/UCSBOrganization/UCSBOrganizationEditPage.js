import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import OrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({ storybook = false }) {
  let { orgCode } = useParams();

  const {
    data: organization,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/ucsborganization?orgCode=${orgCode}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/ucsborganization`,
      params: {
        orgCode,
      },
    },
  );

  const objectToAxiosPutParams = (org) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: {
      orgCode: org.orgCode,
    },
    data: {
      orgCode: org.orgCode,
      orgTranslationShort: org.orgTranslationShort,
      orgTranslation: org.orgTranslation,
      inactive: org.inactive,
    },
  });

  const onSuccess = (org) => {
    toast(
      `Organization Updated - code: ${org.orgCode} short translation: ${org.orgTranslationShort} translation: ${org.orgTranslation} inactive: ${org.inactive}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsborganization?orgCode=${orgCode}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Organization</h1>
        {organization && (
          <OrganizationForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={organization}
          />
        )}
      </div>
    </BasicLayout>
  );
}
