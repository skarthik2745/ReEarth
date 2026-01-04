const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface LessonContent {
  lesson_title: string;
  summary: string;
  content_html: string;
  tts_text: string;
  key_takeaways: string[];
  case_study: {
    title: string;
    text: string;
  };
  faqs: Array<{ q: string; a: string }>;
  images: Array<{
    caption: string;
    alt_text: string;
    search_query: string;
    recommended_sources: string[];
    license_note: string;
  }>;
  materials: string;
  example_submission: string;
}

const lessonContentCache = new Map<string, LessonContent>();

export const generateLessonContent = async (topic: string): Promise<LessonContent> => {
  if (lessonContentCache.has(topic)) {
    return lessonContentCache.get(topic)!;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{
          role: 'user',
          content: `Generate comprehensive lesson content for "${topic}". Create detailed educational content with multiple sections and headings.

Return ONLY valid JSON:
{
  "lesson_title": "${topic}",
  "summary": "2-3 sentences explaining what this lesson covers",
  "content_html": "<h1>${topic}</h1><h2>Introduction</h2><p>Detailed introduction paragraph...</p><h2>Understanding ${topic}</h2><h3>What is ${topic}?</h3><p>Definition and explanation...</p><h3>Causes and Origins</h3><p>Main causes...</p><h3>Environmental Impact</h3><p>Effects on environment...</p><h2>Solutions and Actions</h2><h3>Individual Actions</h3><p>What people can do...</p><h3>Community Solutions</h3><p>Group efforts...</p><h3>Technology and Innovation</h3><p>Tech solutions...</p><h2>Real-World Examples</h2><p>Success stories...</p><h2>Future Outlook</h2><p>What's next...</p>",
  "tts_text": "Plain text version for audio",
  "key_takeaways": ["4-6 key points about ${topic}"],
  "case_study": {"title": "Real example", "text": "Detailed case study"},
  "faqs": [{"q": "What is ${topic}?", "a": "Detailed answer"}],
  "images": [{"caption": "Image description", "alt_text": "Alt text", "search_query": "${topic} environmental", "recommended_sources": ["Unsplash"], "license_note": "Free use"}],
  "materials": "No materials needed",
  "example_submission": "Example of good submission"
}`
        }],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const lessonContent = JSON.parse(jsonMatch[0]) as LessonContent;
      lessonContentCache.set(topic, lessonContent);
      return lessonContent;
    }
  } catch (error) {
    console.error('Groq API Error:', error);
  }
  
  const fallback = getFallbackLessonContent(topic);
  lessonContentCache.set(topic, fallback);
  return fallback;
};

