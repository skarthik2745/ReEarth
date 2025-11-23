import { generateLessonContent } from './geminiApi';

export interface GeneratedChallenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  materials: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  proofType: 'photo' | 'video' | 'multiple';
  category: string;
}

const challengeTemplates = {
  easy: [
    'Find and photograph {topic} examples in your area',
    'Track your daily {topic} usage for one day',
    'List 3 ways to improve {topic} at home',
    'Take photos of {topic} alternatives you can use',
    'Interview one person about {topic} and record their thoughts'
  ],
  medium: [
    'Implement a {topic} improvement for one week and measure results',
    'Create awareness about {topic} among 5 people and document responses',
    'Build or demonstrate a simple {topic} solution',
    'Organize a small {topic} activity with family/friends',
    'Research and present {topic} solutions for your community'
  ],
  hard: [
    'Lead a group project addressing {topic} in your school/community',
    'Create and implement a {topic} campaign reaching 20+ people',
    'Build a working model or prototype related to {topic}',
    'Organize an event or workshop about {topic}',
    'Develop a detailed plan for {topic} improvement in your area'
  ]
};

export const generateChallengesForLesson = async (lessonTitle: string, lessonId: string): Promise<GeneratedChallenge[]> => {
  const topic = lessonTitle.toLowerCase();
  
  // Generate one easy and one medium/hard challenge
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', Math.random() > 0.7 ? 'hard' : 'medium'];
  const challenges: GeneratedChallenge[] = [];

  for (let i = 0; i < 2; i++) {
    const difficulty = difficulties[i];
    const templates = challengeTemplates[difficulty];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    try {
      const prompt = `Generate a practical eco-challenge for the lesson "${lessonTitle}". 
      
      Challenge type: ${difficulty}
      Template: ${template.replace('{topic}', topic)}
      
      Provide:
      1. A catchy title (max 6 words)
      2. Brief description (1 sentence)
      3. Step-by-step instructions (4-6 steps)
      4. Materials needed (if any)
      5. Category (lifestyle/education/community/research/action)
      
      Make it practical, impactful, and achievable for students aged 12-18.
      Format as JSON with fields: title, description, instructions (array), materials (array), category`;

      const response = await generateLessonContent(prompt);
      
      // Try to parse JSON response
      let challengeData;
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          challengeData = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        // Fallback to template-based generation
        challengeData = generateFallbackChallenge(lessonTitle, difficulty, i + 1);
      }

      if (!challengeData) {
        challengeData = generateFallbackChallenge(lessonTitle, difficulty, i + 1);
      }

      challenges.push({
        id: `${lessonId}-ch${i + 1}`,
        title: challengeData.title || `${lessonTitle} Challenge ${i + 1}`,
        description: challengeData.description || `Complete a ${difficulty} challenge related to ${lessonTitle}`,
        instructions: Array.isArray(challengeData.instructions) ? challengeData.instructions : [
          `Research ${topic} in your area`,
          `Document your findings with photos`,
          `Implement one improvement`,
          `Write reflection on experience`
        ],
        materials: Array.isArray(challengeData.materials) ? challengeData.materials : ['Camera/Phone', 'Notebook'],
        difficulty,
        points: difficulty === 'easy' ? 25 : difficulty === 'medium' ? 45 : 70,
        proofType: difficulty === 'easy' ? 'photo' : 'multiple',
        category: challengeData.category || 'action'
      });
    } catch (error) {
      // Fallback challenge
      challenges.push(generateFallbackChallenge(lessonTitle, difficulty, i + 1));
    }
  }

  return challenges;
};

const generateFallbackChallenge = (lessonTitle: string, difficulty: 'easy' | 'medium' | 'hard', index: number): GeneratedChallenge => {
  const topic = lessonTitle.toLowerCase();
  
  const fallbackChallenges = {
    easy: {
      title: `Discover ${lessonTitle}`,
      description: `Find examples of ${topic} in your daily environment`,
      instructions: [
        `Look for examples of ${topic} around you`,
        'Take photos of what you find',
        'Note why each example is important',
        'Share your discoveries with family'
      ],
      materials: ['Camera/Phone'],
      category: 'research'
    },
    medium: {
      title: `${lessonTitle} Action Week`,
      description: `Implement ${topic} improvements for one week`,
      instructions: [
        `Identify one way to improve ${topic} in your life`,
        'Plan your improvement strategy',
        'Implement the change for 7 days',
        'Track your progress daily',
        'Measure the impact achieved'
      ],
      materials: ['Notebook', 'Camera/Phone'],
      category: 'action'
    },
    hard: {
      title: `${lessonTitle} Community Project`,
      description: `Lead a community initiative related to ${topic}`,
      instructions: [
        `Design a community project addressing ${topic}`,
        'Recruit at least 3 people to help',
        'Implement the project over 2 weeks',
        'Document the process and results',
        'Present findings to your community'
      ],
      materials: ['Planning materials', 'Camera/Phone', 'Presentation tools'],
      category: 'community'
    }
  };

  const template = fallbackChallenges[difficulty];
  
  return {
    id: `${lessonTitle.toLowerCase().replace(/\s+/g, '-')}-ch${index}`,
    title: template.title,
    description: template.description,
    instructions: template.instructions,
    materials: template.materials,
    difficulty,
    points: difficulty === 'easy' ? 25 : difficulty === 'medium' ? 45 : 70,
    proofType: difficulty === 'easy' ? 'photo' : 'multiple',
    category: template.category
  };
};