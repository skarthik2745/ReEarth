

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

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

export const generateChallengesForLesson = async (lessonTitle: string, lessonId: string): Promise<GeneratedChallenge[]> => {
  const difficulties: ('easy' | 'medium' | 'hard')[] = ['easy', Math.random() > 0.7 ? 'hard' : 'medium'];
  const challenges: GeneratedChallenge[] = [];

  for (let i = 0; i < 2; i++) {
    const difficulty = difficulties[i];
    
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
            content: `Generate a ${difficulty} eco-challenge for lesson "${lessonTitle}".

Return ONLY valid JSON:
{
  "title": "Challenge title (max 6 words)",
  "description": "Brief description (1 sentence)",
  "instructions": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "materials": ["Material 1", "Material 2"],
  "category": "action"
}`
          }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const challengeData = JSON.parse(jsonMatch[0]);
          
          challenges.push({
            id: `${lessonId}-ch${i + 1}`,
            title: challengeData.title || `${lessonTitle} Challenge ${i + 1}`,
            description: challengeData.description || `Complete a ${difficulty} challenge related to ${lessonTitle}`,
            instructions: Array.isArray(challengeData.instructions) ? challengeData.instructions : [
              `Research ${lessonTitle.toLowerCase()} in your area`,
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
          continue;
        }
      }
    } catch (error) {
      console.error('Groq Challenge Error:', error);
    }
    
    // Fallback
    challenges.push(generateFallbackChallenge(lessonTitle, difficulty, i + 1));
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