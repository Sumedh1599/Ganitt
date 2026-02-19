# Ganitt 🎨

**Ganitt - Interactive Math Diagram Component for Web Applications**

Create beautiful mathematical diagrams, graphs, charts, and figures with simple text-based definitions. Perfect for educational content, documentation, and interactive web applications.

## ✨ Features

- **📊 Mathematical Functions**: Linear, quadratic, cubic, exponential, logarithmic, trigonometric, and more
- **📐 Geometric Shapes**: Points, lines, circles, polygons, and custom shapes
- **📈 Statistical Charts**: Histograms, scatter plots, line charts, bar charts, pie charts
- **🗺️ Coordinate Systems**: Cartesian, polar, and parametric systems
- **🌐 Web Interface**: Interactive editor with real-time preview
- **⚡ High Performance**: Fast rendering with optimized canvas operations
- **📝 Comprehensive Logging**: Detailed error tracking and performance metrics
- **🔧 Node.js Integration**: Use in server-side applications
- **🎯 Easy Syntax**: Simple, intuitive text-based diagram definitions

## 🚀 Quick Start

### Installation

```bash
npm install ganitt
```

### Basic Usage

```javascript
import GanittComponent from './ganitt/ganitt-component.js';

// Create component
const component = new GanittComponent('my-container', {
  width: 800,
  height: 600,
  autoRender: true
});
```

### Running Demo

```bash
git clone https://github.com/Sumedh1599/Ganitt.git
cd Ganitt
npm install
npm start
```

Then open http://localhost:3001 in your browser!

## 📖 Usage Examples

### Mathematical Functions

#### Linear Function
```
math-function
type: linear
equation: "2*x + 3"
range-x: [-5, 5]
range-y: [-5, 15]
color: "#ff0000"
title: "Linear Function"
```

#### Exponential Function
```
math-function
type: exponential
equation: "exp(x)"
range-x: [-3, 3]
range-y: [0, 20]
color: "#ff8800"
title: "Exponential Function"
```

#### Logarithmic Function
```
math-function
type: logarithmic
equation: "log(x)"
range-x: [0.1, 10]
range-y: [-2, 2]
color: "#8800ff"
title: "Logarithmic Function"
```

### Geometric Shapes

#### Circle
```
geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 50
fill: true
fill-color: "#0088ff"
stroke-color: "#0000ff"
stroke-width: 2
title: "Circle"
```

#### Triangle
```
geometry-shape
type: polygon
coordinates: [{"x": 400, "y": 200}, {"x": 300, "y": 400}, {"x": 500, "y": 400}]
fill: true
fill-color: "#00ff88"
stroke-color: "#008800"
stroke-width: 2
title: "Triangle"
```

### Statistical Charts

#### Bar Chart
```
statistics-chart
type: bar-chart
data: [10, 25, 15, 30, 20]
labels: ["A", "B", "C", "D", "E"]
color: "#0088ff"
title: "Bar Chart"
```

#### Pie Chart
```
statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
labels: ["A", "B", "C", "D", "E"]
colors: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]
title: "Pie Chart"
```

## 🎨 Examples

### Logarithmic Function
![Logarithmic Function](../assets/Logarithmic%20function.png)

### Heatmap Visualization
![Heatmap](../assets/heatmap.png)

## 🌐 Live Demo

Try the interactive demo: **http://localhost:3001/ganitt/demo.html**

Features:
- **🎨 Real-time Rendering**: See your diagram update as you type
- **📝 Input/Output Tabs**: Clean separation between code and result
- **🎯 Live Status**: Real-time rendering status indicator
- **💾 Export Options**: Download image or copy to clipboard
- **🌙 Theme Support**: Light and dark modes
- **📱 Responsive**: Works on all screen sizes

## 🔧 API Integration

### RESTful API

```javascript
// Render diagram via API
const response = await fetch('/api/render', {
// POST /api/render
const response = await fetch('http://localhost:3000/api/render', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    diagramText: `
math-function
type: linear
equation: "x"
range-x: [-10, 10]
range-y: [-10, 10]
`
  })
});

const result = await response.json();
if (result.success) {
  const img = document.createElement('img');
  img.src = result.imageData;
  document.body.appendChild(img);
}
```

## 📊 Supported Diagram Types

### Mathematical Functions
- **Linear Functions**: `y = mx + b`
- **Quadratic Functions**: `y = ax² + bx + c`
- **Cubic Functions**: `y = ax³ + bx² + cx + d`
- **Polynomial Functions**: Higher degree polynomials
- **Exponential Functions**: `y = a^x`
- **Logarithmic Functions**: `y = log(x)`
- **Trigonometric Functions**: sin, cos, tan, etc.
- **Hyperbolic Functions**: sinh, cosh, tanh

### Geometric Shapes
- **Points**: Individual coordinates
- **Lines**: Connected points
- **Circles**: Center point + radius
- **Polygons**: Multiple vertices
- **Arcs**: Circular segments

### Statistical Charts
- **Histograms**: Frequency distributions
- **Scatter Plots**: Correlation visualization
- **Line Charts**: Time series data
- **Bar Charts**: Categorical data

### Coordinate Systems
- **Cartesian**: Standard x-y plane
- **Polar**: r-θ coordinates
- **Parametric**: x(t), y(t) functions

## 🎨 Customization Options

### Colors
- Hex colors: `"#ff0000"`
- RGB colors: `"rgb(255, 0, 0)"`
- Named colors: `"red"`

### Styling
- Line width: `line-width: 2`
- Fill colors: `fill-color: "#00ff00"`
- Stroke colors: `stroke-color: "#000000"`
- Font settings: `font-family: "Arial"`

### Ranges and Scaling
- X-axis range: `range-x: [-10, 10]`
- Y-axis range: `range-y: [-5, 15]`
- Grid spacing: `grid-spacing: 1`

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Run the demo with all diagram types:

```bash
npm run dev
```

## 📁 Project Structure

```
math-diagram-engine/
├── src/
│   ├── engine/           # Core rendering engine
│   ├── parsers/          # Text parsing and validation
│   ├── renderers/        # Canvas-based rendering
│   ├── utils/            # Logging and utilities
│   ├── types/            # Type definitions
│   ├── web/              # Web server and interface
│   └── index.js          # Main entry point
├── tests/                # Test suite
├── examples/             # Demo scripts
├── docs/                 # Documentation
├── logs/                 # Log files
└── assets/               # Static resources
```

## 🔍 Logging and Debugging

The engine includes comprehensive logging:

```javascript
import logger from './src/utils/logger.js';

// View log statistics
console.log(logger.getLogStats());

// Clear logs
logger.clearLogs();

// Custom logging
logger.info('Custom message', { data: 'value' });
logger.error('Error occurred', { error: 'details' });
```

Log files are stored in `logs/math-diagram-engine.log`.

## 🚀 Performance

- **Fast Rendering**: Optimized canvas operations
- **Efficient Parsing**: Quick text-to-object conversion
- **Memory Management**: Automatic cleanup
- **Batch Processing**: Support for multiple diagrams

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by **Mermaid.js** for text-based diagram syntax
- Uses **math.js** for mathematical expression parsing
- Canvas rendering based on **node-canvas** for Node.js compatibility
- UI/UX design inspired by modern web applications

## 📞 Support

- 📧 Issues: Report bugs on GitHub
- 📖 Documentation: Check the examples directory
- 🌐 Web Interface: http://localhost:3000
- 🔧 API Documentation: http://localhost:3000/api

---

**Built with ❤️ for mathematics enthusiasts and educators!**
