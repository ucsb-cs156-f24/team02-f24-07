const helpRequestFixtures = {
  oneHelpRequest: {
    id: 1,
    requesterEmail: "noahwang@ucsb.edu",
    teamId: "07",
    tableOrBreakoutRoom: "table",
    requestTime: "2022-01-02T12:00:00",
    explanation: "help",
    solved: false,
  },
  threeHelpRequests: [
    {
      id: 1,
      requesterEmail: "noahwang1@ucsb.edu",
      teamId: "07",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-01-02T12:00:00",
      explanation: "help",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "noahwang2@ucsb.edu",
      teamId: "03",
      tableOrBreakoutRoom: "breakout",
      requestTime: "2022-04-03T12:00:00",
      explanation: "help me",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "noahwang3@ucsb.edu",
      teamId: "01",
      tableOrBreakoutRoom: "table",
      requestTime: "2022-07-04T12:00:00",
      explanation: "help a lot",
      solved: true,
    },
  ],
};

export { helpRequestFixtures };
