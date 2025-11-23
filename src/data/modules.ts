export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  type: 'intro' | 'content' | 'interactive' | 'challenge' | 'reflection';
  quiz?: Quiz;
  ecoChallenge?: EcoChallenge;
  points: number;
  requiredForBadge?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number; // in minutes
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'drag-drop';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  proofType: 'photo' | 'video' | 'text' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeframe: string; // e.g., "1 week", "3 days"
  category: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
  badge: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  certificate: {
    id: string;
    name: string;
    description: string;
  };
  estimatedTime: number; // total hours
}

export const modules: Module[] = [
  {
    id: 'carbon-emission',
    title: 'Carbon Emission',
    description: 'Understanding carbon emissions and their impact on our planet',
    icon: '🏭',
    color: 'from-red-400 to-orange-500',
    estimatedTime: 4,
    badge: {
      id: 'carbon-cutter',
      name: 'Carbon Cutter',
      icon: '♻️',
      description: 'Master of carbon emission reduction'
    },
    certificate: {
      id: 'carbon-emission-cert',
      name: 'Carbon Emission Specialist',
      description: 'Certified in understanding and reducing carbon emissions'
    },
    lessons: [
      {
        id: 'ce-intro',
        title: 'What Are Carbon Emissions?',
        description: 'Introduction to carbon emissions and greenhouse gases',
        content: `Carbon emissions refer to the release of carbon dioxide (CO2) and other greenhouse gases into the atmosphere. These emissions primarily come from burning fossil fuels like coal, oil, and natural gas for energy production, transportation, and industrial processes.

Key Sources of Carbon Emissions:
• Energy Production (25%): Power plants burning fossil fuels
• Agriculture & Land Use (24%): Deforestation, livestock, farming
• Industry (21%): Manufacturing, cement production, chemicals
• Transportation (14%): Cars, trucks, ships, airplanes
• Buildings (6%): Heating, cooling, lighting
• Other Energy Uses (10%): Various industrial processes

The greenhouse effect occurs when these gases trap heat in Earth's atmosphere, leading to global warming and climate change.`,
        duration: 30,
        type: 'intro',
        points: 50,
        quiz: {
          id: 'ce-intro-quiz',
          questions: [
            {
              id: 'q1',
              question: 'What percentage of global carbon emissions comes from energy production?',
              type: 'multiple-choice',
              options: ['15%', '25%', '35%', '45%'],
              correctAnswer: '25%',
              explanation: 'Energy production accounts for approximately 25% of global carbon emissions.',
              points: 10
            },
            {
              id: 'q2',
              question: 'Carbon dioxide is the only greenhouse gas that contributes to climate change.',
              type: 'true-false',
              options: ['True', 'False'],
              correctAnswer: 'False',
              explanation: 'Other greenhouse gases include methane, nitrous oxide, and fluorinated gases.',
              points: 10
            }
          ],
          passingScore: 70,
          timeLimit: 10
        }
      },
      {
        id: 'ce-sources',
        title: 'Major Sources of Carbon Emissions',
        description: 'Detailed look at where carbon emissions come from',
        content: `Understanding the major sources of carbon emissions helps us identify where to focus our reduction efforts.

Fossil Fuel Combustion:
• Coal: Highest carbon content, used in power plants
• Oil: Used in transportation and heating
• Natural Gas: Cleaner than coal but still produces CO2

Industrial Processes:
• Cement production releases CO2 from limestone
• Steel manufacturing requires coal for heat
• Chemical processes release various greenhouse gases

Transportation Sector:
• Road transport: 75% of transport emissions
• Aviation: Growing source of emissions
• Shipping: International trade impact
• Rail: Most efficient for freight

Deforestation Impact:
• Trees store carbon in their biomass
• Cutting forests releases stored carbon
• Reduces Earth's capacity to absorb CO2`,
        duration: 45,
        type: 'content',
        points: 75,
        quiz: {
          id: 'ce-sources-quiz',
          questions: [
            {
              id: 'q1',
              question: 'Which fossil fuel has the highest carbon content?',
              type: 'multiple-choice',
              options: ['Natural Gas', 'Oil', 'Coal', 'Propane'],
              correctAnswer: 'Coal',
              explanation: 'Coal has the highest carbon content and produces the most CO2 per unit of energy.',
              points: 15
            },
            {
              id: 'q2',
              question: 'What percentage of transport emissions comes from road transport?',
              type: 'multiple-choice',
              options: ['50%', '65%', '75%', '85%'],
              correctAnswer: '75%',
              explanation: 'Road transport accounts for approximately 75% of all transportation emissions.',
              points: 15
            }
          ],
          passingScore: 70
        }
      },
      {
        id: 'ce-measurement',
        title: 'Measuring Carbon Emissions',
        description: 'How we measure and track carbon emissions',
        content: `Measuring carbon emissions is crucial for understanding our impact and tracking progress in reduction efforts.

Units of Measurement:
• CO2 equivalent (CO2e): Standard unit that includes all greenhouse gases
• Metric tons: Most common unit for large-scale measurements
• Parts per million (ppm): Atmospheric concentration measurement

Measurement Scopes:
• Scope 1: Direct emissions from owned sources
• Scope 2: Indirect emissions from purchased energy
• Scope 3: All other indirect emissions in value chain

Carbon Accounting Methods:
• Life Cycle Assessment (LCA): Cradle-to-grave analysis
• Carbon footprint calculators: Personal/organizational tools
• Emission factors: Standard values for different activities
• Monitoring systems: Real-time tracking technology

Global Monitoring:
• Mauna Loa Observatory: Atmospheric CO2 tracking
• Satellite monitoring: Global emission mapping
• National inventories: Country-level reporting
• Corporate reporting: Business emission disclosure`,
        duration: 40,
        type: 'interactive',
        points: 80,
        ecoChallenge: {
          id: 'carbon-calculator',
          title: 'Calculate Your Carbon Footprint',
          description: 'Use an online carbon calculator to measure your personal carbon footprint',
          instructions: [
            'Find a reputable online carbon footprint calculator',
            'Input your transportation, energy, and lifestyle data',
            'Take a screenshot of your results',
            'Identify your top 3 emission sources',
            'Write a brief reflection on what surprised you'
          ],
          proofType: 'multiple',
          difficulty: 'easy',
          points: 100,
          timeframe: '3 days',
          category: 'measurement'
        }
      },
      {
        id: 'ce-reduction',
        title: 'Carbon Reduction Strategies',
        description: 'Practical ways to reduce carbon emissions',
        content: `Reducing carbon emissions requires action at individual, community, and global levels.

Individual Actions:
• Transportation: Walk, bike, use public transit, electric vehicles
• Energy: LED bulbs, efficient appliances, renewable energy
• Diet: Reduce meat consumption, local food, less waste
• Consumption: Buy less, repair more, choose sustainable products

Community Solutions:
• Renewable energy projects: Solar, wind installations
• Public transportation: Efficient mass transit systems
• Green building: Energy-efficient construction standards
• Urban planning: Walkable cities, green spaces

Technology Solutions:
• Carbon capture and storage (CCS)
• Renewable energy advancement
• Energy storage improvements
• Smart grid technology
• Electric vehicle infrastructure

Policy Measures:
• Carbon pricing: Tax or cap-and-trade systems
• Renewable energy standards
• Building efficiency codes
• Transportation electrification
• International cooperation agreements`,
        duration: 50,
        type: 'content',
        points: 90,
        requiredForBadge: 'carbon-cutter'
      },
      {
        id: 'ce-case-study',
        title: 'Success Stories in Carbon Reduction',
        description: 'Real-world examples of successful carbon reduction initiatives',
        content: `Learning from successful carbon reduction initiatives provides inspiration and practical insights.

Costa Rica's Carbon Neutrality:
• Goal: Carbon neutral by 2021 (achieved in 2017)
• Strategy: Reforestation, renewable energy, eco-tourism
• Results: 99% renewable electricity, forest cover doubled
• Lessons: Government commitment, community involvement

Denmark's Wind Power Revolution:
• Achievement: 50% of electricity from wind power
• Timeline: 40-year development program
• Innovation: Offshore wind farms, grid integration
• Export: Technology and expertise worldwide

Interface Inc. Mission Zero:
• Goal: Eliminate environmental footprint by 2020
• Approach: Renewable energy, carbon negative products
• Results: 96% reduction in carbon intensity
• Impact: Proof that business can be regenerative

City of Copenhagen:
• Target: Carbon neutral by 2025
• Methods: District heating, cycling infrastructure, green roofs
• Progress: 42% reduction since 2005
• Innovation: Waste-to-energy plants, smart city technology`,
        duration: 35,
        type: 'reflection',
        points: 70
      }
    ]
  },
  {
    id: 'renewable-energy',
    title: 'Renewable Energy',
    description: 'Clean energy sources and sustainable power generation',
    icon: '⚡',
    color: 'from-yellow-400 to-orange-500',
    estimatedTime: 4,
    badge: {
      id: 'energy-pioneer',
      name: 'Energy Pioneer',
      icon: '🔋',
      description: 'Leader in renewable energy adoption'
    },
    certificate: {
      id: 'renewable-energy-cert',
      name: 'Renewable Energy Specialist',
      description: 'Expert in clean energy technologies'
    },
    lessons: [
      {
        id: 're-types',
        title: 'Types of Renewable Energy',
        description: 'Overview of clean energy sources and technologies',
        content: `Renewable energy comes from natural sources that are constantly replenished.

Solar Energy:
• Photovoltaic (PV): Direct conversion to electricity
• Solar thermal: Heat for water and space heating
• Concentrated solar power: Large-scale electricity generation
• Advantages: Abundant, decreasing costs, scalable
• Challenges: Intermittency, storage, initial investment

Wind Energy:
• Onshore wind: Land-based turbines
• Offshore wind: Ocean-based installations
• Small wind: Residential and community scale
• Advantages: Mature technology, cost-competitive
• Challenges: Variable output, visual impact, bird safety

Hydroelectric Power:
• Large dams: Major electricity generation
• Small hydro: Low environmental impact
• Pumped storage: Energy storage solution
• Run-of-river: Minimal reservoir systems

Other Sources:
• Geothermal: Earth's internal heat
• Biomass: Organic materials for energy
• Ocean energy: Tidal and wave power`,
        duration: 40,
        type: 'content',
        points: 80,
        quiz: {
          id: 're-types-quiz',
          questions: [
            {
              id: 'q1',
              question: 'Which renewable energy source uses the Earth\'s internal heat?',
              type: 'multiple-choice',
              options: ['Solar', 'Wind', 'Geothermal', 'Hydroelectric'],
              correctAnswer: 'Geothermal',
              explanation: 'Geothermal energy harnesses heat from the Earth\'s core.',
              points: 10
            }
          ],
          passingScore: 70
        }
      }
    ]
  },
  {
    id: 'sustainability',
    title: 'Sustainability',
    description: 'Principles and practices of sustainable living and development',
    icon: '♻️',
    color: 'from-green-400 to-teal-500',
    estimatedTime: 4.5,
    badge: {
      id: 'sustainability-champion',
      name: 'Sustainability Champion',
      icon: '🏆',
      description: 'Leader in sustainable practices'
    },
    certificate: {
      id: 'sustainability-cert',
      name: 'Sustainability Practitioner',
      description: 'Certified in sustainable development principles'
    },
    lessons: [
      {
        id: 'sus-principles',
        title: 'Principles of Sustainability',
        description: 'The three pillars of sustainability and core concepts',
        content: `Sustainability is meeting present needs without compromising future generations' ability to meet their own needs.

Three Pillars of Sustainability:
• Environmental: Protecting natural resources and ecosystems
• Economic: Creating prosperity while using resources efficiently
• Social: Ensuring equity, health, and quality of life for all

Core Principles:
• Intergenerational equity: Fair treatment of future generations
• Precautionary principle: Avoiding harm when scientific evidence is uncertain
• Polluter pays: Those who cause pollution bear the costs
• Circular economy: Minimize waste, maximize resource efficiency

Sustainable Development Goals (SDGs):
• 17 global goals adopted by UN in 2015
• Targets for 2030: End poverty, protect planet, ensure prosperity
• Interconnected: Progress in one area affects others
• Universal: Apply to all countries, developed and developing`,
        duration: 35,
        type: 'intro',
        points: 60
      }
    ]
  }
];

export const getAllLessons = (): Lesson[] => {
  return modules.flatMap(module => module.lessons);
};

export const getLessonById = (lessonId: string): Lesson | undefined => {
  return getAllLessons().find(lesson => lesson.id === lessonId);
};

export const getModuleById = (moduleId: string): Module | undefined => {
  return modules.find(module => module.id === moduleId);
};

export const getModuleProgress = (moduleId: string, completedLessons: string[]): number => {
  const module = getModuleById(moduleId);
  if (!module) return 0;
  
  const completedInModule = module.lessons.filter(lesson => 
    completedLessons.includes(lesson.id)
  ).length;
  
  return Math.round((completedInModule / module.lessons.length) * 100);
};