import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Gamepad2, Play, Pause, RotateCcw, Trophy, Check, Droplets, Home } from 'lucide-react';

interface TrashItem {
  id: number;
  type: string;
  x: number;
  y: number;
  speed: number;
  emoji: string;
}

interface RainDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
}

interface Cloud {
  id: number;
  x: number;
  y: number;
  speed: number;
}



export default function EcoGames() {
  const { user } = useAuth();
  // const { updatePoints } = useGame(); // Commented out since GameContext is removed
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentGame, setCurrentGame] = useState<'menu' | 'trash-sorter' | 'rainwater-hero' | 'jumble-quest' | 'word-builder'>('menu');
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'ended'>('menu');
  const [selectedCategory, setSelectedCategory] = useState<string>('organic');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [playerX, setPlayerX] = useState(400);
  const [trashItems, setTrashItems] = useState<TrashItem[]>([]);
  const [gameSpeed, setGameSpeed] = useState(1);
  const [showCategorySelect, setShowCategorySelect] = useState(false);

  // Rain Collection Game State
  const [rainDrops, setRainDrops] = useState<RainDrop[]>([]);
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [bucketX, setBucketX] = useState(400);
  const [missed, setMissed] = useState(0);
  const [theme, setTheme] = useState<'sunny' | 'cloudy' | 'evening' | 'night'>('sunny');
  const [rainMode, setRainMode] = useState<'mild' | 'normal' | 'heavy'>('normal');
  const [showLightning, setShowLightning] = useState(false);
  
  const themes = {
    sunny: { bg: 'from-blue-300 to-blue-100', sky: '#87CEEB' },
    cloudy: { bg: 'from-gray-400 to-gray-200', sky: '#B0C4DE' },
    evening: { bg: 'from-orange-400 to-orange-200', sky: '#FFB347' },
    night: { bg: 'from-blue-900 to-blue-700', sky: '#191970' }
  };
  
  const rainSpeeds = {
    mild: { spawn: 1800, speed: 2 },
    normal: { spawn: 800, speed: 3 },
    heavy: { spawn: 300, speed: 5 }
  };

  const [gameTime, setGameTime] = useState(90);

  // Word Games State
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [wordMeaning, setWordMeaning] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wordScore, setWordScore] = useState(0);
  const [wordLevel, setWordLevel] = useState(1);
  const [missingLetters, setMissingLetters] = useState<{word: string, display: string}>({word: '', display: ''});

  const ecoWords = [
    { word: 'CLIMATE', meaning: 'Long-term weather pattern of a region.' },
    { word: 'RECYCLE', meaning: 'Turning waste into reusable material.' },
    { word: 'ECOSYSTEM', meaning: 'Living things interacting with their environment.' },
    { word: 'BIODIVERSITY', meaning: 'Variety of plant and animal life.' },
    { word: 'POLLUTION', meaning: 'Harmful substances released into nature.' },
    { word: 'CONSERVE', meaning: 'Protect and save resources.' },
    { word: 'HABITAT', meaning: 'Natural home of an animal or plant.' },
    { word: 'RENEWABLE', meaning: 'A resource that can be naturally replaced.' },
    { word: 'ORGANIC', meaning: 'Food grown without chemicals.' },
    { word: 'COMPOST', meaning: 'Natural fertilizer from decomposed waste.' },
    { word: 'SUSTAINABLE', meaning: 'Using resources responsibly for the future.' },
    { word: 'GREENHOUSE', meaning: 'A structure that traps heat; also heat-trapping gases.' },
    { word: 'DEFORESTATION', meaning: 'Cutting down forests.' },
    { word: 'EMISSION', meaning: 'Release of gas or pollution into the air.' },
    { word: 'CARBON', meaning: 'Element found in fuels and greenhouse gases.' },
    { word: 'OXYGEN', meaning: 'Gas essential for breathing.' },
    { word: 'NATURE', meaning: 'The natural world: plants, animals, land, water.' },
    { word: 'WILDLIFE', meaning: 'Animals living freely in nature.' },
    { word: 'EARTHQUAKE', meaning: 'Shaking of Earth surface.' },
    { word: 'WETLANDS', meaning: 'Land areas covered by water, rich in life.' },
    { word: 'SOLAR', meaning: 'Energy from the sun.' },
    { word: 'WINDMILL', meaning: 'Machine that creates energy using wind.' },
    { word: 'GLACIERS', meaning: 'Large moving masses of ice.' },
    { word: 'PURIFY', meaning: 'Remove impurities to make clean.' },
    { word: 'ATMOSPHERE', meaning: 'The layer of gases surrounding Earth.' },
    { word: 'HYDRATION', meaning: 'Supplying water to living things.' },
    { word: 'CLIMATE-ACTION', meaning: 'Steps taken to fight climate change.' },
    { word: 'REFORESTATION', meaning: 'Planting trees in deforested areas.' },
    { word: 'AFFORESTATION', meaning: 'Growing forests in new areas.' },
    { word: 'SUSTAINABILITY', meaning: 'Protecting nature while meeting human needs.' },
    { word: 'CONSERVATION', meaning: 'Saving and protecting natural resources.' },
    { word: 'FOSSIL-FUELS', meaning: 'Coal, oil, gas formed from ancient remains.' },
    { word: 'RENEWABLE-ENERGY', meaning: 'Energy sources that do not run out.' },
    { word: 'NON-RENEWABLE', meaning: 'Resources that cannot be replaced quickly.' },
    { word: 'BIODEGRADABLE', meaning: 'Can break down naturally.' },
    { word: 'COMPOSTABLE', meaning: 'Can break down into natural fertilizer.' },
    { word: 'ECO-FRIENDLY', meaning: 'Not harmful to the environment.' },
    { word: 'SUSTAINABILITY-GOALS', meaning: 'Targets to protect the planet.' },
    { word: 'CLIMATE-CRISIS', meaning: 'Extreme climate emergency.' },
    { word: 'MELTING', meaning: 'Ice turning into water due to heat.' },
    { word: 'RECYCLING-BIN', meaning: 'Container for recyclable waste.' },
    { word: 'GREEN-ENERGY', meaning: 'Clean and non-polluting energy.' },
    { word: 'WATER-SCARCITY', meaning: 'Not enough clean water available.' },
    { word: 'AIR-QUALITY', meaning: 'How clean or polluted the air is.' },
    { word: 'ZERO-WASTE', meaning: 'Using resources without creating waste.' },
    { word: 'UPCYCLE', meaning: 'Convert waste into a better new product.' },
    { word: 'CARBON-FOOTPRINT', meaning: 'Total greenhouse gases a person releases.' },
    { word: 'EARTH-DAY', meaning: 'Global day dedicated to environmental protection.' },
    { word: 'WILDLIFE-PROTECTION', meaning: 'Saving animals and their habitats.' },
    { word: 'OVERFISHING', meaning: 'Catching too many fish from oceans.' },
    { word: 'MARINE-LIFE', meaning: 'Plants and animals living in oceans.' },
    { word: 'CORAL-REEF', meaning: 'Underwater structures made by corals.' },
    { word: 'OZONE-LAYER', meaning: 'Atmosphere layer that protects from UV rays.' },
    { word: 'UV-RADIATION', meaning: 'Harmful rays from the sun.' },
    { word: 'GREEN-REVOLUTION', meaning: 'Increase in farming using modern methods.' },
    { word: 'AGRI-WASTE', meaning: 'Waste produced from agriculture.' },
    { word: 'BIOGAS', meaning: 'Gas produced from organic waste.' },
    { word: 'RAINWATER-HARVESTING', meaning: 'Collecting and storing rainwater.' },
    { word: 'GROUNDWATER', meaning: 'Water stored under Earth surface.' },
    { word: 'OVERCONSUMPTION', meaning: 'Using too many resources.' },
    { word: 'DROUGHT', meaning: 'Long period with no rain.' },
    { word: 'FLOOD', meaning: 'Overflow of water on land.' },
    { word: 'CYCLONE', meaning: 'Strong, rotating storm.' },
    { word: 'EROSION', meaning: 'Wearing away of land by wind or water.' },
    { word: 'PLANTATION', meaning: 'Large area of planted trees or crops.' },
    { word: 'EARTH-RESOURCES', meaning: 'Natural materials like water, soil, minerals.' },
    { word: 'WILDLIFE-SANCTUARY', meaning: 'Protected area for animals.' },
    { word: 'NATIONAL-PARK', meaning: 'Reserved natural area protected by government.' },
    { word: 'ORGANIC-FARMING', meaning: 'Farming without chemical pesticides.' },
    { word: 'FERTILITY', meaning: 'Ability of soil to support plant growth.' },
    { word: 'OXYGEN-CYCLE', meaning: 'Process of oxygen moving through Earth.' },
    { word: 'WATER-CYCLE', meaning: 'Natural movement of water on Earth.' },
    { word: 'CARBON-CYCLE', meaning: 'Circulation of carbon through nature.' },
    { word: 'FOSSILIZATION', meaning: 'Process of forming fossils.' },
    { word: 'MICROPLASTICS', meaning: 'Tiny pieces of plastic harmful to life.' },
    { word: 'LANDFILL', meaning: 'Area where waste is buried.' },
    { word: 'WASTE-SEGREGATION', meaning: 'Separating waste into categories.' },
    { word: 'ECOTOURISM', meaning: 'Responsible travel to natural places.' },
    { word: 'SUSTAINABLE-LIVING', meaning: 'Lifestyle with minimal environmental impact.' },
    { word: 'NATURAL-RESOURCES', meaning: 'Water, wood, minerals, soil.' },
    { word: 'WIND-ENERGY', meaning: 'Energy from moving air.' },
    { word: 'SOLAR-PANEL', meaning: 'Device that converts sunlight to electricity.' },
    { word: 'CARBON-NEUTRAL', meaning: 'Not increasing carbon emissions.' },
    { word: 'PLASTIC-BAN', meaning: 'Restriction on using plastic products.' },
    { word: 'ECO-SYSTEM-BALANCE', meaning: 'When all living things live in harmony.' },
    { word: 'EARTH-PROTECTION', meaning: 'Actions taken to save our planet.' },
    { word: 'WILDLIFE-EXTINCTION', meaning: 'Species dying out completely.' },
    { word: 'GREEN-FUTURE', meaning: 'A world with clean and safe environment.' },
    { word: 'SOIL-POLLUTION', meaning: 'Harmful chemicals entering soil.' },
    { word: 'WATER-POLLUTION', meaning: 'Harmful substances in water.' },
    { word: 'AIR-POLLUTION', meaning: 'Contamination of air with harmful gases.' },
    { word: 'CONTAMINATION', meaning: 'Making something dirty or unsafe.' },
    { word: 'SUSTAINABLE-TECH', meaning: 'Technology that reduces environmental impact.' },
    { word: 'ECO-EDUCATION', meaning: 'Learning about protecting nature.' },
    { word: 'NATURE-CARE', meaning: 'Activities that support environment.' },
    { word: 'ECO-WARRIOR', meaning: 'A person who fights for the environment.' },
    { word: 'CLEAN-ENERGY', meaning: 'Energy that does not pollute.' },
    { word: 'MARINE-POLLUTION', meaning: 'Pollution that harms oceans and sea life.' },
    { word: 'WILDLIFE-HABITATS', meaning: 'Natural places where animals live.' },
    { word: 'GLOBAL-WARMING', meaning: 'Increase in Earth temperature due to pollution.' }
  ];


  const categories = {
    organic: { name: 'Organic Waste', emoji: '🍎', color: '#22c55e' },
    recyclable: { name: 'Recyclable Waste', emoji: '♻️', color: '#3b82f6' },
    ewaste: { name: 'Electronic Waste', emoji: '📱', color: '#f59e0b' },
    hazardous: { name: 'Hazardous Waste', emoji: '☢️', color: '#ef4444' },
    paper: { name: 'Paper Waste', emoji: '📄', color: '#8b5cf6' }
  };

  const trashTypes = {
    organic: ['🍎', '🍌', '🥕', '🍃', '🌽'],
    recyclable: ['🥤', '🍶', '📦', '🥫', '♻️'],
    ewaste: ['📱', '💻', '🔋', '💡', '📺'],
    hazardous: ['☢️', '🧪', '⚗️', '🔋', '💊'],
    paper: ['📄', '📰', '📚', '📋', '🗞️']
  };

  const allTrashEmojis = Object.values(trashTypes).flat();

  useEffect(() => {
    let gameLoop: number;
    let spawnTimer: number;
    let timer: number;

    if (gameState === 'playing' && currentGame === 'trash-sorter') {
      // Trash Sorter game loop
      gameLoop = setInterval(() => {
        updateGame();
      }, 50);

      spawnTimer = setInterval(() => {
        spawnTrashItem();
      }, 1500);

      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        clearInterval(gameLoop);
        clearInterval(spawnTimer);
        clearInterval(timer);
      };
    }
  }, [gameState, currentGame]);

  const spawnTrashItem = () => {
    const newItem: TrashItem = {
      id: Date.now() + Math.random(),
      type: Math.random() < 0.3 ? selectedCategory : Object.keys(trashTypes)[Math.floor(Math.random() * 5)],
      x: Math.random() * 750,
      y: -50,
      speed: 2 + Math.random() * 3 * gameSpeed,
      emoji: ''
    };
    
    newItem.emoji = trashTypes[newItem.type as keyof typeof trashTypes][
      Math.floor(Math.random() * trashTypes[newItem.type as keyof typeof trashTypes].length)
    ];

    setTrashItems(prev => [...prev, newItem]);
  };

  const updateGame = () => {
    setTrashItems(prev => {
      const updated = prev.map(item => ({
        ...item,
        y: item.y + item.speed
      })).filter(item => {
        // Remove items that fell off screen
        if (item.y > 600) {
          // Penalty for missing correct category items
          if (item.type === selectedCategory) {
            setScore(s => s - 20);
          }
          return false;
        }
        return true;
      });

      return updated;
    });

    // Increase game speed over time
    setGameSpeed(prev => Math.min(prev + 0.001, 3));

    // Check for game over
    if (score < -50) {
      endGame();
    }
  };



  const checkCollisions = () => {
    setTrashItems(prev => {
      let scoreChange = 0;
      const filtered = prev.filter(item => {
        // Check if item is near player bin (increased collision area)
        if (item.y > 480 && item.y < 580 && 
            item.x > playerX - 60 && item.x < playerX + 60) {
          
          if (item.type === selectedCategory) {
            scoreChange += 50;
          } else {
            scoreChange -= 30;
          }
          return false; // Remove collected item
        }
        return true;
      });
      
      if (scoreChange !== 0) {
        setScore(s => s + scoreChange);
      }
      
      return filtered;
    });
  };

  const checkRainCollisions = () => {
    setRainDrops(prev => {
      let scoreChange = 0;
      const filtered = prev.filter(drop => {
        // Check if drop is near bucket (larger collision area)
        if (drop.y > 480 && drop.y < 580 && 
            drop.x > bucketX - 80 && drop.x < bucketX + 80) {
          scoreChange += 10;
          return false; // Remove collected drop
        }
        return true;
      });
      
      if (scoreChange !== 0) {
        setScore(s => s + scoreChange);
      }
      
      return filtered;
    });
  };

  useEffect(() => {
    if (currentGame === 'trash-sorter') {
      checkCollisions();
    } else if (currentGame === 'rainwater-hero') {
      checkRainCollisions();
    }
  }, [trashItems, playerX, rainDrops, bucketX, currentGame]);



  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, selectedCategory, currentGame]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(90);
    setPlayerX(400);
    setTrashItems([]);
    setGameSpeed(1);
  };

  const endGame = () => {
    setGameState('ended');
    // Points update removed since GameContext is disabled
  };

  const resetGame = () => {
    setGameState('menu');
    setScore(0);
    setTimeLeft(90);
    setTrashItems([]);
  };

  const selectCategoryAndResume = (category: string) => {
    setSelectedCategory(category);
    setShowCategorySelect(false);
    setGameState('playing');
  };



  // Rainwater Hero Game Functions
  const startRainCollectionGame = () => {
    setCurrentGame('rainwater-hero');
    setGameState('playing');
    setScore(0);
    setTimeLeft(120); // 2 minutes
    setRainDrops([]);
    setBucketX(400);
    setMissed(0);
    setShowLightning(false);
    // Initialize fixed clouds
    setClouds([
      { id: 1, x: 100, y: 40, speed: 0 },
      { id: 2, x: 250, y: 70, speed: 0 },
      { id: 3, x: 400, y: 50, speed: 0 },
      { id: 4, x: 550, y: 80, speed: 0 },
      { id: 6, x: 150, y: 90, speed: 0 }
    ]);
  };

  const spawnRainDrop = () => {
    const newDrop: RainDrop = {
      id: Date.now() + Math.random(),
      x: Math.random() * 750 + 25, // Keep drops within screen (25-775px)
      y: 0,
      speed: rainSpeeds[rainMode].speed
    };
    setRainDrops(prev => [...prev, newDrop]);
  };

  const updateRainCollectionGame = () => {
    // Update raindrops
    setRainDrops(prev => {
      return prev.map(drop => ({
        ...drop,
        y: drop.y + drop.speed
      })).filter(drop => {
        // Check if hit ground first
        if (drop.y > 580) {
          setMissed(prev => prev + 1);
          // No negative points - just count as missed
          return false;
        }
        return true;
      });
    });
    
    // Clouds are now static - no update needed
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameState !== 'playing') return;
    
    if (currentGame === 'trash-sorter') {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setPlayerX(prev => Math.max(0, prev - 20));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setPlayerX(prev => Math.min(750, prev + 20));
          break;
        case 'w':
        case 'W':
          setGameState('paused');
          setShowCategorySelect(true);
          break;
      }
    } else if (currentGame === 'rainwater-hero') {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          setBucketX(prev => Math.max(50, prev - 15));
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          setBucketX(prev => Math.min(750, prev + 15));
          break;
        case '1':
          setTheme('sunny');
          break;
        case '2':
          setTheme('cloudy');
          break;
        case '3':
          setTheme('evening');
          break;
        case '4':
          setTheme('night');
          break;
        case 'q':
        case 'Q':
          setRainMode('mild');
          break;
        case 'w':
        case 'W':
          setRainMode('normal');
          break;
        case 'e':
        case 'E':
          setRainMode('heavy');
          break;
      }
    }
  };

  const getStarRating = (finalScore: number) => {
    if (finalScore >= 500) return 3;
    if (finalScore >= 250) return 2;
    if (finalScore >= 100) return 1;
    return 0;
  };

  // Rain Collection Game useEffect
  useEffect(() => {
    let gameLoop: number;
    let rainTimer: number;
    let timer: number;
    let lightningTimer: number;

    if (gameState === 'playing' && currentGame === 'rainwater-hero') {
      gameLoop = setInterval(() => {
        updateRainCollectionGame();
      }, 50);

      rainTimer = setInterval(() => {
        spawnRainDrop();
      }, rainSpeeds[rainMode].spawn);

      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Lightning effect
      lightningTimer = setInterval(() => {
        if (Math.random() < 0.3) { // 30% chance
          setShowLightning(true);
          setTimeout(() => setShowLightning(false), 150);
        }
      }, 1000);

      return () => {
        clearInterval(gameLoop);
        clearInterval(rainTimer);
        clearInterval(timer);
        clearInterval(lightningTimer);
      };
    }
  }, [gameState, currentGame, rainMode]);
  


  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ECO GAMES</h1>
        <p className="arcade-text arcade-text-yellow">LEARN THROUGH PLAY</p>
      </div>

      {/* Game Selection Menu */}
      {currentGame === 'menu' && (
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Trash Sorter Game */}
            <div className="arcade-dialog p-6 text-center">
              <Gamepad2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="arcade-h2 mb-4">TRASH SORTER</h2>
              <p className="arcade-text arcade-text-cyan text-sm mb-4">
                Sort waste into correct categories. Move with arrow keys and collect the right items!
              </p>
              <div className="arcade-card p-3 mb-4">
                <div className="arcade-text arcade-text-green text-xs mb-2">RULES & SCORING:</div>
                <div className="arcade-text text-xs text-left">
                  • Correct catch: +50 points<br/>
                  • Wrong catch: -30 points<br/>
                  • Miss correct item: -20 points<br/>
                  • Game ends at -50 points<br/>
                  • Duration: 90 seconds
                </div>
              </div>
              <button 
                onClick={() => setCurrentGame('trash-sorter')} 
                className="arcade-btn arcade-btn-primary px-6"
              >
                <Play className="w-4 h-4 inline mr-2" />PLAY NOW
              </button>
            </div>

            {/* Rain Collection Game */}
            <div className="arcade-dialog p-6 text-center">
              <Droplets className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="arcade-h2 mb-4">RAIN COLLECTION</h2>
              <p className="arcade-text arcade-text-cyan text-sm mb-4">
                Move your bucket to collect falling raindrops! Change themes and rain intensity during play!
              </p>
              <div className="arcade-card p-3 mb-4">
                <div className="arcade-text arcade-text-green text-xs mb-2">RULES & SCORING:</div>
                <div className="arcade-text text-xs text-left">
                  • Collect raindrop: +10 points<br/>
                  • Miss raindrop: 0 points (no penalty)<br/>
                  • Controls: Arrow keys or A/D<br/>
                  • Themes: 1-4 keys<br/>
                  • Rain modes: Q/W/E keys<br/>
                  • Duration: 2 minutes
                </div>
              </div>
              <button 
                onClick={startRainCollectionGame} 
                className="arcade-btn arcade-btn-primary px-6"
              >
                <Play className="w-4 h-4 inline mr-2" />PLAY NOW
              </button>
            </div>

            {/* Eco Jumble Quest */}
            <div className="arcade-dialog p-6 text-center">
              <div className="text-6xl mb-4">🔤</div>
              <h2 className="arcade-h2 mb-4">ECO JUMBLE QUEST</h2>
              <p className="arcade-text arcade-text-cyan text-sm mb-4">
                In this game, the letters of a sustainability-related word will appear in jumbled order. Your task is to rearrange the letters and type the correct word.
              </p>
              <div className="arcade-card p-3 mb-4">
                <div className="arcade-text arcade-text-green text-xs mb-2">HOW TO PLAY:</div>
                <div className="arcade-text text-xs text-left">
                  • Unscramble eco-friendly words<br/>
                  • Type your answer<br/>
                  • Learn word meanings<br/>
                  • Score points for correct answers
                </div>
              </div>
              <button 
                onClick={() => setCurrentGame('jumble-quest')} 
                className="arcade-btn arcade-btn-primary px-6"
              >
                <Play className="w-4 h-4 inline mr-2" />PLAY NOW
              </button>
            </div>

            {/* Green Word Builder */}
            <div className="arcade-dialog p-6 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h2 className="arcade-h2 mb-4">GREEN WORD BUILDER</h2>
              <p className="arcade-text arcade-text-cyan text-sm mb-4">
                In this game, you will see a sustainability word with some missing letters. You must fill the blanks and type the full correct word.
              </p>
              <div className="arcade-card p-3 mb-4">
                <div className="arcade-text arcade-text-green text-xs mb-2">HOW TO PLAY:</div>
                <div className="arcade-text text-xs text-left">
                  • Fill in missing letters<br/>
                  • Complete eco-friendly words<br/>
                  • Learn word meanings<br/>
                  • Score points for correct answers
                </div>
              </div>
              <button 
                onClick={() => setCurrentGame('word-builder')} 
                className="arcade-btn arcade-btn-primary px-6"
              >
                <Play className="w-4 h-4 inline mr-2" />PLAY NOW
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rain Collection Game */}
      {currentGame === 'rainwater-hero' && (
        <div>
          {(gameState === 'playing' || gameState === 'paused') && (
            <div className="flex gap-4">
              {/* Game Area */}
              <div className="flex-1">
                <div 
                  className={`relative bg-gradient-to-b ${themes[theme].bg} border-4 border-white ${showLightning ? 'bg-white' : ''}`}
                  style={{ width: '800px', height: '600px', margin: '0 auto' }}
                >
                  {/* Lightning Flash */}
                  {showLightning && (
                    <div className="absolute inset-0 bg-white opacity-80 animate-pulse"></div>
                  )}
                  {/* Sky Elements */}
                  {/* Sun */}
                  {(theme === 'sunny' || theme === 'evening') && (
                    <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-600"></div>
                  )}
                  
                  {/* Moon */}
                  {theme === 'night' && (
                    <div className="absolute top-10 right-10 w-16 h-16 bg-gray-200 rounded-full border-4 border-gray-400"></div>
                  )}
                  
                  {/* Clouds */}
                  {clouds.map(cloud => (
                    <div
                      key={cloud.id}
                      className="absolute text-5xl opacity-80"
                      style={{
                        left: `${cloud.x}px`,
                        top: `${cloud.y}px`
                      }}
                    >
                      ☁️
                    </div>
                  ))}

                  {/* Rain Drops */}
                  {rainDrops.map(drop => (
                    <div
                      key={drop.id}
                      className="absolute text-2xl text-blue-500"
                      style={{
                        left: `${drop.x}px`,
                        top: `${drop.y}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      💧
                    </div>
                  ))}

                  {/* Bucket - Larger */}
                  <div
                    className="absolute bottom-4 text-8xl transition-all duration-100"
                    style={{
                      left: `${bucketX}px`,
                      transform: 'translateX(-50%)'
                    }}
                  >
                    🪣
                  </div>

                  {/* Game Stats */}
                  <div className="absolute top-4 left-4 arcade-card p-3">
                    <div className="arcade-text arcade-text-yellow text-sm">SCORE: {score}</div>
                    <div className="arcade-text arcade-text-red text-sm">MISSED: {missed}</div>
                    <div className="arcade-text arcade-text-cyan text-sm">RAIN: {rainMode.toUpperCase()}</div>
                    <div className="arcade-text arcade-text-green text-sm">THEME: {theme.toUpperCase()}</div>
                    <div className="arcade-text arcade-text-purple text-sm">TIME: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <button 
                    onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')} 
                    className="arcade-btn arcade-btn-secondary mr-2"
                  >
                    {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => { setCurrentGame('menu'); setGameState('menu'); }} className="arcade-btn arcade-btn-red">
                    <Home className="w-4 h-4 inline mr-1" />QUIT
                  </button>
                </div>
                
                {/* Pause Overlay */}
                {gameState === 'paused' && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="arcade-dialog p-6 text-center">
                      <h3 className="arcade-h3 mb-4">GAME PAUSED</h3>
                      <button 
                        onClick={() => setGameState('playing')} 
                        className="arcade-btn arcade-btn-primary"
                      >
                        <Play className="w-4 h-4 inline mr-2" />RESUME
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls Panel */}
              <div className="w-64 arcade-dialog p-4">
                <h3 className="arcade-h3 mb-4 text-center">CONTROLS</h3>
                
                <div className="mb-4">
                  <div className="arcade-text arcade-text-cyan text-xs mb-2">MOVEMENT</div>
                  <div className="arcade-text text-xs">← → or A/D: Move bucket</div>
                </div>
                
                <div className="mb-4">
                  <div className="arcade-text arcade-text-cyan text-xs mb-2">THEMES (1-4)</div>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(themes).map(([key, _], i) => (
                      <button
                        key={key}
                        onClick={() => setTheme(key as any)}
                        className={`arcade-card p-1 text-xs ${
                          theme === key ? 'arcade-card-yellow' : ''
                        }`}
                      >
                        {i + 1}. {key.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="arcade-text arcade-text-cyan text-xs mb-2">RAIN MODE (Q/W/E)</div>
                  <div className="space-y-1">
                    {['mild', 'normal', 'heavy'].map((mode, i) => (
                      <button
                        key={mode}
                        onClick={() => setRainMode(mode as any)}
                        className={`w-full arcade-card p-1 text-xs ${
                          rainMode === mode ? 'arcade-card-yellow' : ''
                        }`}
                      >
                        {['Q', 'W', 'E'][i]}. {mode.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Game Over Screen */}
          {gameState === 'ended' && (
            <div className="max-w-2xl mx-auto arcade-dialog p-8 text-center">
              <Droplets className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="arcade-h2 mb-4">RAIN COLLECTION COMPLETE!</h2>
              
              <div className="arcade-card p-6 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="arcade-text arcade-text-cyan">FINAL SCORE</div>
                    <div className="arcade-h2 arcade-text-yellow">{score}</div>
                  </div>
                  <div>
                    <div className="arcade-text arcade-text-cyan">DROPS MISSED</div>
                    <div className="arcade-h2 arcade-text-red">{missed}</div>
                  </div>
                  <div>
                    <div className="arcade-text arcade-text-cyan">DROPS COLLECTED</div>
                    <div className="arcade-text arcade-text-green text-lg">{Math.max(0, score / 10)}</div>
                  </div>
                  <div>
                    <div className="arcade-text arcade-text-cyan">ACCURACY</div>
                    <div className="arcade-text arcade-text-blue text-lg">
                      {score > 0 ? ((score / 10) / ((score / 10) + missed) * 100).toFixed(1) : 0}%
                    </div>
                  </div>
                </div>
                

              </div>

              <div className="flex space-x-4 justify-center">
                <button onClick={startRainCollectionGame} className="arcade-btn arcade-btn-primary">
                  <Play className="w-4 h-4 inline mr-2" />PLAY AGAIN
                </button>
                <button onClick={() => { setCurrentGame('menu'); setGameState('menu'); }} className="arcade-btn arcade-btn-secondary">
                  BACK TO MENU
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Trash Sorter Game Content */}
      {currentGame === 'trash-sorter' && (
        <div>
          {gameState === 'menu' && (
        <div className="max-w-2xl mx-auto">
          <div className="arcade-dialog p-8 text-center mb-6">
            <Gamepad2 className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="arcade-h2 mb-4">TRASH SORTER</h2>
            <p className="arcade-text arcade-text-cyan text-sm mb-6">
              Collect the right type of waste! Use arrow keys or A/D to move. Press SPACE to change category.
            </p>

            <div className="mb-6">
              <h3 className="arcade-h3 mb-4">SELECT WASTE CATEGORY</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(categories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`arcade-card p-4 ${
                      selectedCategory === key ? 'arcade-card-yellow' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex space-x-1">
                        {trashTypes[key as keyof typeof trashTypes].map((emoji, i) => (
                          <span key={i} className="text-lg">{emoji}</span>
                        ))}
                      </div>
                      {selectedCategory === key && (
                        <Check className="w-5 h-5 text-yellow-400" />
                      )}
                    </div>
                    <div className="arcade-text text-xs">{cat.name.toUpperCase()}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startGame} className="arcade-btn arcade-btn-primary px-8">
              <Play className="w-4 h-4 inline mr-2" />START GAME
            </button>
          </div>

          {/* Rules */}
          <div className="arcade-dialog p-6">
            <h3 className="arcade-h3 mb-4">GAME RULES</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <div className="arcade-text arcade-text-green mb-2">SCORING:</div>
                <div className="arcade-text arcade-text-cyan">• Correct catch: +50 points</div>
                <div className="arcade-text arcade-text-red">• Wrong catch: -30 points</div>
                <div className="arcade-text arcade-text-yellow">• Miss correct: -20 points</div>
              </div>
              <div>
                <div className="arcade-text arcade-text-green mb-2">CONTROLS:</div>
                <div className="arcade-text arcade-text-cyan">• Arrow Keys / A,D: Move</div>
                <div className="arcade-text arcade-text-cyan">• SPACE: Change category</div>
                <div className="arcade-text arcade-text-yellow">• Game ends at -50 points</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Playing */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-4">
            {/* Game Canvas */}
            <div className="flex-1 arcade-dialog p-4">
            <div 
              className="relative bg-gradient-to-b from-blue-200 to-green-200 border-4 border-white"
              style={{ width: '800px', height: '600px', margin: '0 auto' }}
            >
              {/* Trash Items */}
              {trashItems.map(item => (
                <div
                  key={item.id}
                  className="absolute text-3xl"
                  style={{
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {item.emoji}
                </div>
              ))}

              {/* Player Bin - Larger */}
              <div
                className="absolute bottom-4 text-6xl transition-all duration-100"
                style={{
                  left: `${playerX}px`,
                  transform: 'translateX(-50%)'
                }}
              >
                🗑️
              </div>

              {/* Current Category Indicator */}
              <div className="absolute top-4 left-4 arcade-card p-2">
                <div className="arcade-text arcade-text-cyan text-xs">COLLECTING:</div>
                <div className="text-2xl">{categories[selectedCategory as keyof typeof categories].emoji}</div>
                <div className="arcade-text text-xs">{categories[selectedCategory as keyof typeof categories].name.toUpperCase()}</div>
              </div>

              {/* Controls Help */}
              <div className="absolute top-4 right-4 arcade-card p-2">
                <div className="arcade-text arcade-text-yellow text-xs">CONTROLS:</div>
                <div className="arcade-text text-xs">← → or A/D: Move</div>
                <div className="arcade-text text-xs">SPACE: Change type</div>
              </div>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setGameState(gameState === 'playing' ? 'paused' : 'playing')}
                className="arcade-btn arcade-btn-secondary mr-2"
              >
                {gameState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={resetGame} className="arcade-btn arcade-btn-red">
                <RotateCcw className="w-4 h-4 inline mr-1" />QUIT
              </button>
            </div>
            </div>

            {/* Game Stats - Right Side */}
            <div className="w-64 arcade-dialog p-4">
              <div className="arcade-h2 arcade-text-yellow mb-4 text-center">SCORE</div>
              <div className="arcade-h1 arcade-text-cyan text-center mb-6">{score}</div>
              
              <div className="space-y-4">
                <div className="arcade-card p-3 text-center">
                  <div className="arcade-text arcade-text-cyan text-xs">TIME LEFT</div>
                  <div className="arcade-h3 arcade-text-green">{timeLeft}s</div>
                </div>
                
                <div className="arcade-card p-3 text-center">
                  <div className="arcade-text arcade-text-cyan text-xs">COLLECTING</div>
                  <div className="text-3xl my-2">{categories[selectedCategory as keyof typeof categories].emoji}</div>
                  <div className="arcade-text text-xs">{categories[selectedCategory as keyof typeof categories].name.toUpperCase()}</div>
                  <div className="flex justify-center space-x-1 mt-2">
                    {trashTypes[selectedCategory as keyof typeof trashTypes].map((emoji, i) => (
                      <span key={i} className="text-lg">{emoji}</span>
                    ))}
                  </div>
                </div>
                
                <div className="arcade-card p-3 text-center">
                  <div className="arcade-text arcade-text-cyan text-xs">SPEED</div>
                  <div className="arcade-h3 arcade-text-red">{gameSpeed.toFixed(1)}x</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameState === 'ended' && (
        <div className="max-w-2xl mx-auto arcade-dialog p-8 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="arcade-h2 mb-4">GAME OVER!</h2>
          
          <div className="arcade-card p-6 mb-6">
            <div className="arcade-text arcade-text-cyan text-lg mb-2">FINAL SCORE</div>
            <div className="arcade-h1 arcade-text-yellow mb-4">{score}</div>

          </div>

          <div className="flex space-x-4 justify-center">
            <button onClick={startGame} className="arcade-btn arcade-btn-primary">
              <Play className="w-4 h-4 inline mr-2" />PLAY AGAIN
            </button>
            <button onClick={resetGame} className="arcade-btn arcade-btn-secondary">
              BACK TO MENU
            </button>
          </div>
        </div>
      )}
          {/* Category Selection Modal During Game */}
          {showCategorySelect && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="arcade-dialog p-6 max-w-md w-full mx-4">
                <h3 className="arcade-h3 mb-4 text-center">SELECT WASTE TYPE</h3>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(categories).map(([key, cat]) => (
                    <button
                      key={key}
                      onClick={() => selectCategoryAndResume(key)}
                      className="arcade-card p-3 hover:arcade-card-cyan"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          {trashTypes[key as keyof typeof trashTypes].slice(0, 3).map((emoji, i) => (
                            <span key={i} className="text-lg">{emoji}</span>
                          ))}
                        </div>
                        <div className="arcade-text text-xs">{cat.name.toUpperCase()}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Eco Jumble Quest Game */}
      {currentGame === 'jumble-quest' && (
        <div className="max-w-2xl mx-auto">
          {gameState === 'menu' && (
            <div className="arcade-dialog p-8 text-center">
              <div className="text-8xl mb-4">🔤</div>
              <h2 className="arcade-h2 mb-4">ECO JUMBLE QUEST</h2>
              <p className="arcade-text arcade-text-cyan text-sm mb-6">
                Unscramble sustainability-related words and learn their meanings!
              </p>
              <button 
                onClick={() => {
                  setGameState('playing');
                  setWordScore(0);
                  setWordLevel(1);
                  generateJumbledWord();
                }} 
                className="arcade-btn arcade-btn-primary px-8"
              >
                <Play className="w-4 h-4 inline mr-2" />START GAME
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="arcade-dialog p-8">
              <div className="text-center mb-6">
                <div className="arcade-text arcade-text-yellow text-sm mb-2">LEVEL {wordLevel} • SCORE: {wordScore}</div>
                <h3 className="arcade-h2 mb-4">UNSCRAMBLE THIS WORD:</h3>
                <div className="arcade-card p-6 mb-6">
                  <div className="text-4xl arcade-text arcade-text-cyan tracking-widest">
                    {scrambledWord}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                  className="arcade-input w-full px-4 py-3 text-center text-xl"
                  placeholder="TYPE YOUR ANSWER HERE"
                  onKeyPress={(e) => e.key === 'Enter' && checkJumbleAnswer()}
                  autoFocus
                />
              </div>

              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={checkJumbleAnswer}
                  className="arcade-btn arcade-btn-primary px-6"
                >
                  SUBMIT ANSWER
                </button>
                <button 
                  onClick={generateJumbledWord}
                  className="arcade-btn arcade-btn-secondary px-6"
                >
                  SKIP WORD
                </button>
                <button 
                  onClick={() => { setCurrentGame('menu'); setGameState('menu'); }}
                  className="arcade-btn arcade-btn-red px-6"
                >
                  QUIT
                </button>
              </div>
            </div>
          )}

          {showResult && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="arcade-dialog p-8 max-w-md w-full mx-4 text-center">
                <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <h3 className={`arcade-h3 mb-4 ${isCorrect ? 'arcade-text-green' : 'arcade-text-red'}`}>
                  {isCorrect ? 'CORRECT!' : 'INCORRECT!'}
                </h3>
                <div className="arcade-card p-4 mb-6">
                  <div className="arcade-text arcade-text-yellow text-sm mb-2">CORRECT WORD:</div>
                  <div className="arcade-text arcade-text-cyan text-xl mb-3">{currentWord}</div>
                  <div className="arcade-text arcade-text-green text-xs">{wordMeaning}</div>
                </div>
                <button 
                  onClick={() => {
                    setShowResult(false);
                    generateJumbledWord();
                  }}
                  className="arcade-btn arcade-btn-primary"
                >
                  NEXT WORD
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Green Word Builder Game */}
      {currentGame === 'word-builder' && (
        <div className="max-w-2xl mx-auto">
          {gameState === 'menu' && (
            <div className="arcade-dialog p-8 text-center">
              <div className="text-8xl mb-4">🌱</div>
              <h2 className="arcade-h2 mb-4">GREEN WORD BUILDER</h2>
              <p className="arcade-text arcade-text-cyan text-sm mb-6">
                Fill in the missing letters to complete sustainability words!
              </p>
              <button 
                onClick={() => {
                  setGameState('playing');
                  setWordScore(0);
                  setWordLevel(1);
                  generateMissingLettersWord();
                }} 
                className="arcade-btn arcade-btn-primary px-8"
              >
                <Play className="w-4 h-4 inline mr-2" />START GAME
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="arcade-dialog p-8">
              <div className="text-center mb-6">
                <div className="arcade-text arcade-text-yellow text-sm mb-2">LEVEL {wordLevel} • SCORE: {wordScore}</div>
                <h3 className="arcade-h2 mb-4">COMPLETE THIS WORD:</h3>
                <div className="arcade-card p-6 mb-6">
                  <div className="text-4xl arcade-text arcade-text-cyan tracking-widest font-mono">
                    {missingLetters.display}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value.toUpperCase())}
                  className="arcade-input w-full px-4 py-3 text-center text-xl"
                  placeholder="TYPE THE COMPLETE WORD"
                  onKeyPress={(e) => e.key === 'Enter' && checkWordBuilderAnswer()}
                  autoFocus
                />
              </div>

              <div className="flex space-x-4 justify-center">
                <button 
                  onClick={checkWordBuilderAnswer}
                  className="arcade-btn arcade-btn-primary px-6"
                >
                  SUBMIT ANSWER
                </button>
                <button 
                  onClick={generateMissingLettersWord}
                  className="arcade-btn arcade-btn-secondary px-6"
                >
                  SKIP WORD
                </button>
                <button 
                  onClick={() => { setCurrentGame('menu'); setGameState('menu'); }}
                  className="arcade-btn arcade-btn-red px-6"
                >
                  QUIT
                </button>
              </div>
            </div>
          )}

          {showResult && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
              <div className="arcade-dialog p-8 max-w-md w-full mx-4 text-center">
                <div className={`text-6xl mb-4 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? '✓' : '✗'}
                </div>
                <h3 className={`arcade-h3 mb-4 ${isCorrect ? 'arcade-text-green' : 'arcade-text-red'}`}>
                  {isCorrect ? 'CORRECT!' : 'INCORRECT!'}
                </h3>
                <div className="arcade-card p-4 mb-6">
                  <div className="arcade-text arcade-text-yellow text-sm mb-2">CORRECT WORD:</div>
                  <div className="arcade-text arcade-text-cyan text-xl mb-3">{currentWord}</div>
                  <div className="arcade-text arcade-text-green text-xs">{wordMeaning}</div>
                </div>
                <button 
                  onClick={() => {
                    setShowResult(false);
                    generateMissingLettersWord();
                  }}
                  className="arcade-btn arcade-btn-primary"
                >
                  NEXT WORD
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Word Game Functions
  function generateJumbledWord() {
    const randomWord = ecoWords[Math.floor(Math.random() * ecoWords.length)];
    setCurrentWord(randomWord.word);
    setWordMeaning(randomWord.meaning);
    setScrambledWord(scrambleWord(randomWord.word));
    setUserAnswer('');
  }

  function scrambleWord(word: string): string {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  }

  function checkJumbleAnswer() {
    const correct = userAnswer === currentWord;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setWordScore(prev => prev + 10);
      setWordLevel(prev => prev + 1);
    }
  }

  function generateMissingLettersWord() {
    const randomWord = ecoWords[Math.floor(Math.random() * ecoWords.length)];
    setCurrentWord(randomWord.word);
    setWordMeaning(randomWord.meaning);
    
    // Create word with missing letters
    const word = randomWord.word;
    const numMissing = Math.min(Math.floor(word.length / 3) + 1, 3); // 1-3 missing letters
    const positions = [];
    
    // Select random positions to hide
    while (positions.length < numMissing) {
      const pos = Math.floor(Math.random() * word.length);
      if (!positions.includes(pos)) {
        positions.push(pos);
      }
    }
    
    // Create display word with underscores
    const displayWord = word.split('').map((letter, index) => 
      positions.includes(index) ? '_' : letter
    ).join('');
    
    setMissingLetters({ word: randomWord.word, display: displayWord });
    setUserAnswer('');
  }

  function checkWordBuilderAnswer() {
    const correct = userAnswer === currentWord;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) {
      setWordScore(prev => prev + 10);
      setWordLevel(prev => prev + 1);
    }
  }
}