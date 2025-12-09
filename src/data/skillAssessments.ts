export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface SkillExam {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: Question[];
  passingScore: number;
  maxScore: number;
  timeLimit: number; // in seconds
}

export const skillExams: SkillExam[] = [
  // Frontend Development
  {
    id: 'react',
    title: 'React.js',
    description: 'Test your React knowledge including components, hooks, and state management.',
    category: 'Frontend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON Extended', 'JavaScript Syntax'], correct: 0, difficulty: 'beginner' },
      { id: 2, question: 'Which hook is used for state management in functional components?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'When does useEffect run by default?', options: ['Only on mount', 'Only on unmount', 'After every render', 'Never'], correct: 2, difficulty: 'intermediate' },
      { id: 4, question: 'What is the purpose of React.memo()?', options: ['Memory management', 'Component optimization', 'State persistence', 'Error handling'], correct: 1, difficulty: 'advanced' },
      { id: 5, question: 'How do you pass data from parent to child component?', options: ['Props', 'State', 'Context', 'Redux'], correct: 0, difficulty: 'beginner' }
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: 'Test your JavaScript fundamentals including ES6+, async/await, and DOM manipulation.',
    category: 'Frontend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is the output of typeof null?', options: ['null', 'undefined', 'object', 'string'], correct: 2, difficulty: 'intermediate' },
      { id: 2, question: 'Which method adds elements to the end of an array?', options: ['push()', 'pop()', 'shift()', 'unshift()'], correct: 0, difficulty: 'beginner' },
      { id: 3, question: 'What does the spread operator (...) do?', options: ['Spreads elements', 'Deletes elements', 'Sorts elements', 'Filters elements'], correct: 0, difficulty: 'intermediate' },
      { id: 4, question: 'What is a closure in JavaScript?', options: ['A way to close windows', 'Function with access to outer scope', 'A loop construct', 'An error type'], correct: 1, difficulty: 'advanced' },
      { id: 5, question: 'What is the purpose of async/await?', options: ['Error handling', 'Asynchronous programming', 'Variable declaration', 'Loop control'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'typescript',
    title: 'TypeScript',
    description: 'Assess your TypeScript skills including types, interfaces, and generics.',
    category: 'Frontend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is the main benefit of TypeScript?', options: ['Faster execution', 'Static type checking', 'Smaller bundle size', 'Better styling'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'How do you define an interface in TypeScript?', options: ['class', 'interface', 'type', 'struct'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is a generic in TypeScript?', options: ['A type parameter', 'A function', 'A variable', 'A module'], correct: 0, difficulty: 'intermediate' },
      { id: 4, question: 'What does the "never" type represent?', options: ['Any value', 'No value', 'Null value', 'Unknown value'], correct: 1, difficulty: 'advanced' },
      { id: 5, question: 'How do you make a property optional?', options: ['optional keyword', '? after property name', '! after property name', 'nullable keyword'], correct: 1, difficulty: 'beginner' }
    ]
  },
  {
    id: 'css',
    title: 'CSS & Styling',
    description: 'Test your CSS knowledge including flexbox, grid, and responsive design.',
    category: 'Frontend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'Which property creates a flex container?', options: ['display: flex', 'flex: 1', 'flex-container: true', 'is-flex: true'], correct: 0, difficulty: 'beginner' },
      { id: 2, question: 'What does "position: absolute" do?', options: ['Positions relative to viewport', 'Positions relative to nearest positioned ancestor', 'Makes element invisible', 'Centers the element'], correct: 1, difficulty: 'intermediate' },
      { id: 3, question: 'How do you make a responsive design?', options: ['Media queries', 'Fixed widths', 'Table layouts', 'Frames'], correct: 0, difficulty: 'beginner' },
      { id: 4, question: 'What is CSS Grid used for?', options: ['Animations', 'Two-dimensional layouts', 'Fonts', 'Colors'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What does "z-index" control?', options: ['Font size', 'Stacking order', 'Width', 'Color'], correct: 1, difficulty: 'beginner' }
    ]
  },
  {
    id: 'html',
    title: 'HTML5',
    description: 'Test your HTML knowledge including semantic elements and accessibility.',
    category: 'Frontend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'Which is a semantic HTML5 element?', options: ['<div>', '<span>', '<article>', '<b>'], correct: 2, difficulty: 'beginner' },
      { id: 2, question: 'What is the purpose of the alt attribute?', options: ['Styling', 'Accessibility', 'Linking', 'Animation'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'Which element is used for navigation?', options: ['<nav>', '<header>', '<div>', '<link>'], correct: 0, difficulty: 'beginner' },
      { id: 4, question: 'What does DOCTYPE specify?', options: ['CSS version', 'Document type', 'JavaScript version', 'Browser type'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'Which attribute makes a form field required?', options: ['mandatory', 'required', 'necessary', 'must'], correct: 1, difficulty: 'beginner' }
    ]
  },
  // Backend Development
  {
    id: 'python',
    title: 'Python',
    description: 'Assess your Python skills covering syntax, data structures, and OOP.',
    category: 'Backend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'Which data type is used to store multiple items?', options: ['int', 'list', 'str', 'float'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'How do you define a function in Python?', options: ['function myFunc():', 'def myFunc():', 'func myFunc():', 'define myFunc():'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is list comprehension?', options: ['Understanding lists', 'Concise way to create lists', 'A list method', 'Debugging technique'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What does the __init__ method do?', options: ['Initializes class', 'Constructor method', 'Destructor', 'Error handler'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is a decorator in Python?', options: ['A design pattern', 'Function that modifies functions', 'A variable type', 'A loop'], correct: 1, difficulty: 'advanced' }
    ]
  },
  {
    id: 'nodejs',
    title: 'Node.js',
    description: 'Test your Node.js knowledge including npm, async programming, and Express.',
    category: 'Backend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is Node.js?', options: ['Browser', 'Runtime environment', 'Database', 'Framework'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is npm?', options: ['Node Package Manager', 'New Project Maker', 'Node Process Monitor', 'Network Protocol Manager'], correct: 0, difficulty: 'beginner' },
      { id: 3, question: 'What is Express.js?', options: ['Database', 'Web framework', 'Testing tool', 'CSS library'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is middleware?', options: ['Database layer', 'Functions between request and response', 'Frontend code', 'Configuration'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is the event loop?', options: ['A loop construct', 'Handles async operations', 'A variable', 'A class'], correct: 1, difficulty: 'advanced' }
    ]
  },
  {
    id: 'java',
    title: 'Java',
    description: 'Test your Java fundamentals including OOP, collections, and multithreading.',
    category: 'Backend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is Java primarily used for?', options: ['Web styling', 'Backend development', 'Image editing', 'Video editing'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is the JVM?', options: ['Java Virtual Machine', 'Java Variable Manager', 'Java Version Manager', 'Java Visual Mode'], correct: 0, difficulty: 'beginner' },
      { id: 3, question: 'What is inheritance in Java?', options: ['A loop', 'OOP concept', 'A variable', 'A method'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is an interface?', options: ['A class', 'Contract for classes', 'A variable', 'A loop'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is a thread in Java?', options: ['A loop', 'Unit of execution', 'A variable', 'A class'], correct: 1, difficulty: 'advanced' }
    ]
  },
  {
    id: 'sql',
    title: 'SQL & Databases',
    description: 'Test your SQL knowledge including queries, joins, and database design.',
    category: 'Backend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'Which SQL command retrieves data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correct: 2, difficulty: 'beginner' },
      { id: 2, question: 'What does JOIN do?', options: ['Deletes tables', 'Combines tables', 'Creates tables', 'Indexes tables'], correct: 1, difficulty: 'intermediate' },
      { id: 3, question: 'What is a primary key?', options: ['Any column', 'Unique identifier', 'Foreign reference', 'Index'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is normalization?', options: ['Making data larger', 'Reducing redundancy', 'Encrypting data', 'Backing up data'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is an index used for?', options: ['Styling', 'Faster queries', 'Data validation', 'Encryption'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'api-design',
    title: 'REST API Design',
    description: 'Test your API knowledge including HTTP methods, status codes, and best practices.',
    category: 'Backend Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What does REST stand for?', options: ['Representational State Transfer', 'Request State Transfer', 'Remote State Transfer', 'Resource State Transfer'], correct: 0, difficulty: 'beginner' },
      { id: 2, question: 'Which HTTP method creates data?', options: ['GET', 'POST', 'PUT', 'DELETE'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What status code means "Created"?', options: ['200', '201', '204', '404'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is idempotent?', options: ['Always same result', 'Different results', 'No result', 'Error state'], correct: 0, difficulty: 'advanced' },
      { id: 5, question: 'What is JWT used for?', options: ['Styling', 'Authentication', 'Database access', 'Caching'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  // Data Science
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Test your ML fundamentals including algorithms and model evaluation.',
    category: 'Data Science',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is supervised learning?', options: ['Learning without labels', 'Learning with labeled data', 'Reinforcement learning', 'Deep learning'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is overfitting?', options: ['Model too simple', 'Model too complex', 'Model perfect', 'Model missing'], correct: 1, difficulty: 'intermediate' },
      { id: 3, question: 'What is a neural network?', options: ['Computer network', 'Brain-inspired model', 'Database', 'Algorithm'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is gradient descent?', options: ['A loop', 'Optimization algorithm', 'A variable', 'A function'], correct: 1, difficulty: 'advanced' },
      { id: 5, question: 'What is cross-validation?', options: ['Data cleaning', 'Model evaluation technique', 'Data transformation', 'Feature selection'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Test your data analysis skills including pandas, visualization, and statistics.',
    category: 'Data Science',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'Which library is used for data manipulation in Python?', options: ['NumPy', 'Pandas', 'Matplotlib', 'TensorFlow'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is a DataFrame?', options: ['A chart', 'A 2D data structure', 'A function', 'A loop'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What does correlation measure?', options: ['Causation', 'Relationship strength', 'Data size', 'Speed'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is data visualization used for?', options: ['Data storage', 'Presenting data graphically', 'Data encryption', 'Data deletion'], correct: 1, difficulty: 'beginner' },
      { id: 5, question: 'What is the mean in statistics?', options: ['Middle value', 'Average', 'Most frequent', 'Range'], correct: 1, difficulty: 'beginner' }
    ]
  },
  // Cloud & DevOps
  {
    id: 'aws',
    title: 'AWS Cloud',
    description: 'Test your AWS knowledge including EC2, S3, and core services.',
    category: 'Cloud & DevOps',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is EC2?', options: ['Storage service', 'Virtual servers', 'Database service', 'Networking'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is S3 used for?', options: ['Computing', 'Object storage', 'Networking', 'Security'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is Lambda?', options: ['Database', 'Serverless compute', 'Storage', 'Networking'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is IAM?', options: ['Storage', 'Identity and Access Management', 'Database', 'Computing'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is VPC?', options: ['Storage', 'Virtual Private Cloud', 'Database', 'Computing'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'docker',
    title: 'Docker',
    description: 'Test your containerization knowledge with Docker.',
    category: 'Cloud & DevOps',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is Docker?', options: ['Virtual machine', 'Containerization platform', 'Database', 'Framework'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is a Docker image?', options: ['Running container', 'Template for containers', 'Configuration file', 'Log file'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is Dockerfile?', options: ['Log file', 'Build instructions', 'Configuration', 'Data file'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is Docker Compose?', options: ['Image builder', 'Multi-container tool', 'Network tool', 'Storage tool'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is a container registry?', options: ['Log storage', 'Image storage', 'Code storage', 'Data storage'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'git',
    title: 'Git Version Control',
    description: 'Test your Git knowledge including branching, merging, and workflows.',
    category: 'Cloud & DevOps',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What does git clone do?', options: ['Delete repo', 'Copy repo', 'Update repo', 'Create branch'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What does git commit do?', options: ['Upload changes', 'Save changes locally', 'Delete changes', 'Merge changes'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is a branch?', options: ['File copy', 'Parallel development line', 'Backup', 'Configuration'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What does git merge do?', options: ['Delete branch', 'Combine branches', 'Create branch', 'List branches'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is a pull request?', options: ['Download code', 'Request to merge changes', 'Delete request', 'Create branch'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  // Digital Marketing
  {
    id: 'seo',
    title: 'SEO',
    description: 'Test your Search Engine Optimization knowledge.',
    category: 'Digital Marketing',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What does SEO stand for?', options: ['Search Engine Optimization', 'Site Engine Optimization', 'Social Engine Optimization', 'System Engine Optimization'], correct: 0, difficulty: 'beginner' },
      { id: 2, question: 'What is a backlink?', options: ['Internal link', 'Link from another site', 'Broken link', 'Footer link'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is a meta description?', options: ['Page title', 'Summary in search results', 'Header text', 'Footer text'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is keyword density?', options: ['Keyword count per page', 'Percentage of keywords', 'Keyword list', 'Keyword ranking'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is local SEO?', options: ['Global optimization', 'Location-based optimization', 'Mobile optimization', 'Speed optimization'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'social-media',
    title: 'Social Media Marketing',
    description: 'Test your social media marketing knowledge.',
    category: 'Digital Marketing',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is engagement rate?', options: ['Follower count', 'Interactions / reach', 'Post count', 'Like count'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is CTR?', options: ['Click Through Rate', 'Content Through Rate', 'Customer Through Rate', 'Cost Through Rate'], correct: 0, difficulty: 'beginner' },
      { id: 3, question: 'Which platform is best for B2B?', options: ['TikTok', 'Snapchat', 'LinkedIn', 'Pinterest'], correct: 2, difficulty: 'beginner' },
      { id: 4, question: 'What is A/B testing?', options: ['Testing one version', 'Comparing two versions', 'Testing three versions', 'No testing'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is organic reach?', options: ['Paid views', 'Unpaid views', 'Bot views', 'Total views'], correct: 1, difficulty: 'beginner' }
    ]
  },
  {
    id: 'google-analytics',
    title: 'Google Analytics',
    description: 'Test your web analytics knowledge.',
    category: 'Digital Marketing',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What does bounce rate measure?', options: ['Page views', 'Single page visits', 'Time on site', 'Conversions'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is a session?', options: ['One page view', 'Group of user interactions', 'One click', 'One user'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is a conversion?', options: ['Page view', 'Completed goal', 'Click', 'Impression'], correct: 1, difficulty: 'intermediate' },
      { id: 4, question: 'What is attribution?', options: ['Credit for conversions', 'User demographics', 'Traffic source', 'Page speed'], correct: 0, difficulty: 'advanced' },
      { id: 5, question: 'What is real-time analytics?', options: ['Historical data', 'Live data', 'Predicted data', 'Archived data'], correct: 1, difficulty: 'beginner' }
    ]
  },
  // Soft Skills
  {
    id: 'communication',
    title: 'Communication Skills',
    description: 'Assess your professional communication abilities.',
    category: 'Soft Skills',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is active listening?', options: ['Talking more', 'Fully concentrating on speaker', 'Interrupting', 'Ignoring'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is nonverbal communication?', options: ['Written text', 'Body language', 'Email', 'Phone call'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is the best email subject line?', options: ['No subject', 'Clear and concise', 'Very long', 'ALL CAPS'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'How should you handle criticism?', options: ['Get defensive', 'Listen and reflect', 'Ignore it', 'Argue back'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is assertive communication?', options: ['Aggressive', 'Passive', 'Clear and respectful', 'Silent'], correct: 2, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    description: 'Test your analytical and problem-solving abilities.',
    category: 'Soft Skills',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is the first step in problem solving?', options: ['Implement solution', 'Define the problem', 'Brainstorm', 'Evaluate'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is root cause analysis?', options: ['Quick fix', 'Finding underlying cause', 'Symptom treatment', 'Ignoring problem'], correct: 1, difficulty: 'intermediate' },
      { id: 3, question: 'What is brainstorming?', options: ['Solo thinking', 'Generating many ideas', 'Choosing one idea', 'Criticizing ideas'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is critical thinking?', options: ['Negative thinking', 'Analyzing objectively', 'Quick decisions', 'Emotional decisions'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'How should you approach complex problems?', options: ['Avoid them', 'Break into smaller parts', 'Rush through', 'Delegate entirely'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  {
    id: 'leadership',
    title: 'Leadership Skills',
    description: 'Assess your leadership and team management abilities.',
    category: 'Soft Skills',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is delegation?', options: ['Doing everything yourself', 'Assigning tasks to others', 'Avoiding work', 'Micromanaging'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is emotional intelligence?', options: ['IQ score', 'Understanding emotions', 'Technical skills', 'Memory'], correct: 1, difficulty: 'intermediate' },
      { id: 3, question: 'How do good leaders motivate teams?', options: ['Fear', 'Recognition and support', 'Threats', 'Ignoring'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is servant leadership?', options: ['Being served', 'Serving the team', 'Authoritarian', 'Passive'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'How should conflicts be handled?', options: ['Ignore them', 'Address constructively', 'Take sides', 'Avoid discussions'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  // Mobile Development
  {
    id: 'react-native',
    title: 'React Native',
    description: 'Test your React Native mobile development skills.',
    category: 'Mobile Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is React Native?', options: ['Web framework', 'Cross-platform mobile framework', 'Database', 'Backend framework'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What are native modules?', options: ['JavaScript code', 'Platform-specific code', 'CSS modules', 'HTML elements'], correct: 1, difficulty: 'intermediate' },
      { id: 3, question: 'What is Expo?', options: ['Database', 'Development platform', 'State manager', 'Styling library'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'How do you style in React Native?', options: ['CSS files', 'StyleSheet API', 'HTML styles', 'SASS'], correct: 1, difficulty: 'beginner' },
      { id: 5, question: 'What is the bridge in React Native?', options: ['UI component', 'Communication between JS and native', 'Navigation', 'Storage'], correct: 1, difficulty: 'advanced' }
    ]
  },
  {
    id: 'flutter',
    title: 'Flutter',
    description: 'Test your Flutter and Dart development skills.',
    category: 'Mobile Development',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What language does Flutter use?', options: ['JavaScript', 'Kotlin', 'Dart', 'Swift'], correct: 2, difficulty: 'beginner' },
      { id: 2, question: 'What is a Widget in Flutter?', options: ['Database', 'UI building block', 'Network layer', 'Storage'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is hot reload?', options: ['Restart app', 'Instant code updates', 'Clear cache', 'Build release'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is StatefulWidget?', options: ['Static widget', 'Widget with mutable state', 'Styling widget', 'Layout widget'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is the widget tree?', options: ['File structure', 'Hierarchy of widgets', 'Database schema', 'API structure'], correct: 1, difficulty: 'intermediate' }
    ]
  },
  // Project Management
  {
    id: 'agile',
    title: 'Agile Methodology',
    description: 'Test your Agile and Scrum knowledge.',
    category: 'Project Management',
    passingScore: 70,
    maxScore: 100,
    timeLimit: 300,
    questions: [
      { id: 1, question: 'What is a sprint?', options: ['Long project phase', 'Time-boxed iteration', 'Final release', 'Planning session'], correct: 1, difficulty: 'beginner' },
      { id: 2, question: 'What is the Scrum Master role?', options: ['Developer', 'Facilitator', 'Product owner', 'Customer'], correct: 1, difficulty: 'beginner' },
      { id: 3, question: 'What is a user story?', options: ['Bug report', 'Feature from user perspective', 'Technical spec', 'Meeting notes'], correct: 1, difficulty: 'beginner' },
      { id: 4, question: 'What is a retrospective?', options: ['Planning meeting', 'Review of what to improve', 'Demo session', 'Daily standup'], correct: 1, difficulty: 'intermediate' },
      { id: 5, question: 'What is velocity in Agile?', options: ['Speed of typing', 'Work completed per sprint', 'Number of meetings', 'Bug count'], correct: 1, difficulty: 'intermediate' }
    ]
  }
];

export const getExamsByCategory = (category: string): SkillExam[] => {
  return skillExams.filter(exam => exam.category === category);
};

export const getExamById = (id: string): SkillExam | undefined => {
  return skillExams.find(exam => exam.id === id);
};

export const getAllCategories = (): string[] => {
  return [...new Set(skillExams.map(exam => exam.category))];
};
