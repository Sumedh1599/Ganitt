# Math Diagram Component Usage

A Ganitt interactive math diagram component with auto-rendering and live preview.

## Features

- 🎨 **Auto-rendering** - See your diagram update as you type
- 📝 **Input/Output Tabs** - Clean separation between code and result
- 🎯 **Live Status** - Real-time rendering status indicator
- 💾 **Export Options** - Download image or copy to clipboard
- 🌙 **Theme Support** - Light and dark modes
- 📱 **Responsive** - Works on all screen sizes
- ⚡ **No Buttons Required** - Automatic rendering on input change

## Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>Math Diagram Demo</title>
</head>
<body>
    <!-- Container for the component -->
    <div id="my-diagram"></div>
    
    <!-- Load dependencies -->
    <script src="src/engine/math-diagram-engine.js"></script>
    <script src="src/components/math-diagram-component.js"></script>
    
    <script>
        // Initialize the component
        const component = new MathDiagramComponent('my-diagram', {
            title: 'My Math Diagram',
            width: 800,
            height: 600,
            autoRender: true,
            theme: 'light',
            initialContent: `math-function
type: linear
equation: 2*x + 3
range-x: [-5, 5]
range-y: [-5, 15]
color: '#0066cc'
title: 'Linear Function'`
        });
    </script>
</body>
</html>
```

### Advanced Usage

```javascript
// Create component with custom options
const component = new MathDiagramComponent('container-id', {
    title: 'Advanced Math Diagrams',
    width: 1000,
    height: 700,
    autoRender: true,
    theme: 'dark',
    initialContent: `statistics-chart
type: pie-chart
data: [30, 25, 20, 15, 10]
color: '#ff6600'
title: 'Pie Chart'
subtitle: 'Data distribution'`
});

// Programmatically set content
component.setInput(`geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: '#00ff00'
title: 'Circle'`);

// Get current input
const currentCode = component.getInput();

// Clear input
component.clearInput();

// Load random example
component.loadExample();

// Format code
component.formatCode();

// Download rendered image
component.downloadImage();

// Copy image to clipboard
component.copyCode();

// Toggle fullscreen
component.toggleFullscreen();
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | 'Math Diagram Engine' | Component title |
| `width` | number | 800 | Canvas width in pixels |
| `height` | number | 600 | Canvas height in pixels |
| `autoRender` | boolean | true | Auto-render on input change |
| `theme` | string | 'light' | Theme ('light' or 'dark') |
| `initialContent` | string | '' | Initial diagram code |

## Supported Diagram Types

### Mathematical Functions
```yaml
math-function
type: linear
equation: "2*x + 3"
range-x: [-5, 5]
range-y: [-5, 15]
color: '#0066cc'
title: 'Linear Function'
```

### Statistical Charts
```yaml
statistics-chart
type: line-chart
data: [10, 25, 30, 45, 20, 60, 35, 80]
color: '#0099ff'
title: 'Line Chart'
subtitle: 'Time series data'
```

### Geometry Shapes
```yaml
geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: '#00ff00'
stroke-color: '#000000'
stroke-width: 2
title: 'Circle'
```

### Logic Diagrams
```yaml
logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: '#ff6600'
title: 'Venn Diagram'
```

## Component Structure

```
┌─────────────────────────────────────┐
│ Title Bar              Status Ready │
├─────────────────────────────────────┤
│ [Input] [Output]                       │
├─────────────────────────────────────┤
│                                     │
│  Code Editor / Canvas Area          │
│                                     │
│  (Auto-rendering as you type)       │
│                                     │
└─────────────────────────────────────┘
```

## Styling

The component uses CSS variables for easy customization:

```css
.math-diagram-component {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background: #ffffff;
  --text-color: #1f2937;
  --border-color: #e1e5e9;
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Dependencies

- Math Diagram Engine
- Modern browser with Canvas API support
- ES6+ JavaScript features

## Examples

### Linear Function
```yaml
math-function
type: linear
equation: "2*x + 3"
range-x: [-5, 5]
range-y: [-5, 15]
color: '#0066cc'
title: 'Linear Function'
subtitle: 'f(x) = 2x + 3'
```

### Bar Chart
```yaml
statistics-chart
type: bar-chart
data: [15, 25, 10, 30, 20, 35, 12, 28]
color: '#cc0066'
title: 'Bar Chart'
subtitle: 'Categorical data comparison'
```

### Circle
```yaml
geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: '#00ff00'
stroke-color: '#000000'
stroke-width: 2
title: 'Circle'
subtitle: 'Circle with center (400,300)'
```

### Venn Diagram
```yaml
logic-diagram
type: venn
sets: 2
labels: ["A", "B"]
intersection: true
color: '#ff6600'
title: 'Venn Diagram'
subtitle: 'Set intersection visualization'
```

## Demo

Open `demo-component.html` in your browser to see the component in action with live examples and theme switching.
