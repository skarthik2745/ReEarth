import React, { useState } from 'react';
import { Calculator, Zap, Car, Home, Utensils, Plane, BarChart3, Target, TrendingDown, Award, Loader } from 'lucide-react';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export default function CarbonCalculator() {
  const [formData, setFormData] = useState({
    // Transportation
    carKm: 0,
    carType: 'petrol',
    publicTransportKm: 0,
    flightsShort: 0,
    flightsLong: 0,
    
    // Energy
    electricityKwh: 0,
    gasUsage: 0,
    heatingType: 'gas',
    
    // Food
    meatMeals: 0,
    dairyServings: 0,
    localFood: 50,
    
    // Lifestyle
    clothingItems: 0,
    electronicDevices: 0,
    wasteKg: 0,
    recyclingPercent: 50
  });

  const [result, setResult] = useState<any>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateEmissions = () => {
    // Transportation emissions (kg CO2/month)
    const carEmissions = formData.carKm * (formData.carType === 'petrol' ? 0.21 : formData.carType === 'diesel' ? 0.25 : 0.05);
    const publicTransportEmissions = formData.publicTransportKm * 0.04;
    const flightEmissions = (formData.flightsShort * 200) + (formData.flightsLong * 1000);
    
    // Energy emissions (kg CO2/month)
    const electricityEmissions = formData.electricityKwh * 0.5;
    const gasEmissions = formData.gasUsage * 2.3;
    const heatingMultiplier = formData.heatingType === 'gas' ? 1.2 : formData.heatingType === 'oil' ? 1.5 : 0.3;
    
    // Food emissions (kg CO2/month)
    const meatEmissions = formData.meatMeals * 3.3;
    const dairyEmissions = formData.dairyServings * 0.9;
    const localFoodReduction = (100 - formData.localFood) * 0.02;
    
    // Lifestyle emissions (kg CO2/month)
    const clothingEmissions = formData.clothingItems * 8;
    const electronicsEmissions = formData.electronicDevices * 50;
    const wasteEmissions = formData.wasteKg * 0.5 * (1 - formData.recyclingPercent / 100);
    
    const totalTransport = carEmissions + publicTransportEmissions + flightEmissions;
    const totalEnergy = electricityEmissions + gasEmissions * heatingMultiplier;
    const totalFood = meatEmissions + dairyEmissions + localFoodReduction;
    const totalLifestyle = clothingEmissions + electronicsEmissions + wasteEmissions;
    
    const totalMonthly = totalTransport + totalEnergy + totalFood + totalLifestyle;
    const totalAnnual = totalMonthly * 12;
    
    return {
      monthly: totalMonthly.toFixed(1),
      annual: totalAnnual.toFixed(1),
      breakdown: {
        transport: totalTransport.toFixed(1),
        energy: totalEnergy.toFixed(1),
        food: totalFood.toFixed(1),
        lifestyle: totalLifestyle.toFixed(1)
      },
      percentages: {
        transport: ((totalTransport / totalMonthly) * 100).toFixed(0),
        energy: ((totalEnergy / totalMonthly) * 100).toFixed(0),
        food: ((totalFood / totalMonthly) * 100).toFixed(0),
        lifestyle: ((totalLifestyle / totalMonthly) * 100).toFixed(0)
      }
    };
  };

  const generateAIAnalysis = async (emissions: any) => {
    setLoading(true);
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
            content: `Analyze carbon footprint: ${emissions.annual}kg CO2/year (${emissions.monthly}kg/month). Breakdown: Transport ${emissions.breakdown.transport}kg (${emissions.percentages.transport}%), Energy ${emissions.breakdown.energy}kg (${emissions.percentages.energy}%), Food ${emissions.breakdown.food}kg (${emissions.percentages.food}%), Lifestyle ${emissions.breakdown.lifestyle}kg (${emissions.percentages.lifestyle}%).

User data: Car ${formData.carKm}km/month (${formData.carType}), flights ${formData.flightsShort + formData.flightsLong}, electricity ${formData.electricityKwh}kWh, meat ${formData.meatMeals} meals/week, clothing ${formData.clothingItems} items/year.

Return ONLY valid JSON:
{
  "rating": "excellent/good/average/poor/critical",
  "global_comparison": "detailed comparison with global average (4.8 tons/year)",
  "biggest_impact": "category with highest emissions and why",
  "quick_wins": ["3 immediate actions with specific impact"],
  "long_term_goals": ["3 strategic changes for major reduction"],
  "monthly_targets": {
    "current": "${emissions.monthly}kg",
    "target_3_months": "realistic 3-month target",
    "target_1_year": "ambitious 1-year target"
  },
  "impact_scenarios": {
    "if_no_change": "projection if no changes made",
    "with_quick_wins": "impact of implementing quick wins",
    "with_all_changes": "impact of implementing all recommendations"
  },
  "personalized_tips": ["5 specific tips based on user's highest emission sources"]
}`
          }],
          temperature: 0.7,
          max_tokens: 1200
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysisData = JSON.parse(jsonMatch[0]);
          setAnalysis(analysisData);
          return;
        }
      }
    } catch (error) {
      console.error('AI Analysis Error:', error);
    } finally {
      setLoading(false);
    }
    
    // Fallback analysis
    setAnalysis({
      rating: emissions.annual > 8000 ? 'critical' : emissions.annual > 6000 ? 'poor' : emissions.annual > 4000 ? 'average' : 'good',
      global_comparison: `Your footprint is ${emissions.annual > 4800 ? 'above' : 'below'} the global average of 4.8 tons per year`,
      biggest_impact: 'Transport appears to be your largest emission source',
      quick_wins: ['Use public transport 2 days/week', 'Reduce meat consumption by 1 meal/week', 'Switch to LED bulbs'],
      long_term_goals: ['Consider electric vehicle', 'Install solar panels', 'Adopt plant-based diet'],
      monthly_targets: {
        current: `${emissions.monthly}kg`,
        target_3_months: `${(parseFloat(emissions.monthly) * 0.8).toFixed(1)}kg`,
        target_1_year: `${(parseFloat(emissions.monthly) * 0.6).toFixed(1)}kg`
      },
      impact_scenarios: {
        if_no_change: 'Emissions will likely increase with lifestyle changes',
        with_quick_wins: 'Could reduce by 15-20% in 3 months',
        with_all_changes: 'Potential 50-60% reduction within 2 years'
      },
      personalized_tips: ['Walk or cycle for trips under 3km', 'Batch cooking to reduce energy use', 'Buy second-hand clothing', 'Use cold water for washing', 'Reduce food waste by meal planning']
    });
  };

  const handleCalculate = async () => {
    const emissions = calculateEmissions();
    setResult(emissions);
    await generateAIAnalysis(emissions);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'arcade-card-green';
      case 'good': return 'arcade-card-cyan';
      case 'average': return 'arcade-card-yellow';
      case 'poor': return 'arcade-card-magenta';
      case 'critical': return 'arcade-card-red';
      default: return 'arcade-card-cyan';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="arcade-h1 mb-4">ADVANCED CARBON CALCULATOR</h1>
        <p className="arcade-text arcade-text-yellow">COMPREHENSIVE FOOTPRINT ANALYSIS WITH AI INSIGHTS</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          {/* Transportation */}
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-4 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              TRANSPORTATION
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">CAR TRAVEL (KM/MONTH)</label>
                  <input
                    type="number"
                    value={formData.carKm}
                    onChange={(e) => setFormData({...formData, carKm: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">CAR TYPE</label>
                  <select
                    value={formData.carType}
                    onChange={(e) => setFormData({...formData, carType: e.target.value})}
                    className="arcade-input w-full"
                  >
                    <option value="petrol">PETROL</option>
                    <option value="diesel">DIESEL</option>
                    <option value="hybrid">HYBRID</option>
                    <option value="electric">ELECTRIC</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="arcade-text arcade-text-yellow text-xs mb-2 block">PUBLIC TRANSPORT (KM/MONTH)</label>
                <input
                  type="number"
                  value={formData.publicTransportKm}
                  onChange={(e) => setFormData({...formData, publicTransportKm: Number(e.target.value)})}
                  className="arcade-input w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">SHORT FLIGHTS/YEAR</label>
                  <input
                    type="number"
                    value={formData.flightsShort}
                    onChange={(e) => setFormData({...formData, flightsShort: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">LONG FLIGHTS/YEAR</label>
                  <input
                    type="number"
                    value={formData.flightsLong}
                    onChange={(e) => setFormData({...formData, flightsLong: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Energy */}
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              ENERGY
            </h2>
            <div className="space-y-4">
              <div>
                <label className="arcade-text arcade-text-yellow text-xs mb-2 block">ELECTRICITY (KWH/MONTH)</label>
                <input
                  type="number"
                  value={formData.electricityKwh}
                  onChange={(e) => setFormData({...formData, electricityKwh: Number(e.target.value)})}
                  className="arcade-input w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">GAS USAGE (M³/MONTH)</label>
                  <input
                    type="number"
                    value={formData.gasUsage}
                    onChange={(e) => setFormData({...formData, gasUsage: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">HEATING TYPE</label>
                  <select
                    value={formData.heatingType}
                    onChange={(e) => setFormData({...formData, heatingType: e.target.value})}
                    className="arcade-input w-full"
                  >
                    <option value="gas">GAS</option>
                    <option value="electric">ELECTRIC</option>
                    <option value="oil">OIL</option>
                    <option value="renewable">RENEWABLE</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Food */}
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-4 flex items-center">
              <Utensils className="w-5 h-5 mr-2" />
              FOOD & DIET
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">MEAT MEALS/WEEK</label>
                  <input
                    type="number"
                    value={formData.meatMeals}
                    onChange={(e) => setFormData({...formData, meatMeals: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">DAIRY SERVINGS/DAY</label>
                  <input
                    type="number"
                    value={formData.dairyServings}
                    onChange={(e) => setFormData({...formData, dairyServings: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
              </div>
              <div>
                <label className="arcade-text arcade-text-yellow text-xs mb-2 block">LOCAL FOOD %</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.localFood}
                  onChange={(e) => setFormData({...formData, localFood: Number(e.target.value)})}
                  className="w-full"
                />
                <div className="arcade-text arcade-text-cyan text-xs mt-1">{formData.localFood}% LOCAL</div>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="arcade-dialog p-6">
            <h2 className="arcade-h2 mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2" />
              LIFESTYLE
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">NEW CLOTHES/YEAR</label>
                  <input
                    type="number"
                    value={formData.clothingItems}
                    onChange={(e) => setFormData({...formData, clothingItems: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">ELECTRONICS/YEAR</label>
                  <input
                    type="number"
                    value={formData.electronicDevices}
                    onChange={(e) => setFormData({...formData, electronicDevices: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">WASTE (KG/WEEK)</label>
                  <input
                    type="number"
                    value={formData.wasteKg}
                    onChange={(e) => setFormData({...formData, wasteKg: Number(e.target.value)})}
                    className="arcade-input w-full"
                  />
                </div>
                <div>
                  <label className="arcade-text arcade-text-yellow text-xs mb-2 block">RECYCLING %</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.recyclingPercent}
                    onChange={(e) => setFormData({...formData, recyclingPercent: Number(e.target.value)})}
                    className="w-full"
                  />
                  <div className="arcade-text arcade-text-cyan text-xs mt-1">{formData.recyclingPercent}%</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            className="w-full arcade-btn arcade-btn-primary py-4"
          >
            <Calculator className="w-5 h-5 inline mr-2" />
            CALCULATE & ANALYZE
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result && (
            <>
              {/* Main Results */}
              <div className="arcade-dialog p-6 text-center">
                <h2 className="arcade-h2 mb-4">YOUR CARBON FOOTPRINT</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="arcade-card arcade-card-red p-4">
                    <div className="arcade-h1 text-red-400">{result.monthly}</div>
                    <div className="arcade-text arcade-text-yellow text-xs">KG CO₂/MONTH</div>
                  </div>
                  <div className="arcade-card arcade-card-magenta p-4">
                    <div className="arcade-h1 text-magenta-400">{result.annual}</div>
                    <div className="arcade-text arcade-text-yellow text-xs">KG CO₂/YEAR</div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-cyan text-xs">TRANSPORT</div>
                    <div className="arcade-text text-xs">{result.breakdown.transport}kg ({result.percentages.transport}%)</div>
                  </div>
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-cyan text-xs">ENERGY</div>
                    <div className="arcade-text text-xs">{result.breakdown.energy}kg ({result.percentages.energy}%)</div>
                  </div>
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-cyan text-xs">FOOD</div>
                    <div className="arcade-text text-xs">{result.breakdown.food}kg ({result.percentages.food}%)</div>
                  </div>
                  <div className="arcade-card p-3">
                    <div className="arcade-text arcade-text-cyan text-xs">LIFESTYLE</div>
                    <div className="arcade-text text-xs">{result.breakdown.lifestyle}kg ({result.percentages.lifestyle}%)</div>
                  </div>
                </div>
              </div>

              {/* AI Analysis Loading */}
              {loading && (
                <div className="arcade-dialog p-6 text-center">
                  <Loader className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-4" />
                  <div className="arcade-text arcade-text-cyan">GENERATING AI ANALYSIS...</div>
                </div>
              )}

              {/* AI Analysis Results */}
              {analysis && (
                <>
                  {/* Rating & Comparison */}
                  <div className="arcade-dialog p-6">
                    <h3 className="arcade-h2 mb-4 text-center">AI ANALYSIS</h3>
                    <div className={`arcade-card p-4 mb-4 text-center ${getRatingColor(analysis.rating)}`}>
                      <div className="arcade-text text-xs mb-1">FOOTPRINT RATING</div>
                      <div className="arcade-h2">{analysis.rating.toUpperCase()}</div>
                    </div>
                    <div className="arcade-card p-4">
                      <div className="arcade-text arcade-text-yellow text-xs mb-2">GLOBAL COMPARISON:</div>
                      <div className="arcade-text text-xs">{analysis.global_comparison}</div>
                    </div>
                  </div>

                  {/* Biggest Impact */}
                  <div className="arcade-dialog p-6">
                    <h3 className="arcade-h3 mb-4 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      BIGGEST IMPACT AREA
                    </h3>
                    <div className="arcade-card arcade-card-red p-4">
                      <div className="arcade-text text-xs">{analysis.biggest_impact}</div>
                    </div>
                  </div>

                  {/* Quick Wins */}
                  <div className="arcade-dialog p-6">
                    <h3 className="arcade-h3 mb-4 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      QUICK WINS
                    </h3>
                    <div className="space-y-2">
                      {analysis.quick_wins.map((win: string, index: number) => (
                        <div key={index} className="arcade-card arcade-card-green p-3">
                          <div className="arcade-text text-xs">• {win}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Targets */}
                  <div className="arcade-dialog p-6">
                    <h3 className="arcade-h3 mb-4 flex items-center">
                      <TrendingDown className="w-4 h-4 mr-2" />
                      REDUCTION TARGETS
                    </h3>
                    <div className="space-y-3">
                      <div className="arcade-card p-3">
                        <div className="arcade-text arcade-text-yellow text-xs">CURRENT: {analysis.monthly_targets.current}</div>
                      </div>
                      <div className="arcade-card arcade-card-cyan p-3">
                        <div className="arcade-text text-xs">3 MONTHS: {analysis.monthly_targets.target_3_months}</div>
                      </div>
                      <div className="arcade-card arcade-card-green p-3">
                        <div className="arcade-text text-xs">1 YEAR: {analysis.monthly_targets.target_1_year}</div>
                      </div>
                    </div>
                  </div>

                  {/* Personalized Tips */}
                  <div className="arcade-dialog p-6">
                    <h3 className="arcade-h3 mb-4">PERSONALIZED TIPS</h3>
                    <div className="space-y-2">
                      {analysis.personalized_tips.map((tip: string, index: number) => (
                        <div key={index} className="arcade-card p-3">
                          <div className="arcade-text arcade-text-cyan text-xs">• {tip}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {!result && (
            <div className="arcade-dialog p-8 text-center">
              <Calculator className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h3 className="arcade-h3 mb-4">READY FOR ANALYSIS</h3>
              <p className="arcade-text arcade-text-cyan text-xs">COMPLETE THE FORM TO GET YOUR COMPREHENSIVE CARBON FOOTPRINT ANALYSIS</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}