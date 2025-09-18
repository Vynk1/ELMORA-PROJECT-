import React, { useState } from 'react';
import FlowerGrowthWrapper from '../components/FlowerGrowthWrapper';

const FlowerDemo: React.FC = () => {
  const [selectedPercentage, setSelectedPercentage] = useState(0);
  const [renderMode, setRenderMode] = useState<'auto' | '3d' | 'svg'>('auto');

  const demoPercentages = [0, 15, 35, 55, 80, 100];

  const handleFlowerClick = () => {
    console.log(`🌸 Flower clicked at ${selectedPercentage}% completion!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-pink-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-800 mb-4">
            🌱 Flower Growth Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Interactive demonstration of the 3D Flower Growth component with multiple rendering modes and fallbacks
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/40">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Percentage Control */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Growth Percentage</h3>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedPercentage}
                  onChange={(e) => setSelectedPercentage(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center">
                  <span className="text-2xl font-bold text-green-600">{selectedPercentage}%</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {demoPercentages.map((percentage) => (
                    <button
                      key={percentage}
                      onClick={() => setSelectedPercentage(percentage)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        selectedPercentage === percentage
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {percentage}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Render Mode Control */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Render Mode</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {(['auto', '3d', 'svg'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setRenderMode(mode)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                        renderMode === mode
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {mode.toUpperCase()}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Auto:</strong> Smart fallback based on device capabilities<br />
                  <strong>3D:</strong> Three.js WebGL rendering<br />
                  <strong>SVG:</strong> Animated SVG with CSS transitions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Demo */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Demo */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/40">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Live Demo</h2>
            <div className="flex justify-center items-center min-h-[300px]">
              <FlowerGrowthWrapper
                percentage={selectedPercentage}
                onFlowerClick={handleFlowerClick}
                preferredMode={renderMode}
                showTooltip={true}
                className="transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-center">
                <div className="bg-gray-100 rounded-full px-6 py-2">
                  <span className="text-sm font-medium">
                    {selectedPercentage === 0 && "🌱 Seed Stage"}
                    {selectedPercentage > 0 && selectedPercentage <= 25 && "🌿 Sprouting"}
                    {selectedPercentage > 25 && selectedPercentage <= 50 && "🌱 Growing"}
                    {selectedPercentage > 50 && selectedPercentage <= 75 && "🌿 Developing"}
                    {selectedPercentage > 75 && selectedPercentage < 100 && "🌸 Blooming"}
                    {selectedPercentage === 100 && "🌺 Full Bloom!"}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Click the flower for interaction!</p>
            </div>
          </div>

          {/* Growth Stages */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/40">
            <h2 className="text-2xl font-medium text-gray-800 mb-6">Growth Stages</h2>
            <div className="space-y-6">
              {[
                { range: "0%", stage: "Seed", desc: "Ready to begin growth", icon: "🌱" },
                { range: "1-25%", stage: "Sprout", desc: "First signs of life", icon: "🌿" },
                { range: "26-50%", stage: "Small Plant", desc: "Developing leaves", icon: "🌱" },
                { range: "51-75%", stage: "Growing", desc: "Gaining height and strength", icon: "🌿" },
                { range: "76-99%", stage: "Blooming", desc: "Petals beginning to show", icon: "🌸" },
                { range: "100%", stage: "Full Bloom", desc: "Complete and beautiful!", icon: "🌺" }
              ].map((stage, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-4 p-4 rounded-2xl transition-colors ${
                    (selectedPercentage === 0 && stage.range === "0%") ||
                    (selectedPercentage > 0 && selectedPercentage <= 25 && stage.range === "1-25%") ||
                    (selectedPercentage > 25 && selectedPercentage <= 50 && stage.range === "26-50%") ||
                    (selectedPercentage > 50 && selectedPercentage <= 75 && stage.range === "51-75%") ||
                    (selectedPercentage > 75 && selectedPercentage < 100 && stage.range === "76-99%") ||
                    (selectedPercentage === 100 && stage.range === "100%")
                      ? 'bg-green-100 border-2 border-green-300'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="text-2xl">{stage.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{stage.stage}</div>
                    <div className="text-sm text-gray-600">{stage.desc}</div>
                  </div>
                  <div className="text-sm font-mono text-gray-500">
                    {stage.range}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/40">
          <h3 className="text-lg font-medium text-gray-800 mb-4">✨ Features & Capabilities</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">🎨 Rendering Modes</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• WebGL/Three.js 3D rendering</li>
                <li>• Animated SVG with CSS transitions</li>
                <li>• Automatic capability detection</li>
                <li>• Smart fallback system</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">♿ Accessibility</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Screen reader support</li>
                <li>• Keyboard navigation</li>
                <li>• Reduced motion detection</li>
                <li>• High contrast compatibility</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">📱 Compatibility</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Mobile and desktop responsive</li>
                <li>• Cross-browser support</li>
                <li>• Performance optimized</li>
                <li>• Graceful degradation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>This demo showcases the FlowerGrowthWrapper component with its multiple rendering modes and accessibility features.</p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default FlowerDemo;