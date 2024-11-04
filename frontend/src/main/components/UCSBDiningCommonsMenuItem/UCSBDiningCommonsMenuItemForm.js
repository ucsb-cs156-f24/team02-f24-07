import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function UCSBDiningCommonsMenuItemForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  // For explanation, see: https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  // Note that even this complex regex may still need some tweaks









  return (
    <Form onSubmit={handleSubmit(submitAction)}>

      {initialContents && (

        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid="UCSBDiningCommonsMenuItemForm-id"
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>

      )}


      <Form.Group className="mb-3">
        <Form.Label htmlFor="diningCommonsCode">Dining Commons Code</Form.Label>
        <Form.Control
          data-testid="UCSBDiningCommonsMenuItemForm-diningCommonsCode"
          id="diningCommonsCode"
          type="text"
          isInvalid={Boolean(errors.diningCommonsCode)}
          {...register("diningCommonsCode", {
            required: "Dining Commons Code is required",

          })}
        />
        <Form.Control.Feedback type="invalid">

          {errors.diningCommonsCode?.message}

        </Form.Control.Feedback>
      </Form.Group>



      <Form.Group className="mb-3">
        <Form.Label htmlFor="name">Name</Form.Label>
        <Form.Control
        data-testid="UCSBDiningCommonsMenuItemForm-name"
        id="name"
        type="text"
        isInvalid={Boolean(errors.name)}
        {...register("name", {
            required: "Name is required",
        })}
        />

        <Form.Control.Feedback type="invalid">
          {errors.name?.message}
        </Form.Control.Feedback>
      </Form.Group>




      <Form.Group className="mb-3">
        <Form.Label htmlFor="station">Station</Form.Label>
        <Form.Control
          data-testid="UCSBDiningCommonsMenuItemForm-station"
          id="station"
          type="text"
          isInvalid={Boolean(errors.station)}
          {...register("station", {
            required: "Station is required",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.station?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid="UCSBDiningCommonsMenuItemForm-submit" >
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        data-testid="UCSBDiningCommonsMenuItemForm-cancel"
        onClick={() => navigate(-1)}
      >
        
        Cancel
      </Button>
    </Form>
  );
}

export default UCSBDiningCommonsMenuItemForm;
