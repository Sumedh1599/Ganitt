/**
 * Math Diagram Component - Ganitt Style
 * A self-contained component with title bar, input/output tabs, and auto-rendering
 */

class MathDiagramComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      title: options.title || 'Math Diagram Engine',
      width: options.width || 800,
      height: options.height || 600,
      autoRender: options.autoRender !== false,
      theme: options.theme || 'light',
      ...options
    };
    
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id '${containerId}' not found`);
    }
    
    this.currentTab = 'input';
    this.renderTimeout = null;
    this.engine = null;
    
    this.init();
  }
  
  async init() {
    // Initialize the math diagram engine
    if (typeof MathDiagramEngine !== 'undefined') {
      this.engine = new MathDiagramEngine();
    }
    
    this.render();
    this.bindEvents();
    
    // Set initial content if provided
    if (this.options.initialContent) {
      this.setInput(this.options.initialContent);
    }
  }
  
  render() {
    const theme = this.options.theme;
    const container = this.container;
    
    container.innerHTML = `
      <div class="math-diagram-component ${theme}">
        <!-- Title Bar -->
        <div class="title-bar">
          <h3 class="title">${this.options.title}</h3>
          <div class="title-controls">
            <span class="status-indicator" id="status-${this.containerId}">
              <span class="status-dot ready"></span>
              Ready
            </span>
          </div>
        </div>
        
        <!-- Tab Navigation -->
        <div class="tab-nav">
          <button class="tab-button active" data-tab="input" id="input-tab-${this.containerId}">
            <span class="tab-icon">📝</span>
            Input
          </button>
          <button class="tab-button" data-tab="output" id="output-tab-${this.containerId}">
            <span class="tab-icon">📊</span>
            Output
          </button>
        </div>
        
        <!-- Content Area -->
        <div class="content-area">
          <!-- Input Tab -->
          <div class="tab-content active" id="input-content-${this.containerId}">
            <div class="editor-container">
              <div class="editor-header">
                <span class="editor-label">Diagram Code</span>
                <div class="editor-actions">
                  <button class="action-button" onclick="component_${this.containerId}.formatCode()" title="Format Code">
                    <span class="action-icon">🎨</span>
                  </button>
                  <button class="action-button" onclick="component_${this.containerId}.clearInput()" title="Clear">
                    <span class="action-icon">🗑️</span>
                  </button>
                  <button class="action-button" onclick="component_${this.containerId}.loadExample()" title="Load Example">
                    <span class="action-icon">📋</span>
                  </button>
                </div>
              </div>
              <textarea 
                class="code-editor" 
                id="editor-${this.containerId}"
                placeholder="Enter your diagram code here...

