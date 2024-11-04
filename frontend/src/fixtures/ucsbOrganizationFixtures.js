const ucsbOrganizationFixtures = {
  oneOrganization: [
    {
      id: 1,
      orgCode: "ZPR",
      orgTranslationShort: "ZETA PHI RHO",
      orgTranslation: "ZETA PHI RHO at UCSB",
      inactive: true,
    },
  ],

  threeOrganizations: [
    {
      id: 2,
      orgCode: "ACM",
      orgTranslationShort: "ACM",
      orgTranslation: "ACM @ UCSB",
      inactive: false,
    },

    {
      id: 3,
      orgCode: "osli",
      orgTranslationShort: "STUD LIFE",
      orgTranslation: "OFFICE OF STUDENT LIFE",
      inactive: false,
    },

    {
      id: 4,
      orgCode: "KRC",
      orgTranslationShort: "KOREAN RADIO CL",
      orgTranslation: "KOREAN RADIO CLUB",
      inactive: true,
    },
  ],
};

export { ucsbOrganizationFixtures };
