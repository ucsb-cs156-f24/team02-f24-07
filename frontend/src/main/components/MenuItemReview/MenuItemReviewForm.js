import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function MenuItemReviewForm({
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

  // Stryker disable Regex
  const isodate_regex =
    /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      <Row>
        {initialContents && (
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="id">Id</Form.Label>
              <Form.Control
                data-testid="MenuItemReviewForm-id"
                id="id"
                type="text"
                {...register("id")}
                value={initialContents.id}
                disabled
              />
            </Form.Group>
          </Col>
        )}

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="itemId">Item ID</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-itemId"
              id="itemId"
              type="text"
              isInvalid={Boolean(errors.itemId)}
              {...register("itemId", {
                required: "itemId is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.itemId?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="reviewerEmail">Reviewer Email</Form.Label>
              <Form.Control
                data-testid="MenuItemReviewForm-reviewerEmail"
                id="reviewerEmail"
                type="text"
                isInvalid={Boolean(errors.reviewerEmail)}
                {...register("reviewerEmail", {
                  required: "reviewerEmail is required.",
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reviewerEmail?.message}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="stars">Stars (1-5)</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-stars"
              id="stars"
              type="number"
              isInvalid={Boolean(errors.stars)}
              {...register("stars", {
                required: "stars is required.",
                min: { value: 1, message: "Stars must be between 1 and 5." },
                max: { value: 5, message: "Stars must be between 1 and 5." },
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.stars?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="dateReviewed">Date</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-dateReviewed"
              id="dateReviewed"
              type="datetime-local"
              isInvalid={Boolean(errors.dateReviewed)}
              {...register("dateReviewed", {
                required: true,
                pattern: isodate_regex,
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dateReviewed && "dateReviewed is required. "}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="comments">Comments</Form.Label>
            <Form.Control
              data-testid="MenuItemReviewForm-comments"
              id="comments"
              type="text"
              isInvalid={Boolean(errors.comments)}
              {...register("comments", {
                required: "comments is required.",
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.comments?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Button type="submit" data-testid="MenuItemReviewForm-submit">
            {buttonLabel}
          </Button>
          <Button
            variant="Secondary"
            onClick={() => navigate(-1)}
            data-testid="MenuItemReviewForm-cancel"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default MenuItemReviewForm;
