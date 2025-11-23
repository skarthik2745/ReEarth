export interface EcoChallenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  proofType: 'photo' | 'video' | 'document' | 'multiple';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  timeframe: string;
  category: string;
  measurableOutcome: string;
}

export const ecoChallengesData: { [lessonId: string]: EcoChallenge[] } = {
  // Module 1: Sustainability
  'sus-1': [
    {
      id: 'sus-1-ch1',
      title: 'Sustainability Diary Challenge',
      description: 'Run a one-week "sustainability diary" and reduce at least 3 single-use items/day',
      instructions: [
        'Keep a daily diary for 7 days tracking single-use items',
        'Identify and eliminate 3 single-use items each day',
        'Replace with reusable alternatives',
        'Document progress with photos of diary entries',
        'Write 100-150 word reflection on experience and impact'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '1 week',
      category: 'lifestyle',
      measurableOutcome: '21 single-use items eliminated over 7 days'
    },
    {
      id: 'sus-1-ch2',
      title: 'School Workshop Leadership',
      description: 'Lead a 1-hour school workshop teaching 20 classmates sustainability basics',
      instructions: [
        'Prepare 1-hour presentation on sustainability basics',
        'Organize workshop for minimum 20 students',
        'Collect signatures from all attendees',
        'Take photos during the workshop',
        'Submit reflection on teaching experience and student engagement'
      ],
      proofType: 'multiple',
      difficulty: 'hard',
      points: 200,
      timeframe: '2 weeks',
      category: 'education',
      measurableOutcome: '20+ students educated on sustainability'
    }
  ],
  'sus-2': [
    {
      id: 'sus-2-ch1',
      title: 'School Sustainability Audit',
      description: 'Perform mini audit of school (people, planet, profit) and implement one change',
      instructions: [
        'Audit school facilities for sustainability issues',
        'Focus on people, planet, profit aspects',
        'Identify one implementable change (e.g., water tap repair)',
        'Document before/after photos',
        'Measure impact and write reflection on process'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 175,
      timeframe: '2 weeks',
      category: 'audit',
      measurableOutcome: 'One measurable improvement implemented'
    },
    {
      id: 'sus-2-ch2',
      title: 'Reusable Items Fundraiser',
      description: 'Organize fundraiser to buy reusable items and distribute to community',
      instructions: [
        'Plan and execute small fundraiser',
        'Purchase reusable items (steel tumblers, bags, etc.)',
        'Distribute to community members',
        'Document number of items distributed',
        'Report environmental impact and community response'
      ],
      proofType: 'multiple',
      difficulty: 'hard',
      points: 200,
      timeframe: '3 weeks',
      category: 'community',
      measurableOutcome: 'Number of reusable items distributed and plastic items replaced'
    }
  ],
  'sus-3': [
    {
      id: 'sus-3-ch1',
      title: 'Household Energy Reduction',
      description: 'Reduce household electricity by 10% for 7 days with meter readings',
      instructions: [
        'Record baseline electricity meter readings',
        'Implement energy-saving measures for 7 days',
        'Take daily meter readings or screenshots',
        'Calculate percentage reduction achieved',
        'Document specific actions taken and family involvement'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '1 week',
      category: 'energy',
      measurableOutcome: '10% electricity reduction measured'
    },
    {
      id: 'sus-3-ch2',
      title: 'Community Environmental Interview',
      description: 'Interview 5 community members about local environmental problems',
      instructions: [
        'Identify and interview 5 community members',
        'Ask about local environmental challenges',
        'Gather their suggested solutions',
        'Create short video presentation of findings',
        'Propose actionable solutions based on interviews'
      ],
      proofType: 'video',
      difficulty: 'medium',
      points: 175,
      timeframe: '2 weeks',
      category: 'research',
      measurableOutcome: '5 interviews completed with solution proposals'
    }
  ],
  'sus-4': [
    {
      id: 'sus-4-ch1',
      title: 'SDG Campaign Implementation',
      description: 'Adopt one SDG and run 2-week campaign targeting 50 people',
      instructions: [
        'Choose one Sustainable Development Goal',
        'Create campaign materials and tips',
        'Target 50 people over 2 weeks',
        'Track reach metrics (social media, flyers, conversations)',
        'Document engagement and feedback received'
      ],
      proofType: 'multiple',
      difficulty: 'hard',
      points: 200,
      timeframe: '2 weeks',
      category: 'advocacy',
      measurableOutcome: '50 people reached with SDG awareness'
    },
    {
      id: 'sus-4-ch2',
      title: 'SDG School Project',
      description: 'Implement small project supporting an SDG (e.g., herb garden)',
      instructions: [
        'Design project supporting chosen SDG',
        'Implement project (e.g., school herb garden)',
        'Document progress over 2 weeks',
        'Measure growth/impact with photos',
        'Report on project outcomes and community benefit'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 175,
      timeframe: '2 weeks',
      category: 'project',
      measurableOutcome: 'Measurable project impact documented'
    }
  ],
  'sus-5': [
    {
      id: 'sus-5-ch1',
      title: 'Plastic Replacement Challenge',
      description: 'Replace 5 single-use plastics with reusables for 2 weeks',
      instructions: [
        'Identify 5 single-use plastic items in daily routine',
        'Find reusable alternatives for each',
        'Use alternatives consistently for 2 weeks',
        'Document before/after photos of swaps',
        'Calculate plastic waste prevented'
      ],
      proofType: 'photo',
      difficulty: 'easy',
      points: 125,
      timeframe: '2 weeks',
      category: 'lifestyle',
      measurableOutcome: '5 plastic items permanently replaced'
    },
    {
      id: 'sus-5-ch2',
      title: 'Family Waste Sorting Program',
      description: 'Start family/community waste sorting routine for 7 days',
      instructions: [
        'Set up waste sorting system at home',
        'Train family members on proper sorting',
        'Log daily amounts diverted to recycling/compost',
        'Weigh and measure waste streams',
        'Report total waste diverted from landfill'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '1 week',
      category: 'waste',
      measurableOutcome: 'Weight/volume of waste diverted measured'
    }
  ],

  // Module 2: Renewable Energy
  're-1': [
    {
      id: 're-1-ch1',
      title: 'Household Energy Survey',
      description: 'Conduct energy survey and implement 3 savings measures',
      instructions: [
        'Survey household energy usage patterns',
        'Identify 3 potential energy savings measures',
        'Implement at least one measure',
        'Document energy savings achieved',
        'Present findings and recommendations'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '2 weeks',
      category: 'energy',
      measurableOutcome: 'Measurable energy savings documented'
    },
    {
      id: 're-1-ch2',
      title: 'Renewable Energy Education Day',
      description: 'Host renewable energy poster day educating 100 students',
      instructions: [
        'Create educational posters about renewable energy',
        'Organize display day at school',
        'Engage with at least 100 students',
        'Collect feedback from attendees',
        'Document reach and educational impact'
      ],
      proofType: 'multiple',
      difficulty: 'hard',
      points: 200,
      timeframe: '3 weeks',
      category: 'education',
      measurableOutcome: '100+ students educated on renewable energy'
    }
  ],
  're-2': [
    {
      id: 're-2-ch1',
      title: 'Solar Cooker/Charger Build',
      description: 'Build mini solar cooker or phone charger prototype',
      instructions: [
        'Research and design simple solar device',
        'Gather materials and build prototype',
        'Test device functionality',
        'Record video demonstration',
        'Document performance and improvements needed'
      ],
      proofType: 'video',
      difficulty: 'hard',
      points: 200,
      timeframe: '2 weeks',
      category: 'technology',
      measurableOutcome: 'Working solar device demonstrated'
    },
    {
      id: 're-2-ch2',
      title: 'Solar Panel Feasibility Study',
      description: 'Map roofs suitable for solar panels and create feasibility report',
      instructions: [
        'Survey school/neighborhood rooftops',
        'Measure available roof area',
        'Research solar panel specifications',
        'Calculate estimated kW potential',
        'Prepare feasibility report with recommendations'
      ],
      proofType: 'document',
      difficulty: 'medium',
      points: 175,
      timeframe: '2 weeks',
      category: 'research',
      measurableOutcome: 'Roof area surveyed and kW potential calculated'
    }
  ],

  // Continue for all 50 lessons...
  // Adding a few more examples for different modules

  // Module 4: Carbon & Climate
  'cc-1': [
    {
      id: 'cc-1-ch1',
      title: 'Household Carbon Audit',
      description: 'Conduct household carbon footprint audit and implement reduction action',
      instructions: [
        'Calculate household carbon footprint using online calculator',
        'Identify top 3 emission sources',
        'Implement one carbon-cutting action for 7 days',
        'Measure impact of reduction action',
        'Document before/after carbon calculations'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '1 week',
      category: 'carbon',
      measurableOutcome: 'Carbon footprint reduction measured'
    },
    {
      id: 'cc-1-ch2',
      title: 'Tree Planting for Carbon Offset',
      description: 'Plant native tree and calculate annual carbon absorption',
      instructions: [
        'Select appropriate native tree species',
        'Plant tree in suitable location',
        'Research tree\'s carbon absorption rate',
        'Calculate estimated annual CO2 absorption',
        'Create care plan and monitor initial growth'
      ],
      proofType: 'multiple',
      difficulty: 'easy',
      points: 125,
      timeframe: '1 week',
      category: 'carbon',
      measurableOutcome: 'Tree planted with calculated carbon benefit'
    }
  ],

  // Module 5: Pollution
  'pol-1': [
    {
      id: 'pol-1-ch1',
      title: 'Household Waste Composition Study',
      description: 'Conduct 3-day waste study and create reduction action plan',
      instructions: [
        'Sort and weigh household waste for 3 days',
        'Categorize waste types (recyclable, compostable, etc.)',
        'Identify sources of non-recyclable waste',
        'Create action plan to reduce non-recyclables by 30%',
        'Implement first action and measure results'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '1 week',
      category: 'waste',
      measurableOutcome: '30% reduction plan with initial implementation'
    },
    {
      id: 'pol-1-ch2',
      title: 'Neighborhood Plastic Reduction Pledge',
      description: 'Lead neighborhood pledge drive to reduce single-use plastics',
      instructions: [
        'Create pledge form for plastic reduction',
        'Go door-to-door in neighborhood',
        'Collect 50 signed pledges',
        'Follow up after 1 week to check compliance',
        'Document participation rate and impact'
      ],
      proofType: 'multiple',
      difficulty: 'hard',
      points: 200,
      timeframe: '2 weeks',
      category: 'community',
      measurableOutcome: '50 pledges collected with follow-up compliance'
    }
  ],

  // Module 6: Conservation
  'con-1': [
    {
      id: 'con-1-ch1',
      title: 'Community Tree Planting',
      description: 'Plant and tend 3 native saplings in community spaces',
      instructions: [
        'Identify suitable community planting locations',
        'Select 3 appropriate native tree species',
        'Plant saplings with proper technique',
        'Create care schedule and monitor for 30 days',
        'Document survival rate and growth progress'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 150,
      timeframe: '1 month',
      category: 'conservation',
      measurableOutcome: '3 trees planted with 30-day survival monitoring'
    },
    {
      id: 'con-1-ch2',
      title: 'Tree Protection Initiative',
      description: 'Run tree protection pledge and install sapling guards',
      instructions: [
        'Create tree protection awareness campaign',
        'Install protective guards around young trees',
        'Collect community pledges for tree protection',
        'Monitor and document reduction in tree damage',
        'Report on protection effectiveness'
      ],
      proofType: 'multiple',
      difficulty: 'medium',
      points: 175,
      timeframe: '3 weeks',
      category: 'conservation',
      measurableOutcome: 'Documented reduction in tree damage'
    }
  ],

  // Module 7: Green Technology
  'gt-1': [
    {
      id: 'gt-1-ch1',
      title: 'Green Tech Discovery',
      description: 'Identify 3 green technologies in your school/home and take photos',
      instructions: [
        'Survey your school and home for green technologies',
        'Identify at least 3 different green tech examples',
        'Take clear photos of each technology',
        'Research how each technology works',
        'Write brief description of each technology\'s environmental benefit'
      ],
      proofType: 'photo',
      difficulty: 'easy',
      points: 100,
      timeframe: '1 week',
      category: 'research',
      measurableOutcome: '3 green technologies documented with photos'
    },
    {
      id: 'gt-1-ch2',
      title: 'Community Green Tech Reflection',
      description: 'Write reflection on how one green technology can help your community',
      instructions: [
        'Choose one green technology from your research',
        'Analyze its potential impact on your community',
        'Write 150-word reflection on implementation benefits',
        'Include cost-benefit considerations',
        'Suggest practical steps for community adoption'
      ],
      proofType: 'document',
      difficulty: 'easy',
      points: 75,
      timeframe: '3 days',
      category: 'analysis',
      measurableOutcome: 'Detailed community impact analysis completed'
    }
  ],
  'gt-2': [
    {
      id: 'gt-2-ch1',
      title: 'Local Electricity Supply Research',
      description: 'Research how your local area supplies electricity and write summary',
      instructions: [
        'Research your local electricity generation sources',
        'Identify renewable vs non-renewable sources',
        'Write short summary of findings',
        'Include environmental impact assessment',
        'Suggest improvements for cleaner energy'
      ],
      proofType: 'document',
      difficulty: 'medium',
      points: 125,
      timeframe: '1 week',
      category: 'research',
      measurableOutcome: 'Complete local energy supply analysis'
    },
    {
      id: 'gt-2-ch2',
      title: 'Family Power Usage Tracking',
      description: 'Track family power usage for one day and suggest saving tip',
      instructions: [
        'Monitor household electricity usage for 24 hours',
        'Record peak usage times and devices',
        'Calculate daily consumption patterns',
        'Identify one practical energy-saving opportunity',
        'Implement suggestion and measure impact'
      ],
      proofType: 'multiple',
      difficulty: 'easy',
      points: 100,
      timeframe: '2 days',
      category: 'energy',
      measurableOutcome: 'Daily energy usage tracked with saving tip implemented'
    }
  ],

  // Module 8: Sustainable Lifestyles
  'sl-1': [
    {
      id: 'sl-1-ch1',
      title: 'Personal Sustainability Audit',
      description: 'Write down 3 things you already do that are sustainable',
      instructions: [
        'Reflect on your current daily habits',
        'Identify 3 sustainable practices you already follow',
        'Document each practice with photos if possible',
        'Explain why each practice is environmentally beneficial',
        'Calculate estimated environmental impact of each'
      ],
      proofType: 'multiple',
      difficulty: 'easy',
      points: 75,
      timeframe: '2 days',
      category: 'lifestyle',
      measurableOutcome: '3 sustainable practices documented and analyzed'
    },
    {
      id: 'sl-1-ch2',
      title: 'Sustainability Improvement Goal',
      description: 'Share one habit you want to improve for the environment',
      instructions: [
        'Identify one current habit that could be more sustainable',
        'Research better alternatives for this habit',
        'Create specific improvement plan with timeline',
        'Share your commitment publicly (social media/family)',
        'Begin implementation and document first steps'
      ],
      proofType: 'multiple',
      difficulty: 'easy',
      points: 100,
      timeframe: '1 week',
      category: 'lifestyle',
      measurableOutcome: 'Improvement plan created and implementation started'
    }
  ],
  'sl-2': [
    {
      id: 'sl-2-ch1',
      title: 'No Plastic Day Challenge',
      description: 'Try a "no plastic day" and take photos of alternatives used',
      instructions: [
        'Plan one full day without using any single-use plastics',
        'Prepare reusable alternatives in advance',
        'Document all plastic alternatives used throughout the day',
        'Take photos of each alternative in action',
        'Reflect on challenges and successes of the experience'
      ],
      proofType: 'photo',
      difficulty: 'medium',
      points: 125,
      timeframe: '1 day',
      category: 'lifestyle',
      measurableOutcome: 'Complete plastic-free day documented with alternatives'
    },
    {
      id: 'sl-2-ch2',
      title: 'Waste Item Upcycling',
      description: 'Collect and repurpose one waste item (bottle, box, bag)',
      instructions: [
        'Find one waste item that would normally be discarded',
        'Research creative repurposing ideas for the item',
        'Transform the item into something useful or decorative',
        'Document the before and after transformation',
        'Use the repurposed item for at least one week'
      ],
      proofType: 'photo',
      difficulty: 'easy',
      points: 100,
      timeframe: '1 week',
      category: 'waste',
      measurableOutcome: 'One waste item successfully repurposed and used'
    }
  ]
};

export const getChallengesForLesson = (lessonId: string): EcoChallenge[] => {
  return ecoChallengesData[lessonId] || [];
};