const getFallbackLessonContent = (topic: string): LessonContent => {
  return {
    lesson_title: topic,
    content_html: `<h1>${topic}</h1><p>${topic} is a crucial environmental concept that directly impacts how we live, work, and interact with our planet every single day. This topic covers the fundamental principles, causes, and effects that shape our understanding of environmental responsibility and sustainable living. When we learn about ${topic}, we discover how our daily choices - from the food we eat to the energy we use - create ripple effects that influence ecosystems, communities, and future generations. Understanding these connections helps us recognize that environmental issues are not distant problems but immediate concerns that affect our health, economy, and quality of life right now.</p><p>The importance of ${topic} extends far beyond textbook knowledge because it provides the foundation for making informed decisions that can create positive change in our world. This topic is especially relevant today as we face unprecedented environmental challenges that require immediate action and long-term planning. By studying ${topic}, students gain the knowledge and tools needed to become environmental leaders in their communities, understanding both the science behind environmental issues and the practical solutions that can make a real difference. Learning about this topic empowers young people to take meaningful action, whether through personal lifestyle changes, community projects, or advocating for policies that protect our planet for future generations.</p><h2>Key Points</h2><ul><li>${topic} has multiple causes that we need to understand</li><li>The effects impact both environment and human health</li><li>There are practical solutions we can implement</li><li>Individual actions can make a collective difference</li></ul><h2>What You Can Do</h2><ul><li>Learn more about ${topic} through research</li><li>Share knowledge with friends and family</li><li>Take practical steps in your daily life</li><li>Support environmental initiatives in your community</li></ul><h2>Conclusion</h2><p>By understanding ${topic}, we can work together to create positive environmental change and build a more sustainable future for everyone.</p>`,
    tts_text: `${topic} is an important environmental topic that affects our planet and daily lives. Understanding this topic helps us make better decisions for a sustainable future. ${topic} has multiple causes that we need to understand. The effects impact both environment and human health. There are practical solutions we can implement. Individual actions can make a collective difference. You can learn more about ${topic} through research. Share knowledge with friends and family. Take practical steps in your daily life. Support environmental initiatives in your community. By understanding ${topic}, we can work together to create positive environmental change and build a more sustainable future for everyone.`,
    summary: `${topic} is an important environmental issue that affects our planet and daily lives. Understanding this topic helps us make better decisions for a sustainable future.`,
    key_takeaways: [
      `${topic} has multiple causes that need to be understood. These causes often come from human activities and can be reduced through awareness and action.`,
      `The effects of ${topic} impact both our environment and human health in serious ways. Understanding these impacts helps us make better choices for our future.`,
      `There are many practical solutions we can implement in our daily lives. Small changes by many people can create big positive results over time.`,
      `Individual actions can make a collective difference when we work together. Every person has the power to contribute to solving environmental problems.`
    ],
    case_study: {
      title: `Real-world example of ${topic}`,
      text: `This case study demonstrates how ${topic} affects real communities and what actions have been taken to address the issue. The problem started when local residents noticed changes in their environment that were affecting their daily lives. Community leaders worked together with environmental experts to understand the root causes of the problem. They developed a plan that involved both immediate actions and long-term solutions. After implementing these changes over several months, the community saw significant improvements in their local environment. The success of this project shows that with proper understanding, planning, and action, positive change is possible. Other communities have since adopted similar approaches and achieved similar results. This example proves that when people work together with knowledge and determination, they can solve environmental challenges and create a better future for everyone.`
    },
    faqs: [
      { q: `What is ${topic}?`, a: `${topic} is an important environmental issue that affects our planet and requires our attention and action. It happens when certain activities or processes cause changes to our natural environment. These changes can affect the air we breathe, the water we drink, and the land we live on. Understanding what ${topic} means helps us recognize it in our daily lives and take steps to address it. When we know more about this issue, we can make better choices that help protect our environment and create a healthier future for everyone.` },
      { q: `Why is ${topic} important?`, a: `Understanding ${topic} is important because it directly affects our health, our communities, and our future. When we ignore environmental issues, they tend to get worse over time and become harder to solve. By learning about ${topic} now, we can take action before the problems become too big to handle. This knowledge helps us make better decisions in our daily lives, from the products we buy to the way we use energy and resources. When more people understand these issues, we can work together to create positive changes that benefit everyone. The choices we make today will determine what kind of world we leave for future generations.` },
      { q: `What can I do about ${topic}?`, a: `There are many things you can do to help address ${topic} in your daily life. Start by learning more about the issue and sharing this knowledge with your friends and family. Look for ways to reduce your impact on the environment through simple changes like using less energy, reducing waste, and choosing more sustainable products. You can also get involved in your community by joining environmental groups or participating in local clean-up activities. Support businesses and organizations that are working to solve environmental problems. Remember that every small action counts, and when many people make these changes together, the impact can be very significant. The most important thing is to start somewhere and keep learning and improving over time.` }
    ],
    images: [
      {
        caption: `Visual representation of ${topic}`,
        alt_text: `Image showing ${topic} concept`,
        search_query: `${topic} environmental impact`,
        recommended_sources: ['Wikimedia Commons', 'Unsplash', 'Pexels'],
        license_note: 'CC0/CC-BY or free-to-use with attribution'
      }
    ],
    materials: 'No special materials needed',
    example_submission: `A good submission would include photos of ${topic.toLowerCase()}-related activities in your area, a short reflection on what you learned, and one action you plan to take.`
  };
};

