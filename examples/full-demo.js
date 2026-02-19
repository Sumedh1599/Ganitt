/**
 * Full Demo Script - ALL 35 Mathematics Diagram Types
 * Tests every item from the mathematics-diagrams-list.md
 */

import MathDiagramEngine from '../src/engine/math-diagram-engine.js';
import fs from 'fs';

const engine = new MathDiagramEngine({
  width: 800,
  height: 600,
  enableLogging: true
});

async function runFullDemo() {
  console.log('🎨 Full Math Diagram Engine Demo - ALL 35 Types\n');
  
  try {
    // ALL 35 DIAGRAM TYPES FROM THE LIST
    
    const testCases = [
      // 1. Function Graphs (12 types)
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
equation: "x**2 - 4*x + 3"
range-x: [-2, 6]
range-y: [-5, 15]
color: "#0000ff"
line-width: 2`
      },
      {
        name: 'Cubic Function',
        diagram: `math-function
type: cubic
equation: "x**3 - 3*x"
range-x: [-3, 3]
range-y: [-10, 10]
color: "#00ff00"
line-width: 2`
      },
      {
        name: 'Polynomial Function (4th degree)',
        diagram: `math-function
type: polynomial
equation: "x**4 - 5*x**2 + 4"
range-x: [-3, 3]
range-y: [-5, 10]
color: "#ff00ff"
line-width: 2`
      },
      {
        name: 'Rational Function',
        diagram: `math-function
type: rational
equation: "1/(x**2 + 1)"
range-x: [-5, 5]
range-y: [-0.5, 1.5]
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
        name: 'Sine Function',
        diagram: `math-function
type: trigonometric
equation: "sin(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#ff0088"
line-width: 2`
      },
      {
        name: 'Cosine Function',
        diagram: `math-function
type: trigonometric
equation: "cos(x)"
range-x: [0, 6.28]
range-y: [-1.5, 1.5]
color: "#00ff88"
line-width: 2`
      },
      {
        name: 'Tangent Function',
        diagram: `math-function
type: trigonometric
equation: "tan(x)"
range-x: [-3, 3]
range-y: [-5, 5]
color: "#8800ff"
line-width: 2`
      },
      {
        name: 'Arcsine Function',
        diagram: `math-function
type: trigonometric
equation: "asin(x)"
range-x: [-1, 1]
range-y: [-2, 2]
color: "#ffaa00"
line-width: 2`
      },
      {
        name: 'Hyperbolic Sine',
        diagram: `math-function
type: hyperbolic
equation: "sinh(x)"
range-x: [-2, 2]
range-y: [-5, 5]
color: "#00aaff"
line-width: 2`
      },

      // 2. Coordinate Systems (3 types)
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
      },
      {
        name: 'Polar Coordinate System',
        diagram: `coordinate-system
type: polar
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true`
      },
      {
        name: 'Parametric Equations',
        diagram: `coordinate-system
type: parametric
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
show-grid: true
show-axes: true
show-labels: true`
      },

      // 3. Geometric Shapes (7 types)
      {
        name: 'Point',
        diagram: `geometry-shape
type: point
coordinates: [{"x": 400, "y": 300}]
radius: 8
fill: true
fill-color: "#ff0000"`
      },
      {
        name: 'Line',
        diagram: `geometry-shape
type: line
coordinates: [{"x": 100, "y": 100}, {"x": 700, "y": 500}]
stroke-color: "#0000ff"
stroke-width: 3`
      },
      {
        name: 'Circle',
        diagram: `geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: "#00ff00"
stroke-color: "#000000"
stroke-width: 2`
      },
      {
        name: 'Triangle',
        diagram: `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 200}, {"x": 300, "y": 400}, {"x": 500, "y": 400}]
fill: true
fill-color: "#ff00ff"
stroke-color: "#000000"
stroke-width: 2`
      },
      {
        name: 'Rectangle',
        diagram: `geometry-shape
type: polygon
coordinates: [{"x": 300, "y": 200}, {"x": 500, "y": 200}, {"x": 500, "y": 400}, {"x": 300, "y": 400}]
fill: true
fill-color: "#00ffff"
stroke-color: "#000000"
stroke-width: 2`
      },
      {
        name: 'Pentagon',
        diagram: `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 500, "y": 250}, {"x": 450, "y": 380}, {"x": 350, "y": 380}, {"x": 300, "y": 250}]
fill: true
fill-color: "#ffff00"
stroke-color: "#000000"
stroke-width: 2`
      },
      {
        name: 'Hexagon',
        diagram: `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 480, "y": 200}, {"x": 480, "y": 300}, {"x": 400, "y": 350}, {"x": 320, "y": 300}, {"x": 320, "y": 200}]
fill: true
fill-color: "#ff8800"
stroke-color: "#000000"
stroke-width: 2`
      },

      // 4. Statistical Charts (7 types)
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
        name: 'Box Plot',
        diagram: `statistics-chart
type: box-plot
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
color: "#0066cc"
show-mean: true
show-median: true`
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
        name: 'Pie Chart',
        diagram: `statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
color: "#ff6600"`
      },
      {
        name: 'Normal Distribution',
        diagram: `statistics-chart
type: normal-distribution
data: [3, 3.1, 3.2, 2.9, 3.3, 2.8, 3.1, 3.0, 2.9, 3.2]
color: "#0099ff"`
      },

      // 5. Advanced Mathematics (2 types)
      {
        name: 'Vector Field (Basic)',
        diagram: `vector-field
type: 2d-vector
equation-x: "-y"
equation-y: "x"
range-x: [-5, 5]
range-y: [-5, 5]
grid-spacing: 1
color: "#ff0000"`
      },
      {
        name: 'Contour Plot (Basic)',
        diagram: `contour-plot
type: level-curves
equation: "x**2 + y**2"
range-x: [-3, 3]
range-y: [-3, 3]
levels: 5
color: "#0066cc"`
      },

      // 6. Mathematical Proofs and Logic (2 types)
      {
        name: 'Venn Diagram',
        diagram: `logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: "#ff6600"`
      },
      {
        name: 'Truth Table',
        diagram: `logic-diagram
type: truth-table
variables: ["p", "q"]
expression: "p AND q"
color: "#0066cc"`
      },

      // 7. Educational Mathematics (2 types)
      {
        name: 'Number Line',
        diagram: `educational-math
type: number-line
range: [-10, 10]
marks: 1
labels: true
color: "#000000"`
      },
      {
        name: 'Fraction Bars',
        diagram: `educational-math
type: fraction-bars
fractions: ["1/2", "1/3", "3/4"]
color: "#009900"`
      }
    ];

    console.log(`📊 Testing ${testCases.length} diagram types...\n`);

    let successCount = 0;
    let totalTime = 0;
    const results = [];

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
              const filename = `full-demo-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.png`;
              fs.writeFileSync(filename, buffer);
              console.log(`   💾 Saved as ${filename}`);
            } catch (error) {
              console.log(`   📝 Could not save file: ${error.message}`);
            }
          }
          
          successCount++;
          results.push({ name: testCase.name, success: true, renderTime });
        } else {
          console.log(`   ❌ Failed: ${result.errors.join(', ')}`);
          results.push({ name: testCase.name, success: false, errors: result.errors });
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        results.push({ name: testCase.name, success: false, errors: [error.message] });
      }
      
      console.log('');
    }

    // Summary
    console.log('📊 Full Demo Summary');
    console.log('=====================================');
    console.log(`Total diagrams tested: ${testCases.length}`);
    console.log(`Successful renders: ${successCount}`);
    console.log(`Failed renders: ${testCases.length - successCount}`);
    console.log(`Total render time: ${totalTime}ms`);
    console.log(`Average render time: ${Math.round(totalTime / testCases.length)}ms`);
    console.log(`Success rate: ${((successCount / testCases.length) * 100).toFixed(1)}%`);
    
    // Show engine stats
    const stats = engine.getStats();
    console.log('\n🔧 Engine Information');
    console.log(`Version: ${stats.version}`);
    console.log(`Supported types: ${stats.supportedTypes.join(', ')}`);
    console.log(`Log entries: ${stats.logStats.totalLines}`);
    
    if (stats.logStats.errorCount > 0) {
      console.log(`⚠️  Errors in logs: ${stats.logStats.errorCount}`);
    }
    
    // Show successful tests by category
    console.log('\n✅ Successfully Tested:');
    const categories = {
      'Function Graphs': results.filter(r => r.name.includes('Function')).length,
      'Coordinate Systems': results.filter(r => r.name.includes('Coordinate')).length,
      'Geometric Shapes': results.filter(r => ['Point', 'Line', 'Circle', 'Triangle', 'Rectangle', 'Pentagon', 'Hexagon'].some(shape => r.name.includes(shape))).length,
      'Statistical Charts': results.filter(r => r.name.includes('Chart') || r.name.includes('Histogram') || r.name.includes('Plot') || r.name.includes('Distribution')).length,
      'Advanced Mathematics': results.filter(r => r.name.includes('Vector') || r.name.includes('Contour')).length,
      'Mathematical Logic': results.filter(r => r.name.includes('Venn') || r.name.includes('Truth')).length,
      'Educational Mathematics': results.filter(r => r.name.includes('Number') || r.name.includes('Fraction')).length
    };
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}`);
    });

    console.log('\n🎉 Full demo completed! All 35 diagram types tested.');
    
    return results;

  } catch (error) {
    console.error('💥 Demo failed:', error.message);
    console.error(error.stack);
  }
}

// Run the full demo
runFullDemo().catch(console.error);
