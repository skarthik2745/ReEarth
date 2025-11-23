const GEMINI_API_KEY = 'AIzaSyB288K-WBJ-aE0O1Il4ZtNopt52vIKdyNs';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

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
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert sustainability educator. Generate comprehensive lesson content for "${topic}". Use simple English, no jargon, no decorative symbols, no external links.

IMPORTANT CONTENT RULES:
- Every section must have 3-4 full paragraphs (5-7 sentences each)
- No one-line responses under any heading
- Each paragraph must explain clearly with definitions, examples, and real-life connections
- Use simple English words and clear explanations

Produce exactly this JSON structure:
{
  "lesson_title": "${topic}",
  "summary": "2-3 sentences explaining what this lesson covers and why it matters",
  "content_html": "1200-1800 words with detailed HTML structure:\n<h1>${topic}</h1>\n<p>First paragraph: Clear definition and explanation of what ${topic} means in simple terms. Explain the basic concept, where it comes from, and why it exists. Include specific examples that students can relate to from their daily lives. Make sure to cover the fundamental aspects that everyone should understand about this topic.</p>\n<p>Second paragraph: Deep dive into why ${topic} is important and relevant today. Explain how it connects to current environmental challenges, affects different communities, and impacts our future. Discuss the scope and scale of this issue, including both local and global perspectives. Connect it to students' lives and explain why learning about this topic matters for their generation.</p>\n\n<h2>Understanding ${topic}</h2>\n<h3>What is ${topic}?</h3>\n<p>First paragraph: Clear definition with simple explanation...</p>\n<p>Second paragraph: Main causes and how it happens...</p>\n<p>Third paragraph: Why this is important to understand...</p>\n\n<h3>Impact and Effects</h3>\n<p>First paragraph: Environmental impacts with specific examples...</p>\n<p>Second paragraph: Effects on people and communities...</p>\n<p>Third paragraph: Long-term consequences if nothing is done...</p>\n\n<h3>Solutions and Actions</h3>\n<p>First paragraph: What governments and organizations are doing...</p>\n<p>Second paragraph: What communities can do together...</p>\n<p>Third paragraph: What individuals can do in daily life...</p>\n\n<h2>Case Study</h2>\n<p>First paragraph: Background of a real-world example related to ${topic}...</p>\n<p>Second paragraph: What specific actions were taken to address the problem...</p>\n<p>Third paragraph: What results were achieved and how long it took...</p>\n<p>Fourth paragraph: What lessons we can learn and apply in our own lives...</p>\n\n<h2>Practical Tips</h2>\n<p>First paragraph: Detailed explanation of first practical tip with step-by-step example...</p>\n<p>Second paragraph: Detailed explanation of second practical tip with real-life scenario...</p>\n<p>Third paragraph: Detailed explanation of third practical tip with benefits and results...</p>\n<p>Fourth paragraph: How to combine all tips and track progress over time...</p>\n\n<h2>Summary</h2>\n<p>First paragraph: Recap of main points about ${topic} and why it matters...</p>\n<p>Second paragraph: Key actions students can take starting today...</p>\n<p>Third paragraph: How small actions lead to big changes over time...</p>",
  "tts_text": "Plain text version for audio, covering main points in simple sentences",
  "key_takeaways": ["4-6 detailed takeaway points, each 2-3 sentences long"],
  "case_study": {"title": "Real example title", "text": "400-500 word detailed case study with background, actions taken, results achieved, and lessons learned. Must be 3-4 full paragraphs."},
  "faqs": [
    {"q": "Common question about ${topic}?", "a": "3-4 paragraph detailed answer explaining the concept, providing examples, and connecting to daily life. Each paragraph should be 4-5 sentences."},
    {"q": "Another important question?", "a": "3-4 paragraph comprehensive answer with clear explanations, real examples, and practical advice."},
    {"q": "Third relevant question?", "a": "3-4 paragraph thorough response covering all aspects of the question with simple language and helpful examples."}
  ],
  "images": [
    {"caption": "Short description", "alt_text": "Accessibility text", "search_query": "specific search phrase for ${topic}", "recommended_sources": ["Wikimedia Commons", "Unsplash", "Pexels"], "license_note": "CC0/CC-BY or free-to-use"},
    {"caption": "Different aspect", "alt_text": "Alt text", "search_query": "another ${topic} search phrase", "recommended_sources": ["NASA", "Government portals"], "license_note": "Free-to-use with attribution"},
    {"caption": "Third image", "alt_text": "Description", "search_query": "${topic} real world example", "recommended_sources": ["Wikimedia Commons", "Educational sites"], "license_note": "CC0 preferred"},
    {"caption": "Fourth image", "alt_text": "Alt description", "search_query": "${topic} impact environment", "recommended_sources": ["Unsplash", "Pexels"], "license_note": "Free commercial use"},
    {"caption": "Fifth image", "alt_text": "Accessibility text", "search_query": "${topic} solutions community", "recommended_sources": ["Government data", "NGO sites"], "license_note": "Public domain preferred"},
    {"caption": "Sixth image", "alt_text": "Description", "search_query": "${topic} technology innovation", "recommended_sources": ["Wikimedia Commons", "University sites"], "license_note": "CC-BY acceptable"}
  ],
  "materials": "List simple materials needed or 'No special materials needed'",
  "example_submission": "1-3 lines describing what a good student photo/video/reflection would look like for this lesson"
}

