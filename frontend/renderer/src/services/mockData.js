export const mockUser = {
  id: "u-demo-1",
  name: "Alex Rivera",
  email: "alex.rivera@college.edu",
  role: "STUDENT",
  isActive: true,
  student: {
    id: "s-demo-1",
    departmentId: "d-1",
    studentNumber: "STU2024091",
    batchYear: 2022,
    graduationYear: 2026,
    department: {
      name: "Computer Science & Engineering",
      college: { name: "Institute of Technology" }
    }
  },
  skills: [
    { proficiency: "INTERMEDIATE", skill: { id: "sk-1", name: "React" } },
    { proficiency: "ADVANCED", skill: { id: "sk-2", name: "JavaScript" } },
    { proficiency: "BEGINNER", skill: { id: "sk-3", name: "Node.js" } }
  ]
};

export const mockAlumniList = [
  {
    id: "alm-1",
    userId: "u-alm-1",
    graduationYear: 2021,
    currentCompany: "Google",
    jobTitle: "Senior Software Engineer",
    user: {
      id: "u-alm-1",
      name: "Priya Sharma",
      email: "priya.sharma@alumni.edu",
      role: "ALUMNI",
      skills: [
        { proficiency: "EXPERT", skill: { name: "System Design" } },
        { proficiency: "EXPERT", skill: { name: "Go" } },
        { proficiency: "ADVANCED", skill: { name: "Distributed Systems" } }
      ]
    },
    department: {
      name: "Computer Science & Engineering",
      college: { name: "Institute of Technology" }
    }
  },
  {
    id: "alm-2",
    userId: "u-alm-2",
    graduationYear: 2019,
    currentCompany: "Microsoft",
    jobTitle: "Product Manager",
    user: {
      id: "u-alm-2",
      name: "David Chen",
      email: "d.chen@alumni.edu",
      role: "ALUMNI",
      skills: [
        { proficiency: "EXPERT", skill: { name: "Product Strategy" } },
        { proficiency: "ADVANCED", skill: { name: "Agile" } },
        { proficiency: "ADVANCED", skill: { name: "Cloud Architecture" } }
      ]
    },
    department: {
      name: "Information Technology",
      college: { name: "Institute of Technology" }
    }
  },
  {
    id: "alm-3",
    userId: "u-alm-3",
    graduationYear: 2022,
    currentCompany: "NVIDIA",
    jobTitle: "AI Research Engineer",
    user: {
      id: "u-alm-3",
      name: "Sarah Jenkins",
      email: "sarah.j@alumni.edu",
      role: "ALUMNI",
      skills: [
        { proficiency: "EXPERT", skill: { name: "PyTorch" } },
        { proficiency: "EXPERT", skill: { name: "CUDA" } },
        { proficiency: "ADVANCED", skill: { name: "Deep Learning" } }
      ]
    },
    department: {
      name: "Computer Science & Engineering",
      college: { name: "Institute of Technology" }
    }
  }
];

export const mockPosts = [
  {
    id: "post-1",
    authorId: "u-alm-1",
    title: "Tips for Landing Your First Tech Internship in 2026",
    content: "When interviewing for software roles today, strong fundamentals in data structures paired with practical system design understanding stand out more than ever. Don't just solve LeetCode; build full-stack projects that showcase database normalization, auth security, and clean API design!",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    author: { id: "u-alm-1", name: "Priya Sharma", role: "ALUMNI" },
    _count: { comments: 3, likes: 24 },
    liked: true,
    comments: [
      { id: "c-1", author: { name: "Alex Rivera", role: "STUDENT" }, content: "Thank you for the advice Priya! Would love to know your thoughts on Electron vs Web.", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
      { id: "c-2", author: { name: "David Chen", role: "ALUMNI" }, content: "Agree 100%. Practical portfolio projects demonstrate initiative.", createdAt: new Date(Date.now() - 3600000).toISOString() }
    ]
  },
  {
    id: "post-2",
    authorId: "u-demo-1",
    title: "Looking for Mentorship in Machine Learning & LLM Pipelines",
    content: "Hi everyone! I am a 3rd year student working on local agentic workflows and fine-tuning small language models. Looking to connect with alumni working in ML infrastructure or research.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: { id: "u-demo-1", name: "Alex Rivera", role: "STUDENT" },
    _count: { comments: 1, likes: 12 },
    liked: false,
    comments: [
      { id: "c-3", author: { name: "Sarah Jenkins", role: "ALUMNI" }, content: "Feel free to send a mentorship request through the directory, Alex! Happy to chat about PyTorch and deployment.", createdAt: new Date(Date.now() - 72000000).toISOString() }
    ]
  }
];

export const mockOpportunities = [
  {
    id: "opp-1",
    postedByAlumniId: "alm-1",
    title: "Software Engineer Intern - Summer 2026",
    company: "Google",
    location: "Bangalore / Hybrid",
    type: "INTERNSHIP",
    description: "Looking for bright pre-final year students who want to build high-scale cloud backend systems. Proficiency in JavaScript, Node.js, and SQL is a huge plus.",
    deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
    createdAt: new Date().toISOString(),
    postedBy: {
      user: { name: "Priya Sharma" }
    },
    _count: { applications: 8 }
  },
  {
    id: "opp-2",
    postedByAlumniId: "alm-2",
    title: "Associate Product Specialist",
    company: "Microsoft",
    location: "Hyderabad / Onsite",
    type: "JOB",
    description: "Opportunity for graduating seniors to bridge technical engineering with customer requirements in Azure developer tools.",
    deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
    createdAt: new Date().toISOString(),
    postedBy: {
      user: { name: "David Chen" }
    },
    _count: { applications: 14 }
  }
];

export const mockEvents = [
  {
    id: "ev-1",
    title: "Alumni AMA: Navigating Tech Careers & System Design",
    description: "Interactive session covering backend scalability, PostgreSQL indexing, and preparing for technical interviews.",
    startsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 3 + 7200000).toISOString(),
    location: "Google Meet (Link will be sent to registered participants)",
    createdBy: { name: "Priya Sharma", role: "ALUMNI" },
    _count: { registrations: 42 },
    isRegistered: true
  },
  {
    id: "ev-2",
    title: "Workshop: Building Cross-Platform Apps with React & Electron",
    description: "Hands-on coding workshop exploring Electron desktop architecture with Vite, React 19, and Node.js backend integration.",
    startsAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    endsAt: new Date(Date.now() + 86400000 * 7 + 10800000).toISOString(),
    location: "Auditorium Hall B & Online Livestream",
    createdBy: { name: "Sarah Jenkins", role: "ALUMNI" },
    _count: { registrations: 68 },
    isRegistered: false
  }
];

export const mockConversations = [
  {
    id: "conv-1",
    student: {
      id: "s-demo-1",
      userId: "u-demo-1",
      user: { name: "Alex Rivera", role: "STUDENT" }
    },
    alumni: {
      id: "alm-1",
      userId: "u-alm-1",
      user: { name: "Priya Sharma", role: "ALUMNI" }
    },
    messages: [
      {
        id: "m-1",
        senderId: "u-demo-1",
        content: "Hi Priya! Thank you for accepting my mentorship request. I had a quick question regarding backend schema design.",
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        sender: { id: "u-demo-1", name: "Alex Rivera" }
      },
      {
        id: "m-2",
        senderId: "u-alm-1",
        content: "Hi Alex! Happy to help. Always start with normalized 3NF schemas for relational data, then index your query paths.",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        sender: { id: "u-alm-1", name: "Priya Sharma" }
      }
    ]
  }
];