export const generateLessonContentLegacy = async (topic: string): Promise<string> => {
  const content = await generateLessonContent(topic);
  return content.content_html;
};

export const generateQuizQuestions = async (topic: string): Promise<any[]> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{
          role: 'user',
          content: `Generate 10 multiple-choice quiz questions about "${topic}" for students.

Return ONLY valid JSON array:
[
  {
    "id": "q1",
    "question": "Question about ${topic}?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A",
    "explanation": "Why this is correct",
    "points": 10
  }
]`
        }],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0]);
      return questions.slice(0, 10).map((q: any, index: number) => ({
        ...q,
        id: q.id || `q${index + 1}`,
        points: 10
      }));
    }
  } catch (error) {
    console.error('Groq Quiz Error:', error);
  }
  
  return getFallbackQuestions(topic);
};

import { challengeTitles } from '../data/challengeTitles';

const challengeCache = new Map<string, any[]>();

const getFallbackIdeas = (title: string): string[] => {
  return [
    `Try a simple approach to "${title.toLowerCase()}" and document it with photos`,
    'Involve friends or family members to make the challenge more engaging',
    'Measure the impact of your actions using basic tools or observations',
    'Share your experience with others to inspire environmental action'
  ];
};

export const generateEcoChallenges = async (lessonTitle: string, lessonId?: string): Promise<any[]> => {
  const cacheKey = lessonId ? `${lessonId}-${lessonTitle}` : lessonTitle;
  
  if (challengeCache.has(cacheKey)) {
    return challengeCache.get(cacheKey)!;
  }

  if (!lessonId || !challengeTitles[lessonId]) {
    const fallback = getFallbackChallenges(lessonTitle, lessonId);
    challengeCache.set(cacheKey, fallback);
    return fallback;
  }

  const titles = challengeTitles[lessonId];
  const difficulties = ['easy', 'medium', 'hard'] as const;
  const challenges = [];

  for (const difficulty of difficulties) {
    const title = titles[difficulty];
    
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'user',
            content: `Generate eco-challenge for "${title}" (${difficulty} level).

Return ONLY valid JSON:
{
  "id": "${lessonId}-${difficulty}",
  "title": "${title}",
  "description": "Brief description",
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
  "materials": ["Item 1", "Item 2"],
  "difficulty": "${difficulty}",
  "points": ${difficulty === 'easy' ? 25 : difficulty === 'medium' ? 50 : 100},
  "proofType": "multiple",
  "category": "${difficulty === 'easy' ? 'daily-action' : difficulty === 'medium' ? 'project' : 'impact-project'}",
  "timeframe": "${difficulty === 'easy' ? '1 day' : difficulty === 'medium' ? '3-7 days' : '1-4 weeks'}",
  "exampleIdeas": ["Idea 1", "Idea 2", "Idea 3"]
}`
          }],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const challenge = JSON.parse(jsonMatch[0]);
          challenges.push(challenge);
          continue;
        }
      }
    } catch (error) {
      console.error('Groq Challenge Error:', error);
    }
    
    // Fallback
    challenges.push({
      id: `${lessonId}-${difficulty}`,
      title,
      description: `Complete the ${title.toLowerCase()} challenge`,
      instructions: generateFallbackInstructions(title, difficulty),
      exampleIdeas: getFallbackIdeas(title),
      materials: generateFallbackMaterials(title),
      difficulty,
      points: difficulty === 'easy' ? 25 : difficulty === 'medium' ? 50 : 100,
      proofType: 'multiple',
      category: difficulty === 'easy' ? 'daily-action' : difficulty === 'medium' ? 'project' : 'impact-project',
      timeframe: difficulty === 'easy' ? '1 day' : difficulty === 'medium' ? '3-7 days' : '1-4 weeks'
    });
  }

  challengeCache.set(cacheKey, challenges);
  return challenges;
};

