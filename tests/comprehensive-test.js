/**
 * Comprehensive test script for all mathematics diagram types
 * Tests every item from the mathematics-diagrams-list.md
 */

import MathDiagramEngine from '../src/engine/math-diagram-engine.js';
import logger from '../src/utils/logger.js';
import fs from 'fs';

const engine = new MathDiagramEngine({
  width: 800,
  height: 600,
  enableLogging: true
});

// Comprehensive test cases based on mathematics-diagrams-list.md
const comprehensiveTests = [
  // 1. Function Graphs
  {
    category: 'Function Graphs',
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
    category: 'Function Graphs',
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
    category: 'Function Graphs',
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
    category: 'Function Graphs',
    name: 'Polynomial Function (4th degree)',
    diagram: `math-function
type: polynomial
equation: "x^4 - 5*x^2 + 4"
range-x: [-3, 3]
range-y: [-5, 10]
color: "#ff00ff"
line-width: 2`
  },
  {
    category: 'Function Graphs',
    name: 'Rational Function',
    diagram: `math-function
type: rational
equation: "1/(x^2 + 1)"
range-x: [-5, 5]
range-y: [-0.5, 1.5]
color: "#00ffff"
line-width: 2`
  },
  {
    category: 'Function Graphs',
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
    category: 'Function Graphs',
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
    category: 'Function Graphs',
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
    category: 'Function Graphs',
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
    category: 'Function Graphs',
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
    category: 'Function Graphs',
    name: 'Arcsine Function',
    diagram: `math-function
type: inverse-trigonometric
equation: "asin(x)"
range-x: [-1, 1]
range-y: [-2, 2]
color: "#ffaa00"
line-width: 2`
  },
  {
    category: 'Function Graphs',
    name: 'Hyperbolic Sine',
    diagram: `math-function
type: hyperbolic
equation: "sinh(x)"
range-x: [-2, 2]
range-y: [-5, 5]
color: "#00aaff"
line-width: 2`
  },

  // 2. Coordinate Systems
  {
    category: 'Coordinate Systems',
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
    category: 'Coordinate Systems',
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
    category: 'Coordinate Systems',
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

  // 3. Geometric Shapes
  {
    category: 'Geometric Shapes',
    name: 'Point',
    diagram: `geometry-shape
type: point
coordinates: [{"x": 400, "y": 300}]
radius: 8
fill: true
fill-color: "#ff0000"`
  },
  {
    category: 'Geometric Shapes',
    name: 'Line',
    diagram: `geometry-shape
type: line
coordinates: [{"x": 100, "y": 100}, {"x": 700, "y": 500}]
stroke-color: "#0000ff"
stroke-width: 3`
  },
  {
    category: 'Geometric Shapes',
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
    category: 'Geometric Shapes',
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
    category: 'Geometric Shapes',
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
    category: 'Geometric Shapes',
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
    category: 'Geometric Shapes',
    name: 'Hexagon',
    diagram: `geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 150}, {"x": 480, "y": 200}, {"x": 480, "y": 300}, {"x": 400, "y": 350}, {"x": 320, "y": 300}, {"x": 320, "y": 200}]
fill: true
fill-color: "#ff8800"
stroke-color: "#000000"
stroke-width: 2`
  },

  // 4. Statistical Charts
  {
    category: 'Statistical Charts',
    name: 'Histogram',
    diagram: `statistics-chart
type: histogram
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
bins: 5
color: "#ff6600"
show-mean: true`
  },
  {
    category: 'Statistical Charts',
    name: 'Box Plot',
    diagram: `statistics-chart
type: box-plot
data: [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5]
color: "#0066cc"
show-mean: true
show-median: true`
  },
  {
    category: 'Statistical Charts',
    name: 'Scatter Plot',
    diagram: `statistics-chart
type: scatter
data: [{"x": 1, "y": 2}, {"x": 2, "y": 4}, {"x": 3, "y": 3}, {"x": 4, "y": 5}, {"x": 5, "y": 7}, {"x": 6, "y": 6}, {"x": 7, "y": 8}]
color: "#009900"`
  },
  {
    category: 'Statistical Charts',
    name: 'Line Chart',
    diagram: `statistics-chart
type: line-chart
data: [2, 5, 3, 8, 6, 9, 7, 12, 10, 15]
color: "#0066cc"`
  },
  {
    category: 'Statistical Charts',
    name: 'Bar Chart',
    diagram: `statistics-chart
type: bar-chart
data: [15, 25, 10, 30, 20, 35, 12, 28]
color: "#cc0066"`
  },
  {
    category: 'Statistical Charts',
    name: 'Pie Chart',
    diagram: `statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
color: "#ff6600"`
  },
  {
    category: 'Statistical Charts',
    name: 'Normal Distribution',
    diagram: `statistics-chart
type: normal-distribution
data: [3, 3.1, 3.2, 2.9, 3.3, 2.8, 3.1, 3.0, 2.9, 3.2]
color: "#0099ff"`
  },

  // 5. Advanced Mathematics (Basic implementations)
  {
    category: 'Advanced Mathematics',
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
    category: 'Advanced Mathematics',
    name: 'Contour Plot (Basic)',
    diagram: `contour-plot
type: level-curves
equation: "x^2 + y^2"
range-x: [-3, 3]
range-y: [-3, 3]
levels: 5
color: "#0066cc"`
  },

  // 6. Mathematical Proofs and Logic
  {
    category: 'Mathematical Proofs and Logic',
    name: 'Venn Diagram',
    diagram: `logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: "#ff6600"`
  },
  {
    category: 'Mathematical Proofs and Logic',
    name: 'Truth Table',
    diagram: `logic-diagram
type: truth-table
variables: ["p", "q"]
expression: "p AND q"
color: "#0066cc"`
  },

  // 7. Educational Mathematics
  {
    category: 'Educational Mathematics',
    name: 'Number Line',
    diagram: `educational-math
type: number-line
range: [-10, 10]
marks: 1
labels: true
color: "#000000"`
  },
  {
    category: 'Educational Mathematics',
    name: 'Fraction Bars',
    diagram: `educational-math
type: fraction-bars
fractions: ["1/2", "1/3", "3/4"]
color: "#009900"`
  }
];

async function runComprehensiveTests() {
  console.log('🧪 Running Comprehensive Mathematics Diagram Tests\n');
  console.log(`📊 Total test cases: ${comprehensiveTests.length}\n`);

  let totalTests = 0;
  let successfulTests = 0;
  let failedTests = 0;
  let totalTime = 0;
  const results = [];
  const categoryResults = {};

  // Group tests by category
  for (const test of comprehensiveTests) {
    if (!categoryResults[test.category]) {
      categoryResults[test.category] = { total: 0, successful: 0, failed: 0 };
    }
    categoryResults[test.category].total++;
  }

  // Run each test
  for (let i = 0; i < comprehensiveTests.length; i++) {
    const test = comprehensiveTests[i];
    totalTests++;
    
    console.log(`${i + 1}. ${test.name} (${test.category})`);
    
    try {
      const startTime = Date.now();
      const result = await engine.render(test.diagram);
      const renderTime = Date.now() - startTime;
      totalTime += renderTime;

      if (result.success) {
        console.log(`   ✅ Success (${renderTime}ms)`);
        successfulTests++;
        categoryResults[test.category].successful++;
        
        // Save image if in Node.js
        if (result.canvas && typeof window === 'undefined') {
          try {
            const buffer = result.canvas.toBuffer('image/png');
            const filename = `comprehensive-test-${test.name.toLowerCase().replace(/\s+/g, '-')}.png`;
            fs.writeFileSync(filename, buffer);
            console.log(`   💾 Saved as ${filename}`);
          } catch (error) {
            console.log(`   📝 Could not save file: ${error.message}`);
          }
        }
        
        results.push({
          name: test.name,
          category: test.category,
          success: true,
          renderTime,
          errors: []
        });
      } else {
        console.log(`   ❌ Failed: ${result.errors.join(', ')}`);
        failedTests++;
        categoryResults[test.category].failed++;
        
        results.push({
          name: test.name,
          category: test.category,
          success: false,
          renderTime,
          errors: result.errors
        });
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failedTests++;
      categoryResults[test.category].failed++;
      
      results.push({
        name: test.name,
        category: test.category,
        success: false,
        renderTime: 0,
        errors: [error.message]
      });
    }
    
    console.log('');
  }

  // Print comprehensive summary
  console.log('📊 Comprehensive Test Results');
  console.log('=====================================\n');
  
  console.log(`📈 Overall Summary:`);
  console.log(`   Total tests: ${totalTests}`);
  console.log(`   Successful: ${successfulTests} (${((successfulTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
  console.log(`   Average render time: ${Math.round(totalTime/totalTests)}ms`);
  console.log(`   Total render time: ${totalTime}ms\n`);

  console.log(`📋 Results by Category:`);
  for (const [category, stats] of Object.entries(categoryResults)) {
    const successRate = ((stats.successful/stats.total)*100).toFixed(1);
    console.log(`   ${category}:`);
    console.log(`     Total: ${stats.total}`);
    console.log(`     Successful: ${stats.successful} (${successRate}%)`);
    console.log(`     Failed: ${stats.failed}`);
  }
  console.log('');

  // Print failed tests details
  const failedResults = results.filter(r => !r.success);
  if (failedResults.length > 0) {
    console.log(`❌ Failed Tests Details:`);
    for (const failure of failedResults) {
      console.log(`   ${failure.name} (${failure.category}):`);
      for (const error of failure.errors) {
        console.log(`     - ${error}`);
      }
    }
    console.log('');
  }

  // Print successful tests details
  const successfulResults = results.filter(r => r.success);
  if (successfulResults.length > 0) {
    console.log(`✅ Successful Tests:`);
    for (const success of successfulResults) {
      console.log(`   ${success.name} (${success.category}) - ${success.renderTime}ms`);
    }
    console.log('');
  }

  // Engine statistics
  const stats = engine.getStats();
  console.log(`🔧 Engine Statistics:`);
  console.log(`   Version: ${stats.version}`);
  console.log(`   Supported types: ${stats.supportedTypes.length}`);
  console.log(`   Log entries: ${stats.logStats.totalLines}`);
  console.log(`   Errors in logs: ${stats.logStats.errorCount}`);
  console.log(`   Warnings in logs: ${stats.logStats.warnCount}\n`);

  // Save detailed results to JSON
  const detailedResults = {
    summary: {
      totalTests,
      successfulTests,
      failedTests,
      averageRenderTime: Math.round(totalTime/totalTests),
      totalRenderTime: totalTime,
      successRate: ((successfulTests/totalTests)*100).toFixed(1)
    },
    categoryResults,
    results,
    engineStats: stats,
    timestamp: new Date().toISOString()
  };

  try {
    fs.writeFileSync('comprehensive-test-results.json', JSON.stringify(detailedResults, null, 2));
    console.log(`💾 Detailed results saved to comprehensive-test-results.json`);
  } catch (error) {
    console.log(`📝 Could not save results file: ${error.message}`);
  }

  console.log('\n🎉 Comprehensive testing completed!');
  
  return detailedResults;
}

// Run the comprehensive tests
runComprehensiveTests().catch(console.error);