Example:
math-function
type: linear
equation: 2*x + 3
range-x: [-5, 5]
range-y: [-5, 15]
color: '#0066cc'
title: 'Linear Function'
subtitle: 'f(x) = 2x + 3'"
                spellcheck="false"
              ></textarea>
              <div class="editor-footer">
                <span class="line-count" id="line-count-${this.containerId}">Line 1, Col 1</span>
                <span class="char-count" id="char-count-${this.containerId}">0 characters</span>
              </div>
            </div>
          </div>
          
          <!-- Output Tab -->
          <div class="tab-content" id="output-content-${this.containerId}">
            <div class="output-container">
              <div class="output-header">
                <span class="output-label">Rendered Diagram</span>
                <div class="output-actions">
                  <button class="action-button" onclick="component_${this.containerId}.downloadImage()" title="Download Image">
                    <span class="action-icon">💾</span>
                  </button>
                  <button class="action-button" onclick="component_${this.containerId}.copyCode()" title="Copy Image">
                    <span class="action-icon">📋</span>
                  </button>
                  <button class="action-button" onclick="component_${this.containerId}.toggleFullscreen()" title="Fullscreen">
                    <span class="action-icon">⛶</span>
                  </button>
                </div>
              </div>
              <div class="canvas-container" id="canvas-container-${this.containerId}">
                <canvas 
                  id="canvas-${this.containerId}" 
                  width="${this.options.width}" 
                  height="${this.options.height}"
                ></canvas>
                <div class="placeholder" id="placeholder-${this.containerId}">
                  <div class="placeholder-content">
                    <span class="placeholder-icon">📊</span>
                    <p>Your diagram will appear here</p>
                    <p class="placeholder-hint">Start typing in the Input tab to see the magic happen!</p>
                  </div>
                </div>
              </div>
              <div class="output-footer">
                <span class="render-info" id="render-info-${this.containerId}"></span>
                <span class="error-message" id="error-message-${this.containerId}"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Store component reference globally for button callbacks
    window[`component_${this.containerId}`] = this;
    
    // Apply styles
    this.applyStyles();
  }
  
  applyStyles() {
    const styleId = `math-diagram-component-styles-${this.containerId}`;
    
    if (document.getElementById(styleId)) {
      return; // Styles already applied
    }
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .math-diagram-component {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        border: 1px solid #e1e5e9;
        border-radius: 8px;
        overflow: hidden;
        background: #ffffff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .math-diagram-component.dark {
        background: #1a1a1a;
        border-color: #333;
        color: #ffffff;
      }
      
      /* Title Bar */
      .title-bar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .dark .title-bar {
        background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
      }
      
      .title {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
      
      .title-controls {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      
      .status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        opacity: 0.8;
      }
      
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4ade80;
        animation: pulse 2s infinite;
      }
      
      .status-dot.rendering {
        background: #fbbf24;
        animation: pulse 1s infinite;
      }
      
      .status-dot.error {
        background: #f87171;
        animation: none;
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      /* Tab Navigation */
      .tab-nav {
        display: flex;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .dark .tab-nav {
        background: #2d3748;
        border-color: #4a5568;
      }
      
      .tab-button {
        flex: 1;
        padding: 12px 20px;
        border: none;
        background: transparent;
        color: #64748b;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        border-bottom: 2px solid transparent;
      }
      
      .dark .tab-button {
        color: #a0aec0;
      }
      
      .tab-button:hover {
        background: rgba(100, 116, 139, 0.1);
        color: #334155;
      }
      
      .dark .tab-button:hover {
        background: rgba(160, 174, 192, 0.1);
        color: #e2e8f0;
      }
      
      .tab-button.active {
        background: transparent;
        color: #667eea;
        border-bottom-color: #667eea;
      }
      
      .dark .tab-button.active {
        color: #a78bfa;
        border-bottom-color: #a78bfa;
      }
      
      .tab-icon {
        font-size: 16px;
      }
      
      /* Content Area */
      .content-area {
        height: 600px;
        position: relative;
      }
      
      .tab-content {
        display: none;
        height: 100%;
      }
      
      .tab-content.active {
        display: block;
      }
      
      /* Editor Container */
      .editor-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .editor-header {
        padding: 12px 20px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .dark .editor-header {
        background: #2d3748;
        border-color: #4a5568;
      }
      
      .editor-label {
        font-weight: 500;
        color: #374151;
      }
      
      .dark .editor-label {
        color: #e2e8f0;
      }
      
      .editor-actions {
        display: flex;
        gap: 8px;
      }
      
      .action-button {
        padding: 6px 8px;
        border: 1px solid #e2e8f0;
        background: white;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      
      .dark .action-button {
        background: #374151;
        border-color: #4b5563;
        color: #e2e8f0;
      }
      
      .action-button:hover {
        background: #f3f4f6;
        border-color: #d1d5db;
      }
      
      .dark .action-button:hover {
        background: #4b5563;
        border-color: #6b7280;
      }
      
      .action-icon {
        font-size: 14px;
      }
      
      .code-editor {
        flex: 1;
        padding: 20px;
        border: none;
        outline: none;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.5;
        resize: none;
        background: #ffffff;
        color: #1f2937;
      }
      
      .dark .code-editor {
        background: #1f2937;
        color: #e2e8f0;
      }
      
      .editor-footer {
        padding: 8px 20px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: #6b7280;
      }
      
      .dark .editor-footer {
        background: #2d3748;
        border-color: #4a5568;
        color: #9ca3af;
      }
      
      /* Output Container */
      .output-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .output-header {
        padding: 12px 20px;
        background: #f8fafc;
        border-bottom: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .dark .output-header {
        background: #2d3748;
        border-color: #4a5568;
      }
      
      .output-label {
        font-weight: 500;
        color: #374151;
      }
      
      .dark .output-label {
        color: #e2e8f0;
      }
      
      .output-actions {
        display: flex;
        gap: 8px;
      }
      
      .canvas-container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
        position: relative;
        overflow: hidden;
      }
      
      .dark .canvas-container {
        background: #111827;
      }
      
      .canvas-container canvas {
        max-width: 100%;
        max-height: 100%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      
      .placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        color: #9ca3af;
      }
      
      .placeholder-content {
        max-width: 300px;
      }
      
      .placeholder-icon {
        font-size: 48px;
        display: block;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      
      .placeholder p {
        margin: 8px 0;
        font-size: 14px;
      }
      
      .placeholder-hint {
        font-size: 12px;
        opacity: 0.7;
      }
      
      .output-footer {
        padding: 8px 20px;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        display: flex;
        justify-content: space-between;
        font-size: 12px;
      }
      
      .dark .output-footer {
        background: #2d3748;
        border-color: #4a5568;
      }
      
      .render-info {
        color: #059669;
        font-weight: 500;
      }
      
      .error-message {
        color: #dc2626;
        font-weight: 500;
      }
      
      /* Responsive Design */
      @media (max-width: 768px) {
        .content-area {
          height: 500px;
        }
        
        .tab-button {
          font-size: 12px;
          padding: 10px 12px;
        }
        
        .code-editor {
          font-size: 12px;
          padding: 15px;
        }
        
        .title {
          font-size: 14px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  bindEvents() {
    // Tab switching
    const tabButtons = this.container.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        this.switchTab(tab);
      });
    });
    
    // Auto-render on input change
    if (this.options.autoRender) {
      const editor = this.container.querySelector('.code-editor');
      editor.addEventListener('input', (e) => {
        this.onInputChange(e);
      });
      
      editor.addEventListener('keyup', (e) => {
        this.updateCursorInfo(e);
      });
    }
  }
  
  switchTab(tab) {
    // Update tab buttons
    const tabButtons = this.container.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.tab === tab);
    });
    
    // Update tab content
    const tabContents = this.container.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `${tab}-content-${this.containerId}`);
    });
    
    this.currentTab = tab;
    
    // Auto-render when switching to output tab
    if (tab === 'output' && this.options.autoRender) {
      this.renderDiagram();
    }
  }
  
  onInputChange(e) {
    // Clear previous timeout
    if (this.renderTimeout) {
      clearTimeout(this.renderTimeout);
    }
    
    // Update character count
    this.updateCharCount(e.target.value);
    
    // Set new timeout for auto-render (debounced)
    this.renderTimeout = setTimeout(() => {
      if (this.options.autoRender) {
        this.renderDiagram();
      }
    }, 500); // 500ms debounce
  }
  
  updateCursorInfo(e) {
    const textarea = e.target;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart;
    
    // Calculate line and column
    const lines = text.substring(0, cursorPos).split('\n');
    const line = lines.length;
    const col = lines[lines.length - 1].length + 1;
    
    const lineCount = this.container.querySelector(`#line-count-${this.containerId}`);
    if (lineCount) {
      lineCount.textContent = `Line ${line}, Col ${col}`;
    }
  }
  
  updateCharCount(text) {
    const charCount = this.container.querySelector(`#char-count-${this.containerId}`);
    if (charCount) {
      charCount.textContent = `${text.length} characters`;
    }
  }
  
  async renderDiagram() {
    if (!this.engine) {
      console.warn('Math diagram engine not available');
      return;
    }
    
    const input = this.getInput();
    if (!input.trim()) {
      this.showPlaceholder();
      return;
    }
    
    this.updateStatus('rendering');
    this.hideError();
    
    try {
      const startTime = performance.now();
      const result = await this.engine.render(input);
      const endTime = performance.now();
      
      if (result.success) {
        this.displayResult(result, endTime - startTime);
        this.updateStatus('ready');
      } else {
        this.showError(result.errors || ['Unknown error']);
        this.updateStatus('error');
      }
    } catch (error) {
      this.showError([error.message]);
      this.updateStatus('error');
    }
  }
  
  displayResult(result, renderTime) {
    const canvas = this.container.querySelector(`#canvas-${this.containerId}`);
    const placeholder = this.container.querySelector(`#placeholder-${this.containerId}`);
    const renderInfo = this.container.querySelector(`#render-info-${this.containerId}`);
    
    if (result.imageData) {
      // Display the rendered image
      canvas.style.display = 'block';
      placeholder.style.display = 'none';
      
      // Create image from base64 data
      const img = new Image();
      img.onload = () => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = result.imageData;
      
      // Update render info
      if (renderInfo) {
        renderInfo.textContent = `Rendered in ${Math.round(renderTime)}ms | ${result.metadata.dimensions.width}×${result.metadata.dimensions.height}`;
      }
    }
  }
  
  showPlaceholder() {
    const canvas = this.container.querySelector(`#canvas-${this.containerId}`);
    const placeholder = this.container.querySelector(`#placeholder-${this.containerId}`);
    
    canvas.style.display = 'none';
    placeholder.style.display = 'flex';
  }
  
  showError(errors) {
    const errorElement = this.container.querySelector(`#error-message-${this.containerId}`);
    if (errorElement) {
      errorElement.textContent = errors.join(', ');
    }
  }
  
  hideError() {
    const errorElement = this.container.querySelector(`#error-message-${this.containerId}`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }
  
  updateStatus(status) {
    const statusIndicator = this.container.querySelector(`#status-${this.containerId}`);
    const statusDot = statusIndicator.querySelector('.status-dot');
    
    statusDot.className = `status-dot ${status}`;
    
    const statusText = {
      'ready': 'Ready',
      'rendering': 'Rendering...',
      'error': 'Error'
    };
    
    statusIndicator.lastChild.textContent = statusText[status] || 'Unknown';
  }
  
  // Public API methods
  getInput() {
    const editor = this.container.querySelector('.code-editor');
    return editor ? editor.value : '';
  }
  
  setInput(content) {
    const editor = this.container.querySelector('.code-editor');
    if (editor) {
      editor.value = content;
      this.updateCharCount(content);
      if (this.options.autoRender) {
        this.renderDiagram();
      }
    }
  }
  
  clearInput() {
    this.setInput('');
    this.showPlaceholder();
  }
  
  formatCode() {
    const input = this.getInput();
    // Simple formatting - can be enhanced
    const formatted = input
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n');
    
    this.setInput(formatted);
  }
  
  async loadExample() {
    const examples = [
      `math-function
type: linear
equation: 2*x + 3
range-x: [-5, 5]
range-y: [-5, 15]
color: '#0066cc'
title: 'Linear Function'
subtitle: 'f(x) = 2x + 3'`,
      `statistics-chart
type: line-chart
data: [10, 25, 30, 45, 20, 60, 35, 80]
color: '#0099ff'
title: 'Line Chart'
subtitle: 'Time series data'`,
      `geometry-shape
type: circle
coordinates: [{"x": 400, "y": 300}]
radius: 80
fill: true
fill-color: '#00ff00'
stroke-color: '#000000'
stroke-width: 2
title: 'Circle'
subtitle: 'Circle with center (400,300) and radius 80'`
    ];
    
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    this.setInput(randomExample);
  }
  
  downloadImage() {
    const canvas = this.container.querySelector(`#canvas-${this.containerId}`);
    if (canvas && canvas.style.display !== 'none') {
      const link = document.createElement('a');
      link.download = 'math-diagram.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  }
  
  async copyCode() {
    const canvas = this.container.querySelector(`#canvas-${this.containerId}`);
    if (canvas && canvas.style.display !== 'none') {
      try {
        const blob = await new Promise(resolve => canvas.toBlob(resolve));
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        
        // Show temporary success message
        const renderInfo = this.container.querySelector(`#render-info-${this.containerId}`);
        const originalText = renderInfo.textContent;
        renderInfo.textContent = 'Image copied to clipboard!';
        setTimeout(() => {
          renderInfo.textContent = originalText;
        }, 2000);
      } catch (error) {
        console.error('Failed to copy image:', error);
      }
    }
  }
  
  toggleFullscreen() {
    const canvasContainer = this.container.querySelector('.canvas-container');
    if (!document.fullscreenElement) {
      canvasContainer.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MathDiagramComponent;
} else if (typeof window !== 'undefined') {
  window.MathDiagramComponent = MathDiagramComponent;
}
