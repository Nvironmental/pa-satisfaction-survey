export const client_questions = [
  {
    id: 1,
    question:
      "Which of the following best describes your engagement with PeopleAsset?",
    options: [
      "Executive Search (CXO/ Board)",
      "Talent Advisory",
      "Leadership Coaching and Development",
    ],
    type: "radio",
  },
  {
    id: 2,
    question: "How did you first hear about PeopleAsset?",
    options: [
      "Director",
      "Industry Referral",
      "Employee/Internal Leader",
      "Existing Client",
      "Web/Search",
      "Other (specify)",
    ],
    type: "radio",
    subQuestion: {
      id: 2.1,
      parentId: 2,
      parentValue: "Other (specify)",
      parentType: "radio",
      isSubQuestion: true,
      placeholder: "Please specify the other source",
      question: "Please specify the other source",
      type: "input",
    },
  },

  {
    id: 3,
    question:
      "How would you describe the outcome of your engagement with PeopleAsset?",
    options: [
      "1 - Not at all achieved",
      "2 - Slightly achieved",
      "3 - Partially achieved",
      "4 - Mostly achieved",
      "5 - Fully achieved",
    ],
    type: "radio",
  },
  {
    id: 4,
    question:
      "How satisfied are you with your overall experience of working with the PeopleAsset team?",
    options: [
      "1 - Highly Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Highly Satisfied",
    ],
    type: "radio",
  },
  {
    id: 5,
    question:
      "Did PeopleAsset follow a formal cadence to review engagement progress?",
    options: ["Yes", "No"],
    type: "radio",
    subQuestion: {
      id: 5.1,
      parentId: 5,
      parentValue: "Yes",
      parentType: "radio",
      isSubQuestion: true,
      question:
        "How frequently was this progress communicated to you and other stakeholders?",
      options: [
        "No formal review process was followed",
        "Weekly",
        "Bi-weekly",
        "Monthly",
        "Quarterly",
        "As needed/ ad-hoc",
      ],
      type: "radio",
    },
  },

  {
    id: 6,
    question:
      "To what extent did PeopleAsset adhere to the agreed delivery milestones and timelines?",
    options: [
      "1 - Significant delays / major deviations",
      "2 - Moderate delays / some deviations",
      "3 - Minor delays / largely on track",
      "4 - On time with minimal deviation",
      "5 - Fully on time / exceeded expectations",
    ],
    type: "radio",
  },
  {
    id: 7,
    question:
      "How likely are you to engage with PeopleAsset again in the future?",
    options: [
      "1 - Not at all likely",
      "2 - Unlikely",
      "3 - Neutral / Unsure",
      "4 - Likely",
      "5 - Extremely likely",
    ],
    type: "radio",
  },
  {
    id: 8,
    question:
      "How likely are you to recommend PeopleAsset to your associates or industry peers?",
    options: [
      "1 - Not at all likely",
      "2 - Unlikely",
      "3 - Neutral / Unsure",
      "4 - Likely",
      "5 - Extremely likely",
    ],
    type: "radio",
  },
  {
    id: 9,
    question:
      "How satisfied are you with the engagement progress reports, MIS, candidate reports, and other updates shared by PeopleAsset?",
    options: [
      "1 - Highly Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Highly Satisfied",
    ],
    type: "radio",
  },
  {
    id: 10,
    question:
      "What was the primary reason you chose to engage with PeopleAsset?",
    options: [
      "Reputation and brand credibility",
      "Expertise in leadership search (CXO / Board level)",
      "Depth and quality of advisory services",
      "Leadership coaching quality and methodology",
      "Prior relationship or referral trust",
      "Value for cost / ROI considerations",
      "Comprehensive service offering (end-to-end support)",
      "Other (please specify)",
    ],
    type: "radio",
    subQuestion: {
      id: 10.1,
      parentId: 10,
      parentValue: "Other (please specify)",
      parentType: "radio",
      isSubQuestion: true,
      placeholder: "Please specify the other reason",
      question: "Please specify the other reason",
      type: "input",
    },
  },

  {
    id: 11,
    question:
      "How clearly were the goals and expectations defined at the beginning of your engagement with PeopleAsset?",
    options: [
      "1 - Not clear at all",
      "2 - Slightly clear",
      "3 - Moderately clear",
      "4 - Very clear",
      "5 - Extremely clear",
    ],
    type: "radio",
  },
  {
    id: 12,
    question:
      "To what extent did PeopleAsset meet the objectives agreed upon at the start of the engagement?",
    options: [
      "1 - Did not meet objectives at all",
      "2 - Met a few objectives",
      "3 - Met some objectives",
      "4 - Met most objectives",
      "5 - Fully met all objectives",
    ],
    type: "radio",
  },
  {
    id: 13,
    question:
      "Are there any areas where the PeopleAsset team could have improved your overall engagement experience?",
    options: ["Yes", "No"],
    type: "radio",
    subQuestion: {
      id: 13.1,
      parentId: 13,
      parentValue: "Yes",
      parentType: "radio",
      isSubQuestion: true,
      placeholder: "Please specify the areas for improvement",
      question: "Please specify the areas for improvement",
      type: "input",
    },
  },

  {
    id: 14,
    question:
      "Do you have any additional feedback, suggestions, or comments you’d like to share with us?",
    type: "text",
    placeholder:
      "Please specify the additional feedback, suggestions, or comments",
  },
];

export const candidate_questions = [
  {
    id: 1,
    question:
      "Who from PeopleAsset’s end reached out to you for the first time? (Name of the specific person @ PeopleAsset)?",
    type: "input",
    placeholder: "Anil, Mainak, Varun, etc.",
  },
  {
    id: 2,
    question: "What source was used to reach out to you?",
    options: [
      "LinkedIn",
      "Job portal",
      "Cold call",
      "Email",
      "Via a reference",
      "Other (specify)",
    ],
    subQuestion: {
      id: 2.1,
      parentId: 2,
      parentValue: "Other (specify)",
      parentType: "radio",
      isSubQuestion: true,
      placeholder: "Please specify the other source",
      question: "Please specify the other source",
      type: "input",
    },
    type: "radio",
  },
  {
    id: 3,
    question:
      "How would you rate the quality of your discussions with the PeopleAsset team?",
    options: [
      "1 - Highly Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Highly Satisfied",
    ],
    type: "radio",
  },
  {
    id: 4,
    question:
      "Did the PeopleAsset team keep you posted on a regular basis on the progress of your candidature?",
    options: ["Yes", "No", "Sometimes"],
    type: "radio",
  },
  {
    id: 5,
    question:
      "Did we assist you during your preparations for your discussions with the client?",
    options: ["Yes", "No", "Sometimes"],
    type: "radio",
  },
  {
    id: 6,
    question:
      "Did PeopleAsset provide you clarity about the process at the client’s end?",
    options: ["Yes", "No", "Sometimes"],
    type: "radio",
  },
  {
    id: 7,
    question:
      "How was our post offer engagement with you - this was from the offer acceptance to the date that you onboarded?",
    options: [
      "1 - Highly Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Highly Satisfied",
    ],
    type: "radio",
  },
  {
    id: 8,
    question:
      "Would you refer PeopleAsset to any of your friends / anyone in your network?",
    options: ["Yes", "No", "Maybe"],
    type: "radio",
  },
  {
    id: 9,
    question:
      "How would you rate your experience / engagement with PeopleAsset?",
    options: [
      "1 - Highly Dissatisfied",
      "2 - Dissatisfied",
      "3 - Neutral",
      "4 - Satisfied",
      "5 - Highly Satisfied",
    ],
    type: "radio",
  },
];