const generateFallbackInstructions = (title: string, difficulty: string): string[] => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('plant') && titleLower.includes('tree')) {
    return [
      'Research native tree species suitable for your area',
      'Find an appropriate location for planting (backyard, community space)',
      'Dig a hole twice the width of the root ball',
      'Plant the sapling and water thoroughly',
      'Create a weekly measurement and photo schedule',
      'Document growth progress for the specified timeframe'
    ];
  }
  
  if (titleLower.includes('plastic') && titleLower.includes('free')) {
    return [
      'Identify all single-use plastic items you normally use',
      'Find reusable alternatives for each item',
      'Start your plastic-free period and track every avoided plastic item',
      'Take photos of your alternatives in action',
      'Document challenges and solutions you discovered'
    ];
  }
  
  if (titleLower.includes('solar') && titleLower.includes('oven')) {
    return [
      'Gather materials: cardboard box, aluminum foil, black paper, plastic wrap',
      'Line the inside of the box with foil, shiny side facing in',
      'Place black paper on the bottom and cover with plastic wrap',
      'Position the oven in direct sunlight at optimal angle',
      'Test by heating water or cooking simple food',
      'Document temperature readings and cooking results'
    ];
  }
  
  if (titleLower.includes('energy') && titleLower.includes('track')) {
    return [
      'List all electrical devices and appliances in your home',
      'Record their power ratings (watts) from labels or manuals',
      'Track usage time for each device throughout 24 hours',
      'Calculate total energy consumption using Power × Time formula',
      'Identify the highest energy-consuming activities',
      'Create a summary report with photos of your tracking process'
    ];
  }
  
  if (difficulty === 'easy') {
    return [
      `Begin the ${title.toLowerCase()} activity`,
      'Document your starting point with photos',
      'Complete the main action as described in the title',
      'Record your observations and results',
      'Reflect on what you learned from this experience'
    ];
  } else if (difficulty === 'medium') {
    return [
      `Plan your approach to ${title.toLowerCase()}`,
      'Gather all necessary materials and resources',
      'Execute the activity over multiple days',
      'Track progress with daily photos and notes',
      'Measure and document the impact achieved',
      'Create a summary of lessons learned'
    ];
  } else {
    return [
      `Research and design your ${title.toLowerCase()} project`,
      'Create a detailed implementation timeline',
      'Gather community support and resources if needed',
      'Execute the project in phases over several weeks',
      'Document each phase with photos and progress reports',
      'Measure and report the final impact on your community',
      'Share your results and inspire others to take action'
    ];
  }
};

const generateFallbackMaterials = (title: string): string[] => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('plant') && titleLower.includes('tree')) {
    return ['Tree sapling', 'Shovel', 'Watering can', 'Measuring tape', 'Camera/Phone'];
  }
  
  if (titleLower.includes('solar') && titleLower.includes('oven')) {
    return ['Cardboard box', 'Aluminum foil', 'Black paper', 'Plastic wrap', 'Tape', 'Thermometer'];
  }
  
  if (titleLower.includes('plastic') && titleLower.includes('free')) {
    return ['Reusable water bottle', 'Cloth bags', 'Reusable utensils', 'Camera/Phone'];
  }
  
  if (titleLower.includes('track') || titleLower.includes('measure')) {
    return ['Notebook', 'Pen', 'Calculator', 'Measuring tools', 'Camera/Phone'];
  }
  
  return ['Camera/Phone', 'Notebook', 'Basic materials as needed'];
};