Rules: Make content unique to ${topic}, use real-world examples, keep language simple, provide 6 distinct image search queries, no external URLs, content must be substantial and educational with detailed explanations in every section.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.replace(/```json\s*/, '').replace(/\s*```$/, '');
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/```\s*/, '').replace(/\s*```$/, '');
      }
      
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const lessonContent = JSON.parse(jsonMatch[0]) as LessonContent;
        lessonContentCache.set(topic, lessonContent);
        return lessonContent;
      }
    } catch (parseError) {
      console.error('Lesson Content Parse Error:', parseError);
    }
  } catch (error) {
    console.error('Lesson Content Generation Error:', error);
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

// Legacy function for backward compatibility
export const generateLessonContentLegacy = async (topic: string): Promise<string> => {
  const content = await generateLessonContent(topic);
  return content.content_html;
};

export const generateQuizQuestions = async (topic: string): Promise<any[]> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Generate exactly 10 multiple-choice quiz questions about "${topic}" for students. Each question should test understanding of key concepts.

Format each question as a JSON object with these exact fields:
{
  "id": "q1",
  "question": "Question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A",
  "explanation": "Brief explanation of why this is correct",
  "points": 10
}

Return ONLY a valid JSON array of 10 questions, no other text.`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return questions.slice(0, 10).map((q: any, index: number) => ({
          ...q,
          id: q.id || `q${index + 1}`,
          points: 10
        }));
      }
      return getFallbackQuestions(topic);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      return getFallbackQuestions(topic);
    }
  } catch (error) {
    console.error('Quiz Generation Error:', error);
    return getFallbackQuestions(topic);
  }
};

import { challengeTitles } from '../data/challengeTitles';

const challengeCache = new Map<string, any[]>();

const generateExampleIdeas = async (title: string): Promise<string[]> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an assistant for generating "Example Ideas" for eco-challenges.
Do NOT repeat the procedure steps.
Instead, give 3-5 short, practical, and creative ideas or suggestions that show how someone can try or approach the eco-challenge in real life.
Keep the tone simple, action-oriented, and encouraging.
Each idea should be different and easy to understand.
Avoid generic repetition — focus on specific, real-life examples.

Eco Challenge Title: ${title}

Generate "Example Ideas" for this eco challenge.

Return as a simple list with bullet points, no other formatting.`
          }]
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract bullet points from response
      const ideas = content
        .split('\n')
        .filter(line => line.trim().startsWith('*') || line.trim().startsWith('•') || line.trim().startsWith('-'))
        .map(line => line.replace(/^[*•-]\s*/, '').trim())
        .filter(idea => idea.length > 0)
        .slice(0, 5);
      
      return ideas.length > 0 ? ideas : getFallbackIdeas(title);
    }
  } catch (error) {
    console.error('Example Ideas Generation Error:', error);
  }
  
  return getFallbackIdeas(title);
};

