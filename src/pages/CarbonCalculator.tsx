import React, { useState } from 'react';
import { Calculator, TrendingDown, Award, Lightbulb } from 'lucide-react';

export default function CarbonCalculator() {
  const [formData, setFormData] = useState({
    bikeKm: 0,
    busKm: 0,
    carKm: 0,
    electricityHours: 0,
    plasticUsage: 'low',
    dietType: 'vegetarian'
  });

  const [result, setResult] = useState<any>(null);

  const calculateFootprint = () => {
    // Simple calculation (kg CO2 per week)
    const bikeEmission = formData.bikeKm * 0.0; // Bike is zero emission
    const busEmission = formData.busKm * 0.05;
    const carEmission = formData.carKm * 0.2;
    const electricityEmission = formData.electricityHours * 0.1;
    
    const plasticMultiplier = {
      'low': 0.5,
      'medium': 1.0,
      'high': 2.0
    };
    
    const dietMultiplier = {
      'vegetarian': 1.0,
      'non-vegetarian': 1.5
    };

    const plasticEmission = plasticMultiplier[formData.plasticUsage as keyof typeof plasticMultiplier];
    const dietEmission = dietMultiplier[formData.dietType as keyof typeof dietMultiplier] * 2;

    const totalEmission = bikeEmission + busEmission + carEmission + electricityEmission + plasticEmission + dietEmission;
    const averageStudent = 3.5; // kg CO2 per week
    const comparison = ((totalEmission - averageStudent) / averageStudent * 100);

    setResult({
      total: totalEmission.toFixed(1),
      comparison: comparison.toFixed(0),
      points: comparison < 0 ? Math.abs(Math.floor(comparison)) : 0,
      tips: getTips(formData)
    });
  };

  const getTips = (data: any) => {
    const tips = [];
    if (data.carKm > 10) tips.push("Try using public transport or cycling more");
    if (data.electricityHours > 6) tips.push("Switch to LED bulbs and unplug devices");
    if (data.plasticUsage === 'high') tips.push("Use reusable bottles and bags");
    if (data.dietType === 'non-vegetarian') tips.push("Try having 2 vegetarian days per week");
    return tips.length > 0 ? tips : ["Great job! Keep up the eco-friendly habits"];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">CARBON FOOTPRINT CALCULATOR</h1>
        <p className="arcade-text arcade-text-yellow">MEASURE • ANALYZE • REDUCE</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="arcade-dialog p-6">
          <h2 className="arcade-h2 mb-6 text-center">WEEKLY ACTIVITIES</h2>
          
          <div className="space-y-6">
            {/* Transportation */}
            <div>
              <h3 className="arcade-h3 mb-4">TRANSPORTATION (KM/WEEK)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">BIKE TRAVEL</label>
                  <input
                    type="number"
                    value={formData.bikeKm}
                    onChange={(e) => setFormData({...formData, bikeKm: Number(e.target.value)})}
                    className="arcade-input w-full px-3"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">BUS TRAVEL</label>
                  <input
                    type="number"
                    value={formData.busKm}
                    onChange={(e) => setFormData({...formData, busKm: Number(e.target.value)})}
                    className="arcade-input w-full px-3"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">CAR TRAVEL</label>
                  <input
                    type="number"
                    value={formData.carKm}
                    onChange={(e) => setFormData({...formData, carKm: Number(e.target.value)})}
                    className="arcade-input w-full px-3"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Energy */}
            <div>
              <h3 className="arcade-h3 mb-4">ENERGY USAGE</h3>
              <div>
                <label className="block arcade-text arcade-text-yellow mb-2">ELECTRICITY (HOURS/DAY)</label>
                <input
                  type="number"
                  value={formData.electricityHours}
                  onChange={(e) => setFormData({...formData, electricityHours: Number(e.target.value)})}
                  className="arcade-input w-full px-3"
                  placeholder="4"
                />
              </div>
            </div>

            {/* Lifestyle */}
            <div>
              <h3 className="arcade-h3 mb-4">LIFESTYLE</h3>
              <div className="space-y-3">
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">PLASTIC USAGE</label>
                  <select
                    value={formData.plasticUsage}
                    onChange={(e) => setFormData({...formData, plasticUsage: e.target.value})}
                    className="arcade-input w-full px-3"
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
                <div>
                  <label className="block arcade-text arcade-text-yellow mb-2">DIET TYPE</label>
                  <select
                    value={formData.dietType}
                    onChange={(e) => setFormData({...formData, dietType: e.target.value})}
                    className="arcade-input w-full px-3"
                  >
                    <option value="vegetarian">VEGETARIAN</option>
                    <option value="non-vegetarian">NON-VEGETARIAN</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={calculateFootprint}
              className="w-full arcade-btn arcade-btn-primary"
            >
              <Calculator className="w-4 h-4 inline mr-2" />
              CALCULATE FOOTPRINT
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Carbon Footprint Result */}
              <div className="arcade-dialog p-6 text-center">
                <h3 className="arcade-h2 mb-4">YOUR CARBON FOOTPRINT</h3>
                <div className="arcade-card arcade-card-red p-6 mb-4">
                  <div className="arcade-h1 text-red-400 mb-2">{result.total}</div>
                  <div className="arcade-text arcade-text-yellow">KG CO₂ PER WEEK</div>
                </div>
                
                <div className={`arcade-card p-4 ${result.comparison < 0 ? 'arcade-card-green' : 'arcade-card-red'}`}>
                  <div className="flex items-center justify-center space-x-2">
                    <TrendingDown className="w-4 h-4" />
                    <span className="arcade-text text-xs">
                      {result.comparison < 0 ? `${Math.abs(result.comparison)}% BELOW` : `${result.comparison}% ABOVE`} AVERAGE
                    </span>
                  </div>
                </div>
              </div>

              {/* Points Earned */}
              {result.points > 0 && (
                <div className="arcade-dialog p-6 text-center">
                  <Award className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="arcade-h3 mb-2">POINTS EARNED!</h3>
                  <div className="arcade-card arcade-card-green p-4">
                    <span className="arcade-h2 text-green-400">+{result.points}</span>
                    <div className="arcade-text arcade-text-yellow text-xs mt-1">ECO POINTS</div>
                  </div>
                </div>
              )}

              {/* Tips */}
              <div className="arcade-dialog p-6">
                <h3 className="arcade-h3 mb-4 text-center">
                  <Lightbulb className="w-5 h-5 inline mr-2" />
                  REDUCTION TIPS
                </h3>
                <div className="space-y-2">
                  {result.tips.map((tip: string, index: number) => (
                    <div key={index} className="arcade-card p-3">
                      <span className="arcade-text arcade-text-cyan text-xs">{tip.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="arcade-dialog p-8 text-center">
              <Calculator className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="arcade-h3 mb-4">READY TO CALCULATE</h3>
              <p className="arcade-text arcade-text-cyan">FILL IN YOUR WEEKLY ACTIVITIES TO GET YOUR CARBON FOOTPRINT</p>
            </div>
          )}
        </div>
      </div>

      {/* Previous Calculations */}
      <div className="mt-8">
        <div className="arcade-dialog p-6">
          <h3 className="arcade-h2 mb-6 text-center">CALCULATION HISTORY</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="arcade-card p-4 text-center">
              <div className="arcade-text arcade-text-yellow text-xs mb-2">LAST WEEK</div>
              <div className="arcade-h3 text-cyan-400">2.8 KG CO₂</div>
            </div>
            <div className="arcade-card p-4 text-center">
              <div className="arcade-text arcade-text-yellow text-xs mb-2">2 WEEKS AGO</div>
              <div className="arcade-h3 text-magenta-400">3.2 KG CO₂</div>
            </div>
            <div className="arcade-card p-4 text-center">
              <div className="arcade-text arcade-text-yellow text-xs mb-2">3 WEEKS AGO</div>
              <div className="arcade-h3 text-red-400">3.8 KG CO₂</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}