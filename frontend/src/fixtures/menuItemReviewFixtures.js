import { startTransition } from "react";

const menuItemReviewFixtures = {
    oneReview: {
      id: 1,
      itemId: 1,
      reviewerEmail: "email1@gmail.com",
      stars: 1,
      dateReviewed: "2004-01-01T00:00:00",
      comments: "bad"
    },
    threeReviews: [
      {
        id: 1,
        itemId: 1,
        reviewerEmail: "email1@gmail.com",
        stars: 1,
        dateReviewed: "2004-01-01T00:00:00",
        comments: "bad"
      },
      {
        id: 2,
        itemId: 2,
        reviewerEmail: "email2@gmail.com",
        stars: 2,
        dateReviewed: "2004-02-02T00:00:00",
        comments: "mid"
      },
      {
        id: 3,
        itemId: 3,
        reviewerEmail: "email3@gmail.com",
        stars: 3,
        dateReviewed: "2004-03-03T00:00:00",
        comments: "good"
      },
    ],
  };
  
  export { menuItemReviewFixtures };
  