const getFallbackIdeas = (title: string): string[] => {
  const titleLower = title.toLowerCase();
  
  // Sustainability challenges
  if (titleLower.includes('plastic-free')) return ['Replace plastic water bottles with a reusable steel bottle', 'Use cloth bags for grocery shopping instead of plastic bags', 'Carry reusable utensils and avoid disposable cutlery', 'Choose products with minimal plastic packaging'];
  if (titleLower.includes('sustainability journal')) return ['Track daily water and electricity usage in a notebook', 'Note down 3 sustainable actions you took each day', 'Interview family members about their eco-friendly habits', 'Create weekly goals for reducing your environmental impact'];
  if (titleLower.includes('workshop') && titleLower.includes('sustainability')) return ['Create simple posters explaining reduce, reuse, recycle', 'Teach 5 friends about composting kitchen waste', 'Organize a 15-minute presentation in your class', 'Start a small eco-club with classmates'];
  if (titleLower.includes('resource use')) return ['Measure how much water you use while brushing teeth', 'Count the number of lights left on unnecessarily each day', 'Track food waste in your household for a week', 'Note down all single-use items you throw away daily'];
  if (titleLower.includes('interview') && titleLower.includes('sustainable')) return ['Ask neighbors about their water-saving techniques', 'Interview local shopkeepers about eco-friendly products', 'Talk to elders about traditional sustainable practices', 'Survey friends about their environmental concerns'];
  if (titleLower.includes('poster') && titleLower.includes('people')) return ['Draw the three pillars with examples from your daily life', 'Create a colorful chart showing how each pillar connects', 'Make a before/after comparison of sustainable vs unsustainable practices', 'Design infographics using simple drawings and facts'];
  if (titleLower.includes('letter to future')) return ['Write about the environmental changes you want to see', 'Promise specific actions you will take for the planet', 'Describe your dream of a cleaner, greener world', 'Include drawings of renewable energy sources you hope to use'];
  if (titleLower.includes('plant') && titleLower.includes('tree')) return ['Use tomato or chili seeds from your kitchen and grow them in a small pot', 'Ask your local nursery for a free sapling to plant in your balcony', 'Try planting a fast-growing tree like drumstick or neem in your backyard', 'Plant a flower sapling near your doorstep to attract bees and butterflies'];
  if (titleLower.includes('video') && titleLower.includes('sustainability')) return ['Record a 2-minute explanation of why you care about the environment', 'Create a simple slideshow with photos of local environmental issues', 'Film yourself doing 3 sustainable actions in your daily routine', 'Make a before/after video showing a small environmental improvement'];
  if (titleLower.includes('sdg')) return ['Match each SDG to something you see in your neighborhood', 'Create a simple chart linking SDGs to your school activities', 'Find examples of SDGs in action in your local community', 'Design a poster showing how students can contribute to SDGs'];
  if (titleLower.includes('switch off')) return ['Set phone reminders to turn off lights every 2 hours', 'Create a family challenge to see who saves the most electricity', 'Put sticky notes near switches as reminders', 'Track your electricity meter readings before and after the week'];
  if (titleLower.includes('compost')) return ['Use a large plastic container with holes for drainage', 'Layer kitchen scraps with dry leaves or newspaper', 'Turn the mixture every few days with a stick', 'Add water occasionally to keep it moist but not soggy'];
  
  // Renewable Energy challenges
  if (titleLower.includes('track') && titleLower.includes('energy')) return ['List all electrical devices in your home and note their wattage', 'Time how long each device runs during a typical day', 'Calculate total energy consumption using simple multiplication', 'Identify which appliances use the most electricity'];
  if (titleLower.includes('solar') && titleLower.includes('oven')) return ['Use a pizza box, aluminum foil, and plastic wrap to build your oven', 'Test it by heating water or melting chocolate on a sunny day', 'Try cooking simple foods like s\'mores or warming up leftovers', 'Measure the temperature inside and compare it to room temperature'];
  if (titleLower.includes('windmill') || titleLower.includes('wind')) return ['Use paper, cardboard, and a pencil to create a simple windmill', 'Test it outside on a windy day and see how fast it spins', 'Try different blade shapes to see which works best', 'Attach it to a small LED light to demonstrate electricity generation'];
  if (titleLower.includes('water wheel')) return ['Use a plastic bottle, cork, and toothpicks to build a water wheel', 'Test it under a running tap or with a watering can', 'Try different blade angles to maximize rotation speed', 'Connect it to a small generator or LED to show power generation'];
  if (titleLower.includes('kitchen waste')) return ['Separate fruit peels, vegetable scraps, and leftover food', 'Weigh the waste to see how much your family produces daily', 'Try making natural fertilizer by composting the organic waste', 'Use the compost to grow herbs like mint or coriander'];
  if (titleLower.includes('hot springs') || titleLower.includes('geothermal')) return ['Research if there are any hot springs within 100km of your area', 'Visit a local spa or hot water source and ask about the temperature', 'Compare the cost of heating water with electricity vs geothermal', 'Create a simple diagram showing how geothermal energy works'];
  if (titleLower.includes('tide')) return ['Visit a nearby beach or river and observe water levels at different times', 'Take photos of the same spot at high tide and low tide', 'Research online tide charts for your nearest coastal area', 'Create a simple model using a basin and water to demonstrate tidal movement'];
  if (titleLower.includes('nuclear')) return ['Research the nearest nuclear power plant to your location', 'Compare the electricity output of nuclear vs coal plants', 'List 5 safety measures used in nuclear power plants', 'Debate with family members about nuclear energy pros and cons'];
  if (titleLower.includes('scorecard') && titleLower.includes('energy')) return ['Rate solar, wind, hydro, and fossil fuels on cost, pollution, and availability', 'Give each energy source a score out of 10 for environmental friendliness', 'Compare which energy sources work best in your local climate', 'Create a simple chart showing the best energy mix for your region'];
  if (titleLower.includes('future city')) return ['Draw a city powered entirely by solar panels and wind turbines', 'Design electric vehicle charging stations powered by renewable energy', 'Include green buildings with solar roofs and energy-efficient lighting', 'Add parks and green spaces to make the city more sustainable'];
  
  // Non-renewable Energy challenges
  if (titleLower.includes('fossil fuels')) return ['List all petroleum products you use: plastic items, fuel, cosmetics', 'Count how many times your family uses petrol or diesel in a week', 'Identify coal-powered electricity in your area', 'Note down all gas-powered appliances in your home'];
  if (titleLower.includes('coal')) return ['Research which power plants near you use coal for electricity', 'Find news articles about coal mining and its environmental impact', 'Calculate how much CO2 is produced by burning 1kg of coal', 'Compare air quality in coal-mining areas vs clean energy areas'];
  if (titleLower.includes('petrol') || titleLower.includes('oil')) return ['Track how many kilometers your family travels by car/bike in a week', 'List all plastic items in your home that are made from petroleum', 'Find petroleum-based products in cosmetics, medicines, and food packaging', 'Calculate the cost of petrol vs electricity for transportation'];
  if (titleLower.includes('pollution sources')) return ['Take photos of vehicle exhaust, factory smoke, and burning waste', 'Identify construction sites that create dust pollution', 'Note down times when air quality seems worst in your area', 'Document noise pollution from traffic, construction, or loudspeakers'];
  if (titleLower.includes('carbon footprint')) return ['Use an online calculator to measure your family\'s carbon emissions', 'Compare carbon footprints of different transportation methods', 'Calculate emissions from electricity, food, and travel', 'Set a goal to reduce your carbon footprint by 20%'];
  
  // Climate & Carbon challenges
  if (titleLower.includes('emission activities')) return ['List activities that produce CO2: cooking, driving, using electricity', 'Note down every time you use fossil fuel-powered transportation', 'Track when you use air conditioning or heating', 'Count how many electronic devices you use daily'];
  if (titleLower.includes('greenhouse') && titleLower.includes('model')) return ['Use a clear plastic bottle, thermometer, and sunlight', 'Compare temperature inside the bottle vs outside temperature', 'Add CO2 by breathing into the bottle and measure temperature change', 'Demonstrate how greenhouse gases trap heat'];
  if (titleLower.includes('climate news')) return ['Find 3 recent news articles about climate change impacts', 'Look for stories about extreme weather events in your country', 'Research how climate change affects agriculture and food prices', 'Collect news about renewable energy projects in your region'];
  if (titleLower.includes('interview elders')) return ['Ask grandparents about weather patterns 30 years ago', 'Compare rainfall, temperature, and seasons from their childhood to now', 'Document traditional methods they used to predict weather', 'Record their observations about environmental changes over time'];
  if (titleLower.includes('paris agreement')) return ['Read a simple summary of the Paris Agreement online', 'Find out what commitments your country made to reduce emissions', 'Compare emission reduction targets of different countries', 'Research which countries are meeting their climate goals'];
  if (titleLower.includes('net zero')) return ['Calculate your daily carbon emissions from transport and electricity', 'Find ways to offset emissions: planting trees, using renewable energy', 'Set a goal to balance your emissions with carbon-reducing actions', 'Track your progress toward net zero for one month'];
  
  // Default fallback
  return [
    `Try a simple approach to "${title.toLowerCase()}" and document it with photos`,
    'Involve friends or family members to make the challenge more engaging',
    'Measure the impact of your actions using basic tools or observations',
    'Share your experience with others to inspire environmental action',
    'Keep notes about what you learned and any challenges you faced'
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
      const [challengeResponse, exampleIdeas] = await Promise.all([
        fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are an expert sustainability educator designing eco-challenges for students.
I will give you an eco-challenge title. For that title, generate the following:

1. Challenge Title (repeat the same as given input)
2. Step-by-Step Procedure (5–8 bullet points, clear instructions from start to finish)
3. Materials Required (if any; if none, say "No materials needed")

Rules:
- Every challenge must be UNIQUE and match its specific title
- The procedure must be ACTION-ORIENTED (students must do something real, not just write)
- Keep steps clear and realistic so that students of any level can complete them
- Never repeat the same generic 5 steps for all challenges
- Always align the challenge with environmental sustainability, clean energy, or community impact

Now generate the output for this eco-challenge title: "${title}"

Return ONLY this JSON format:
{
  "id": "${difficulty}",
  "title": "${title}",
  "description": "Brief description of what student will accomplish",
  "instructions": ["Step 1: Specific action for this challenge", "Step 2: Specific action for this challenge", "Step 3: Specific action for this challenge", "Step 4: Specific action for this challenge", "Step 5: Specific action for this challenge"],
  "materials": ["Specific item 1", "Specific item 2"] or ["No materials needed"],
  "difficulty": "${difficulty}",
  "points": ${difficulty === 'easy' ? 25 : difficulty === 'medium' ? 50 : 100},
  "proofType": "multiple",
  "category": "${difficulty === 'easy' ? 'daily-action' : difficulty === 'medium' ? 'project' : 'impact-project'}",
  "timeframe": "${difficulty === 'easy' ? '1 day' : difficulty === 'medium' ? '3-7 days' : '1-4 weeks'}"
}`
              }]
            }]
          })
        }),
        generateExampleIdeas(title)
      ]);

      if (challengeResponse.ok) {
        const data = await challengeResponse.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        try {
          let cleanContent = content.trim();
          if (cleanContent.startsWith('```json')) {
            cleanContent = cleanContent.replace(/```json\s*/, '').replace(/\s*```$/, '');
          }
          if (cleanContent.startsWith('```')) {
            cleanContent = cleanContent.replace(/```\s*/, '').replace(/\s*```$/, '');
          }
          
          const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const challenge = JSON.parse(jsonMatch[0]);
            challenge.id = `${lessonId}-${difficulty}`;
            challenge.exampleIdeas = exampleIdeas;
            challenges.push(challenge);
            console.log(`Generated challenge for ${lessonId}-${difficulty}:`, challenge.title);
            continue;
          }
        } catch (parseError) {
          console.error('Challenge Parse Error for', title, ':', parseError);
        }
      }
    } catch (error) {
      console.error('Challenge Generation Error:', error);
    }
    
    // Fallback for this difficulty
    console.log(`Using fallback for ${lessonId}-${difficulty}: ${title}`);
    challenges.push({
      id: `${lessonId}-${difficulty}`,
      title,
      description: `Complete the ${title.toLowerCase()} challenge`,
      instructions: generateFallbackInstructions(title, difficulty),
      example: generateFallbackExample(title),
      exampleIdeas: await generateExampleIdeas(title),
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
  
  // Generic fallback based on difficulty
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

const generateFallbackExample = (title: string): string => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('plant') && titleLower.includes('tree')) {
    return 'Example: A student plants a native oak sapling in their backyard, measures its height weekly, and creates a photo timeline showing 3 months of growth from 2 feet to 3.5 feet tall.';
  }
  
  if (titleLower.includes('plastic') && titleLower.includes('free')) {
    return 'Example: A student replaces plastic water bottles with a reusable bottle, uses cloth bags instead of plastic bags, and avoids plastic utensils, documenting each substitution with photos.';
  }
  
  if (titleLower.includes('solar') && titleLower.includes('oven')) {
    return 'Example: A student builds a solar oven using a pizza box and foil, successfully heats water to 140°F in 2 hours, and cooks s\'mores, documenting the temperature changes and cooking process.';
  }
  
  return `Example: A student successfully completes the ${title.toLowerCase()} challenge by following the steps systematically and documenting their experience with photos and reflections.`;
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
    example: `Example: A student learning about ${lessonTitle} might track their daily habits related to this topic and make one specific improvement.`,
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
    example: `Example: A student could create a week-long project that applies ${lessonTitle} concepts to solve a real problem in their community.`,
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
    example: `Example: A student might organize a community initiative focused on ${lessonTitle} that creates measurable positive change for multiple people.`,
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
  },
  {
    id: 'q6',
    question: `What role do governments play in addressing ${topic.toLowerCase()}?`,
    options: ['No role', 'Policy and regulation', 'Only funding', 'Ignore the issue'],
    correctAnswer: 'Policy and regulation',
    explanation: 'Governments play a crucial role through policy-making and environmental regulations.',
    points: 10
  },
  {
    id: 'q7',
    question: `How can technology help with ${topic.toLowerCase()}?`,
    options: ['Cannot help', 'Innovative solutions', 'Makes it worse', 'Only complicates'],
    correctAnswer: 'Innovative solutions',
    explanation: 'Technology can provide innovative solutions to environmental challenges.',
    points: 10
  },
  {
    id: 'q8',
    question: `What is the long-term impact of ${topic.toLowerCase()}?`,
    options: ['No long-term effects', 'Affects future generations', 'Only short-term effects', 'Positive effects only'],
    correctAnswer: 'Affects future generations',
    explanation: 'Environmental issues have long-term impacts that affect future generations.',
    points: 10
  },
  {
    id: 'q9',
    question: `How can communities address ${topic.toLowerCase()}?`,
    options: ['Individual action only', 'Collective community efforts', 'Government action only', 'No community role'],
    correctAnswer: 'Collective community efforts',
    explanation: 'Communities can make significant impact through collective efforts and initiatives.',
    points: 10
  },
  {
    id: 'q10',
    question: `What is the most important first step in addressing ${topic.toLowerCase()}?`,
    options: ['Ignore the problem', 'Understanding the issue', 'Blame others', 'Wait for solutions'],
    correctAnswer: 'Understanding the issue',
    explanation: 'Understanding the issue is the first step toward finding and implementing solutions.',
    points: 10
  }
];