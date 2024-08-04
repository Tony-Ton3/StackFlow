//questions for the user for prompting purposes
export const projectQuestions = [
  {
    id: "projectOverview",
    title: "Project Overview",
    questions: [
      {
        id: "description",
        question: "Briefly describe your project idea:",
        type: "text",
      },
      {
        id: "projectType",
        question: "What type of project are you building?",
        type: "select",
        options: [
          "Web Application",
          "Mobile App",
          "Desktop Application",
          "API/Backend Service",
          "Other",
        ],
      },
      {
        id: "scale",
        question: "What's the expected scale of your project?",
        type: "select",
        options: [
          "Small (personal project)",
          "Medium (startup/small business)",
          "Large (enterprise)",
        ],
      },
    ],
  },
  {
    id: "technicalRequirements",
    title: "Technical Requirements",
    questions: [
      {
        id: "features",
        question: "Select the key features you need:",
        type: "multiselect",
        options: [
          "User Authentication",
          "Database Storage",
          "Real-time Updates",
          "Payment Processing",
          "File Upload/Download",
          "API Integration",
        ],
      },
      {
        id: "timeline",
        question: "What's your development timeline?",
        type: "select",
        options: ["Quick prototype", "1-3 months", "3-6 months", "6+ months"],
      },
    ],
  },
  {
    id: "userBackground",
    title: "Your Background",
    questions: [
      {
        id: "experience",
        question: "What's your programming experience level?",
        type: "select",
        options: [
          "Beginner (Can write basic code, learning fundamentals.)",
          "Intermediate (Builds full applications, understands best practices.)",
          "Advanced (Architects complex systems, deep expertise in multiple areas.)",
        ],
      },
      {
        id: "knownTechnologies",
        question: "Which technologies are you already familiar with?",
        type: "multiselect",
        options: [
          "JavaScript",
          "Python",
          "Java",
          "C#",
          "Ruby",
          "PHP",
          "Go",
          "React",
          "Angular",
          "Vue.js",
          "Node.js",
          "Django",
          "Ruby on Rails",
          "ASP.NET",
          "Spring Boot",
          "MySQL",
          "PostgreSQL",
          "MongoDB",
          "Docker",
          "AWS",
          "Other",
        ],
      },
    ],
  },
];
