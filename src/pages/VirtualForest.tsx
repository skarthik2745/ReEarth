import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { TreePine, Award, Target, RotateCcw, ZoomIn, ZoomOut, Shuffle } from 'lucide-react';

export default function VirtualForest() {
  const { userProgress } = useGame();
  const [season, setSeason] = useState('summer');
  const [forestLayout, setForestLayout] = useState<any[]>([
    { id: 1, species: 0, stage: 2, x: 20, y: 30 },
    { id: 2, species: 1, stage: 1, x: 60, y: 40 },
    { id: 3, species: 2, stage: 2, x: 40, y: 60 },
    { id: 4, species: 0, stage: 0, x: 80, y: 25 },
    { id: 5, species: 1, stage: 2, x: 15, y: 70 },
    { id: 6, species: 3, stage: 1, x: 70, y: 65 }
  ]);
  const [selectedTreeType, setSelectedTreeType] = useState(0);
  const [viewMode, setViewMode] = useState('2d');
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  const totalTrees = Math.floor(userProgress.points / 25);
  const unlockedSpecies = Math.floor(userProgress.points / 500) + 1;
  
  const allTreeSpecies = [
    { name: 'Neem Tree', icon: '🌿', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Banyan Tree', icon: '🌳', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Mango Tree', icon: '🥭', stages: ['🌱', '🌿', '🥭'] },
    { name: 'Gulmohar Tree', icon: '🔥', stages: ['🌱', '🌿', '🔥'] },
    { name: 'Pine Tree', icon: '🌲', stages: ['🌱', '🌿', '🌲'] },
    { name: 'Coconut Tree', icon: '🌴', stages: ['🌱', '🌿', '🌴'] },
    { name: 'Teak Tree', icon: '🪵', stages: ['🌱', '🌿', '🪵'] },
    { name: 'Peepal Tree', icon: '🟢', stages: ['🌱', '🌿', '🟢'] },
    { name: 'Ashoka Tree', icon: '🌾', stages: ['🌱', '🌿', '🌾'] },
    { name: 'Orange Tree', icon: '🍊', stages: ['🌱', '🌿', '🍊'] },
    { name: 'Lemon Tree', icon: '🍋', stages: ['🌱', '🌿', '🍋'] },
    { name: 'Apple Tree', icon: '🍎', stages: ['🌱', '🌿', '🍎'] },
    { name: 'Cashew Tree', icon: '🌰', stages: ['🌱', '🌿', '🌰'] },
    { name: 'Palm Tree', icon: '🥥', stages: ['🌱', '🌿', '🥥'] },
    { name: 'Banana Plant', icon: '🍌', stages: ['🌱', '🌿', '🍌'] },
    { name: 'Frangipani', icon: '🌺', stages: ['🌱', '🌿', '🌺'] },
    { name: 'Mahua Tree', icon: '🌼', stages: ['🌱', '🌿', '🌼'] },
    { name: 'Acacia Tree', icon: '🌱', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Jamun Tree', icon: '🌳', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Fig Tree', icon: '🍇', stages: ['🌱', '🌿', '🍇'] },
    { name: 'Cherry Blossom', icon: '🍒', stages: ['🌱', '🌿', '🍒'] },
    { name: 'Deodar Tree', icon: '🌲', stages: ['🌱', '🌿', '🌲'] },
    { name: 'Sandalwood', icon: '🟤', stages: ['🌱', '🌿', '🟤'] },
    { name: 'Drumstick Tree', icon: '🌿', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Silver Oak', icon: '🌳', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Jackfruit Tree', icon: '🟩', stages: ['🌱', '🌿', '🟩'] },
    { name: 'Areca Palm', icon: '🌴', stages: ['🌱', '🌿', '🌴'] },
    { name: 'Kadamba Tree', icon: '🌳', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Tamarind Tree', icon: '🌱', stages: ['🌱', '🌿', '🌳'] },
    { name: 'Guava Tree', icon: '🌿', stages: ['🌱', '🌿', '🌳'] }
  ];

  const unlockedTreeTypes = allTreeSpecies.slice(0, unlockedSpecies);

  const getForestLevel = (trees: number) => {
    if (trees < 4) return { name: 'Sapling Starter', color: 'arcade-text-green', badge: '🌱' };
    if (trees < 10) return { name: 'Eco Hero', color: 'arcade-text-cyan', badge: '🌿' };
    if (trees < 20) return { name: 'Forest Guardian', color: 'arcade-text-yellow', badge: '🌳' };
    if (trees >= 30) return { name: 'Eco Legend', color: 'arcade-text-magenta', badge: '👑' };
    return { name: 'Earth Protector', color: 'arcade-text-red', badge: '🛡️' };
  };

  const forestLevel = getForestLevel(totalTrees);
  
  const seasons = [
    { name: 'Summer', icon: '☀️', bg: 'bg-yellow-900' },
    { name: 'Monsoon', icon: '🌧️', bg: 'bg-green-900' },
    { name: 'Autumn', icon: '🍁', bg: 'bg-orange-900' },
    { name: 'Winter', icon: '❄️', bg: 'bg-blue-900' }
  ];

  const plantTree = () => {
    if (forestLayout.length < totalTrees) {
      const newTree = {
        id: Date.now(),
        species: selectedTreeType,
        stage: Math.min(2, Math.floor(userProgress.points / 200)),
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20
      };
      setForestLayout([...forestLayout, newTree]);
    }
  };

  const rearrangeForest = () => {
    const rearranged = forestLayout.map(tree => ({
      ...tree,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20
    }));
    setForestLayout(rearranged);
  };

  const rotateView = () => {
    const rotated = forestLayout.map(tree => ({
      ...tree,
      x: 100 - tree.x,
      y: tree.y
    }));
    setForestLayout(rotated);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ReEarth VIRTUAL FOREST</h1>
        <p className="arcade-text arcade-text-yellow">GROW YOUR DIGITAL FOREST</p>
      </div>

      {/* Forest Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="arcade-dialog p-6 text-center">
          <TreePine className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <div className="arcade-h2 text-green-400 mb-2">{totalTrees}</div>
          <div className="arcade-text arcade-text-yellow text-xs">TOTAL TREES</div>
        </div>

        <div className="arcade-dialog p-6 text-center">
          <Award className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
          <div className="arcade-h2 text-cyan-400 mb-2">{unlockedSpecies}</div>
          <div className="arcade-text arcade-text-yellow text-xs">SPECIES UNLOCKED</div>
        </div>

        <div className="arcade-dialog p-6 text-center">
          <Target className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <div className={`arcade-h2 mb-2 ${forestLevel.color}`}>{forestLevel.name.toUpperCase()}</div>
          <div className="arcade-text arcade-text-yellow text-xs">FOREST LEVEL</div>
        </div>

        <div className="arcade-dialog p-6 text-center">
          <div className="text-4xl mb-4">🌱</div>
          <div className="arcade-h2 text-magenta-400 mb-2">{50 - (userProgress.points % 50)}</div>
          <div className="arcade-text arcade-text-yellow text-xs">POINTS TO NEXT TREE</div>
        </div>
      </div>

      {/* Tree Species */}
      {/* Your Unlocked Trees */}
      <div className="mb-8">
        <h2 className="arcade-h2 mb-6 text-center">YOUR UNLOCKED TREES</h2>
        {unlockedSpecies > 0 ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
              {unlockedTreeTypes.map((tree, index) => (
                <div key={index} className="arcade-dialog p-4 text-center">
                  <div className="text-3xl mb-2">{tree.icon}</div>
                  <h4 className="arcade-text text-xs mb-2">{tree.name.toUpperCase()}</h4>
                  <div className="arcade-card arcade-card-green p-1">
                    <span className="arcade-text arcade-text-green text-xs">UNLOCKED</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <div className="arcade-card arcade-card-green p-3 inline-block mr-4">
                <span className="arcade-text arcade-text-green text-xs">{unlockedSpecies} SPECIES UNLOCKED</span>
              </div>
              <div className="arcade-card arcade-card-cyan p-3 inline-block">
                <span className="arcade-text arcade-text-cyan text-xs">{totalTrees} TREES AVAILABLE</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="arcade-dialog p-8 text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="arcade-h3 mb-4">NO SPECIES UNLOCKED YET</h3>
            <p className="arcade-text arcade-text-cyan mb-4">EARN POINTS TO UNLOCK TREE SPECIES</p>
            <div className="arcade-card arcade-card-magenta p-4 max-w-md mx-auto">
              <div className="arcade-text arcade-text-yellow text-xs">
                NEXT SPECIES AT: 500 POINTS
              </div>
              <div className="arcade-text arcade-text-cyan text-xs mt-1">
                CURRENT: {userProgress.points} POINTS
              </div>
            </div>
          </div>
        )}
      </div>

      {/* All Tree Species Gallery */}
      <div className="mb-8">
        <h2 className="arcade-h2 mb-6 text-center">ALL TREE SPECIES</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {allTreeSpecies.map((tree, index) => (
            <div key={index} className="arcade-dialog p-4 text-center">
              <div className="text-3xl mb-2">{tree.icon}</div>
              <h4 className="arcade-text text-xs mb-2">{tree.name.toUpperCase()}</h4>
              {index < unlockedSpecies ? (
                <div className="arcade-card arcade-card-green p-1">
                  <span className="arcade-text arcade-text-green text-xs">UNLOCKED</span>
                </div>
              ) : (
                <div className="arcade-card arcade-card-yellow p-1">
                  <span className="arcade-text arcade-text-yellow text-xs">{(index + 1) * 500} PTS</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Season & Controls */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="arcade-dialog p-6">
            <h3 className="arcade-h3 mb-4 text-center">FOREST CONTROLS</h3>
            <div className="space-y-3">
              <div className="flex space-x-2 mb-3">
                {seasons.map((s, index) => (
                  <button 
                    key={index}
                    onClick={() => setSeason(s.name.toLowerCase())}
                    className={`flex-1 arcade-btn text-xs ${
                      season === s.name.toLowerCase() ? 'arcade-btn-primary' : 'arcade-btn-secondary'
                    }`}
                  >
                    {s.icon} {s.name.toUpperCase()}
                  </button>
                ))}
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode('2d')}
                  className={`flex-1 arcade-btn text-xs ${
                    viewMode === '2d' ? 'arcade-btn-primary' : 'arcade-btn-secondary'
                  }`}
                >
                  2D VIEW
                </button>
                <button 
                  onClick={() => setViewMode('3d')}
                  className={`flex-1 arcade-btn text-xs ${
                    viewMode === '3d' ? 'arcade-btn-primary' : 'arcade-btn-secondary'
                  }`}
                >
                  3D VIEW
                </button>
              </div>

            </div>
          </div>

          <div className="arcade-dialog p-6">
            <h3 className="arcade-h3 mb-4 text-center">TREE PLANTING</h3>
            <div className="space-y-3">
              <select 
                value={selectedTreeType} 
                onChange={(e) => setSelectedTreeType(Number(e.target.value))}
                className="arcade-input w-full px-3 text-xs"
              >
                {unlockedTreeTypes.map((tree, index) => (
                  <option key={index} value={index}>
                    {tree.icon} {tree.name.toUpperCase()}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => {
                  // Force re-render to show selected tree type
                  setSelectedTreeType(selectedTreeType);
                }}
                className="w-full arcade-btn arcade-btn-primary text-xs mb-2"
              >
                APPLY TREE TYPE
              </button>
              <div className="arcade-card p-3 text-center">
                <div className="arcade-text arcade-text-green text-xs mb-1">TREES AVAILABLE</div>
                <div className="arcade-h3 text-green-400">{totalTrees}</div>
                <div className="arcade-text arcade-text-yellow text-xs">AUTO-PLANTED</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Virtual Forest Visualization */}
      <div className="arcade-dialog p-8">
        <h2 className={`arcade-h2 mb-6 text-center ${
          season === 'summer' ? 'text-orange-800' :
          season === 'monsoon' ? 'text-indigo-900' :
          season === 'autumn' ? 'text-red-800' :
          'text-blue-800'
        }`}>YOUR FOREST - {season.toUpperCase()}</h2>
        
        {totalTrees > 0 ? (
          <div className={`p-6 rounded border-4 border-white ${
            season === 'summer' ? 'bg-gradient-to-b from-yellow-200 to-green-300' :
            season === 'monsoon' ? 'bg-gradient-to-b from-indigo-50 to-cyan-50' :
            season === 'autumn' ? 'bg-gradient-to-b from-orange-200 to-yellow-400' :
            'bg-gradient-to-b from-blue-200 to-white'
          }`}>
            {viewMode === '2d' ? (
              <div className="grid grid-cols-5 md:grid-cols-10 gap-4 justify-items-center">
                {Array.from({ length: totalTrees }, (_, index) => {
                  const treeSpecies = unlockedTreeTypes[selectedTreeType] || unlockedTreeTypes[0];
                  return (
                    <div key={index} className="text-center hover:scale-110 transition-transform cursor-pointer">
                      <div className="text-3xl mb-1">{treeSpecies?.icon || '🌱'}</div>
                      <div className={`arcade-text text-xs ${
                        season === 'summer' ? 'text-brown' :
                        season === 'monsoon' ? 'text-violet' :
                        season === 'autumn' ? 'text-dark-red' :
                        'text-dark-violet'
                      }`}>#{index + 1}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div 
                className="relative h-80 overflow-hidden cursor-grab active:cursor-grabbing select-none"
                onMouseDown={(e) => {
                  setIsDragging(true);
                  setLastMouse({ x: e.clientX, y: e.clientY });
                }}
                onMouseMove={(e) => {
                  if (isDragging) {
                    const deltaX = e.clientX - lastMouse.x;
                    const deltaY = e.clientY - lastMouse.y;
                    setRotation(prev => ({
                      x: Math.max(-60, Math.min(60, prev.x - deltaY * 0.5)),
                      y: prev.y + deltaX * 0.5
                    }));
                    setLastMouse({ x: e.clientX, y: e.clientY });
                  }
                }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                <div 
                  className="grid grid-cols-4 md:grid-cols-6 gap-8 p-8"
                  style={{
                    transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    transformStyle: 'preserve-3d',
                    transition: isDragging ? 'none' : 'transform 0.3s ease'
                  }}
                >
                  {Array.from({ length: totalTrees }, (_, index) => {
                    const treeSpecies = unlockedTreeTypes[selectedTreeType] || unlockedTreeTypes[0];
                    const row = Math.floor(index / 6);
                    const col = index % 6;
                    return (
                      <div 
                        key={index} 
                        className="flex flex-col items-center hover:scale-110 transition-all duration-300"
                        style={{
                          transform: `translateX(${col * 20}px) translateY(${row * 20}px) translateZ(0px)`,
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        <div className="text-5xl drop-shadow-2xl" style={{
                          transformStyle: 'flat',
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                        }}>
                          {treeSpecies?.icon || '🌱'}
                        </div>
                        <div className={`arcade-text text-xs mt-2 ${
                          season === 'summer' ? 'text-brown' :
                          season === 'monsoon' ? 'text-violet' :
                          season === 'autumn' ? 'text-dark-red' :
                          'text-dark-violet'
                        }`} style={{
                          transformStyle: 'flat'
                        }}>#{index + 1}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="absolute bottom-4 left-4 arcade-card p-2">
                  <span className="arcade-text arcade-text-cyan text-xs">
                    DRAG TO ROTATE • 3D VIEW
                  </span>
                </div>
              </div>
            )}
            
            {/* Seasonal Effects */}
            <div className="text-center mt-4">
              {season === 'summer' && <div className="text-2xl text-orange-700">☀️ Bright & Sunny</div>}
              {season === 'monsoon' && <div className="text-2xl text-indigo-800">🌧️ Rainy & Green</div>}
              {season === 'autumn' && <div className="text-2xl text-red-700">🍁 Colorful Leaves</div>}
              {season === 'winter' && <div className="text-2xl text-blue-700">❄️ Cool & Calm</div>}
            </div>
          </div>
        ) : (
          <div className={`text-center py-12 p-6 rounded border-4 border-dashed ${
            season === 'summer' ? 'bg-yellow-100 border-yellow-400' :
            season === 'monsoon' ? 'bg-indigo-50 border-indigo-200' :
            season === 'autumn' ? 'bg-orange-100 border-orange-400' :
            'bg-blue-100 border-blue-400'
          }`}>
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="arcade-h3 mb-4">NO TREES YET</h3>
            <p className="arcade-text arcade-text-cyan mb-6">EARN 25 POINTS TO PLANT YOUR FIRST TREE</p>
            <div className="arcade-card arcade-card-magenta p-4 max-w-md mx-auto">
              <div className="arcade-text arcade-text-yellow text-xs">
                CURRENT PROGRESS: {userProgress.points}/25 POINTS
              </div>
              <div className="w-full bg-black border-2 border-white h-4 mt-2">
                <div 
                  className="h-full bg-green-400 transition-all duration-300"
                  style={{ width: `${(userProgress.points % 25) * 4}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Forest Achievements */}
      <div className="mt-8">
        <h2 className="arcade-h2 mb-6 text-center">FOREST ACHIEVEMENTS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="arcade-dialog p-6">
            <h3 className="arcade-h3 mb-4">NEXT MILESTONES</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between arcade-text text-xs">
                <span className="arcade-text-yellow">NEXT TREE TOKEN:</span>
                <span className="arcade-text-cyan">{25 - (userProgress.points % 25)} POINTS</span>
              </div>
              <div className="flex items-center justify-between arcade-text text-xs">
                <span className="arcade-text-yellow">NEXT SPECIES:</span>
                <span className="arcade-text-magenta">{500 - (userProgress.points % 500)} POINTS</span>
              </div>
              <div className="flex items-center justify-between arcade-text text-xs">
                <span className="arcade-text-yellow">SPECIES UNLOCKED:</span>
                <span className="arcade-text-green">{unlockedSpecies}/30</span>
              </div>
            </div>
          </div>

          <div className="arcade-dialog p-6">
            <h3 className="arcade-h3 mb-4">FOREST BADGES</h3>
            <div className="space-y-3">
              <div className={`arcade-card p-3 ${totalTrees >= 1 ? 'arcade-card-green' : 'arcade-card-red'}`}>
                <span className="arcade-text text-xs">🌱 SAPLING STARTER</span>
              </div>
              <div className={`arcade-card p-3 ${totalTrees >= 10 ? 'arcade-card-green' : 'arcade-card-red'}`}>
                <span className="arcade-text text-xs">🌿 ECO HERO (10 TREES)</span>
              </div>
              <div className={`arcade-card p-3 ${totalTrees >= 20 ? 'arcade-card-green' : 'arcade-card-red'}`}>
                <span className="arcade-text text-xs">🌳 FOREST GUARDIAN (20 TREES)</span>
              </div>
              <div className={`arcade-card p-3 ${unlockedSpecies >= 30 ? 'arcade-card-green' : 'arcade-card-red'}`}>
                <span className="arcade-text text-xs">🛡️ EARTH PROTECTOR (ALL SPECIES)</span>
              </div>
            </div>
          </div>

          <div className="arcade-dialog p-6">
            <h3 className="arcade-h3 mb-4">FOREST STATS</h3>
            <div className="space-y-3">
              <div className="arcade-card p-3 text-center">
                <div className="text-2xl mb-1">{forestLevel.badge}</div>
                <div className={`arcade-text text-xs ${forestLevel.color}`}>{forestLevel.name.toUpperCase()}</div>
              </div>
              <div className="arcade-text text-xs text-center">
                <div className="arcade-text-yellow">GROWTH RATE:</div>
                <div className="arcade-text-cyan">1 TREE PER 25 POINTS</div>
              </div>
              <div className="arcade-text text-xs text-center">
                <div className="arcade-text-yellow">UNLOCK RATE:</div>
                <div className="arcade-text-green">1 SPECIES PER 500 POINTS</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}