const getFallbackChallenges = (lessonTitle: string, lessonId?: string) => [
  {
    id: lessonId ? `${lessonId}-easy` : 'easy',
    title: `${lessonTitle} Daily Action`,
    description: `Complete a simple daily action related to ${lessonTitle.toLowerCase()}`,
    instructions: [
      `Identify one daily habit related to ${lessonTitle.toLowerCase()}`,
      'Implement this habit for one full day',
      'Document your action with photos',
      'Note the impact you observed'
    ],
    materials: ['Camera/Phone', 'Notebook'],
    difficulty: 'easy',
    points: 25,
    proofType: 'multiple',
    category: 'daily-action',
    timeframe: '1 day'
  },
  {
    id: lessonId ? `${lessonId}-medium` : 'medium',
    title: `${lessonTitle} Project Week`,
    description: `Implement a week-long project related to ${lessonTitle.toLowerCase()}`,
    instructions: [
      `Plan a week-long action related to ${lessonTitle.toLowerCase()}`,
      'Set measurable goals for your action',
      'Implement your plan for 7 days',
      'Document progress with daily photos',
      'Measure and record your impact'
    ],
    materials: ['Camera/Phone', 'Notebook', 'Measuring tools', 'Planning materials'],
    difficulty: 'medium',
    points: 50,
    proofType: 'multiple',
    category: 'project',
    timeframe: '1 week'
  },
  {
    id: lessonId ? `${lessonId}-hard` : 'hard',
    title: `${lessonTitle} Community Impact`,
    description: `Create a lasting positive impact related to ${lessonTitle.toLowerCase()}`,
    instructions: [
      `Design a project that addresses ${lessonTitle.toLowerCase()} in your community`,
      'Create a detailed implementation plan',
      'Gather necessary resources and support',
      'Execute your project over 2-4 weeks',
      'Document the entire process with photos/videos',
      'Measure and report your environmental impact'
    ],
    materials: ['Camera/Phone', 'Project materials', 'Planning tools', 'Community resources'],
    difficulty: 'hard',
    points: 100,
    proofType: 'multiple',
    category: 'impact-project',
    timeframe: '2-4 weeks'
  }
];

const getFallbackQuestions = (topic: string) => [
  {
    id: 'q1',
    question: `What is the primary cause of ${topic.toLowerCase()}?`,
    options: ['Human activities', 'Natural processes', 'Solar radiation', 'Ocean currents'],
    correctAnswer: 'Human activities',
    explanation: 'Most environmental issues are primarily caused by human activities.',
    points: 10
  },
  {
    id: 'q2',
    question: `Which is an effective solution for ${topic.toLowerCase()}?`,
    options: ['Ignoring the problem', 'Sustainable practices', 'Increasing consumption', 'Avoiding responsibility'],
    correctAnswer: 'Sustainable practices',
    explanation: 'Sustainable practices are key to addressing environmental challenges.',
    points: 10
  },
  {
    id: 'q3',
    question: `How does ${topic.toLowerCase()} affect the environment?`,
    options: ['No impact', 'Positive impact only', 'Negative impact on ecosystems', 'Only affects humans'],
    correctAnswer: 'Negative impact on ecosystems',
    explanation: 'Environmental issues typically have negative impacts on natural ecosystems.',
    points: 10
  },
  {
    id: 'q4',
    question: `What can individuals do about ${topic.toLowerCase()}?`,
    options: ['Nothing', 'Make conscious choices', 'Wait for others to act', 'Increase consumption'],
    correctAnswer: 'Make conscious choices',
    explanation: 'Individual actions and conscious choices can collectively make a significant impact.',
    points: 10
  },
  {
    id: 'q5',
    question: `Why is education about ${topic.toLowerCase()} important?`,
    options: ['It is not important', 'Creates awareness for action', 'Only for scientists', 'Wastes time'],
    correctAnswer: 'Creates awareness for action',
    explanation: 'Education creates awareness which leads to informed action and positive change.',
    points: 10
  }
];