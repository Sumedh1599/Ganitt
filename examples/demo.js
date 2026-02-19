/**
 * Demo script for Math Diagram Engine
 * Shows examples of all supported diagram types
 */

import MathDiagramEngine from '../src/engine/math-diagram-engine.js';
import fs from 'fs';
import path from 'path';

const engine = new MathDiagramEngine({
  width: 800,
  height: 600,
  enableLogging: true
});

async function runDemo() {
  console.log('🚀 Math Diagram Engine Demo\n');
  
  try {
    // Test all diagram types from our comprehensive list
    const testCases = [
      {
        name: 'Linear Function',
        diagram: `math-function
type: linear
equation: "2*x + 3"
range-x: [-10, 10]
range-y: [-10, 10]
color: "#ff0000"
line-width: 2`
      },
      {
        name: 'Quadratic Function',
        diagram: `math-function
type: quadratic
equation: "x^2 - 4*x + 3"
range-x: [-2, 6]
range-y: [-5, 15]
color: "#0000ff"
line-width: 2`
      },
      {
        name: 'Cubic Function',
        diagram: `math-function
type: cubic
equation: "x^3 - 3*x"
range-x: [-3, 3]
range-y: [-10, 10]
color: "#00ff00"
line-width: 2`
      },
      {
        name: 'Sine Wave',
        diagram: `math-function
type: trigonometric
equation: "sin(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#ff00ff"
line-width: 2`
      },
      {
        name: 'Cosine Wave',
        diagram: `math-function
type: trigonometric
equation: "cos(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#00ffff"
line-width: 2`
      },
      {
        name: 'Exponential Function',
        diagram: `math-function
type: exponential
equation: "exp(x)"
range-x: [-2, 2]
range-y: [-1, 10]
color: "#ff8800"
line-width: 2`
      },
      {
        name: 'Logarithmic Function',
        diagram: `math-function
type: logarithmic
equation: "log(x)"
range-x: [0.1, 10]
range-y: [-3, 3]
color: "#8800ff"
line-width: 2`
      },
      {
        name: 'Circle',
        diagram: `geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: "#ffcccc"
stroke-color: "#ff0000"
stroke-width: 3`
      },
      {
        name: 'Triangle',
        diagram: `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 200}, {"x": 300, "y": 400}, {"x": 500, "y": 400}]
fill: true
fill-color: "#ccffcc"
stroke-color: "#00ff00"
stroke-width: 2`
      },
      {
        name: 'Rectangle',
        diagram: `geometry-shape
type: polygon
coordinates: [{"x": 300, "y": 200}, {"x": 500, "y": 200}, {"x": 500, "y": 400}, {"x": 300, "y": 400}]
fill: true
fill-color: "#ccccff"
stroke-color: "#0000ff"
stroke-width: 2`
      },
      {
        name: 'Points',
        diagram: `geometry-shape
type: point
coordinates: [{"x": 200, "y": 200}, {"x": 400, "y": 300}, {"x": 600, "y": 400}, {"x": 300, "y": 500}]
radius: 8
fill: true
fill-color: "#ff00ff"`
      },
      {
        name: 'Histogram',
        diagram: `statistics-chart
type: histogram
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
bins: 5
color: "#ff6600"
show-mean: true`
      },
      {
        name: 'Scatter Plot',
        diagram: `statistics-chart
type: scatter
data: [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 3}, {"x": 4, "y": 5}, {"x": 5, "y": 7}, {"x": 6, "y": 6}, {"x": 7, "y": 8}]
color: "#009900"`
      },
      {
        name: 'Line Chart',
        diagram: `statistics-chart
type: line-chart
data: [2, 5, 3, 8, 6, 9, 7, 12, 10, 15]
color: "#0066cc"`
      },
      {
        name: 'Bar Chart',
        diagram: `statistics-chart
type: bar-chart
data: [15, 25, 10, 30, 20, 35, 12, 28]
color: "#cc0066"`
      },
      {
        name: 'Cartesian Coordinate System',
        diagram: `coordinate-system
type: cartesian
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true`
      }
    ];

    console.log(`Testing ${testCases.length} diagram types...\n`);

    let successCount = 0;
    let totalTime = 0;

    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`${i + 1}. ${testCase.name}`);
      
      try {
        const startTime = Date.now();
        const result = await engine.render(testCase.diagram);
        const renderTime = Date.now() - startTime;
        totalTime += renderTime;

        if (result.success) {
          console.log(`   ✅ Success (${renderTime}ms)`);
          
          // Save to file if canvas is available and we're in Node.js
          if (result.canvas && typeof window === 'undefined') {
            try {
              const buffer = result.canvas.toBuffer('image/png');
              const filename = `demo-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.png`;
              fs.writeFileSync(filename, buffer);
              console.log(`   💾 Saved as ${filename}`);
            } catch (error) {
              console.log(`   📝 Could not save file: ${error.message}`);
            }
          }
          
          successCount++;
        } else {
          console.log(`   ❌ Failed: ${result.errors.join(', ')}`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
      
      console.log('');
    }

    // Summary
    console.log('📊 Demo Summary');
    console.log(`Total diagrams tested: ${testCases.length}`);
    console.log(`Successful renders: ${successCount}`);
    console.log(`Failed renders: ${testCases.length - successCount}`);
    console.log(`Total render time: ${totalTime}ms`);
    console.log(`Average render time: ${Math.round(totalTime / testCases.length)}ms`);
    
    // Show engine stats
    const stats = engine.getStats();
    console.log('\n🔧 Engine Information');
    console.log(`Version: ${stats.version}`);
    console.log(`Supported types: ${stats.supportedTypes.join(', ')}`);
    console.log(`Log entries: ${stats.logStats.totalLines}`);
    
    if (stats.logStats.errorCount > 0) {
      console.log(`⚠️  Errors in logs: ${stats.logStats.errorCount}`);
    }
    
    if (stats.logStats.warnCount > 0) {
      console.log(`⚠️  Warnings in logs: ${stats.logStats.warnCount}`);
    }

    console.log('\n🎉 Demo completed!');

  } catch (error) {
    console.error('💥 Demo failed:', error.message);
    console.error(error.stack);
  }
}

// Run the demo
runDemo().catch(console.error);
