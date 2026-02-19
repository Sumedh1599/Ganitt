/**
 * Web server for Math Diagram Engine
 * Provides HTTP API and web interface
 */

import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import MathDiagramEngine from '../engine/math-diagram-engine.js';
import Logger from '../utils/logger.js';

// Create logger instance
const logger = new Logger();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Initialize engine
const engine = new MathDiagramEngine({
  width: 800,
  height: 600,
  enableLogging: true
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/ganitt', express.static(path.join(__dirname, '../../ganitt'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/node_modules', express.static(path.join(__dirname, '../../../node_modules'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/src/engine', express.static(path.join(__dirname, '../engine'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/src/renderers', express.static(path.join(__dirname, '../renderers'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/src/parsers', express.static(path.join(__dirname, '../parsers'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/src/types', express.static(path.join(__dirname, '../types'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));
app.use('/src/utils', express.static(path.join(__dirname, '../utils'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// Serve the main web interface
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

/**
 * Render a diagram from text
 */
app.post('/api/render', async (req, res) => {
  try {
    const { diagramText, config } = req.body;
    
    if (!diagramText) {
      return res.status(400).json({
        success: false,
        error: 'diagramText is required'
      });
    }
    
    const renderEngine = config ? new MathDiagramEngine(config) : engine;
    const result = await renderEngine.render(diagramText);
    
    if (result.success) {
      // Convert canvas to base64 for web response
      const dataURL = result.canvas.toDataURL('image/png');
      
      res.json({
        success: true,
        imageData: dataURL,
        metadata: result.metadata,
        renderTime: result.metadata.renderTime
      });
    } else {
      res.status(400).json({
        success: false,
        errors: result.errors,
        warnings: result.warnings
      });
    }
    
  } catch (error) {
    logger.error('API render error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Validate diagram syntax
 */
app.post('/api/validate', (req, res) => {
  try {
    const { diagramText } = req.body;
    
    if (!diagramText) {
      return res.status(400).json({
        success: false,
        error: 'diagramText is required'
      });
    }
    
    const validation = engine.validate(diagramText);
    
    res.json({
      success: true,
      validation
    });
    
  } catch (error) {
    logger.error('API validate error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get supported diagram types
 */
app.get('/api/types', (req, res) => {
  try {
    const types = engine.getSupportedDiagramTypes();
    
    res.json({
      success: true,
      types
    });
    
  } catch (error) {
    logger.error('API types error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get diagram examples
 */
app.get('/api/examples', (req, res) => {
  try {
    const examples = engine.getExamples();
    
    res.json({
      success: true,
      examples
    });
    
  } catch (error) {
    logger.error('API examples error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get engine statistics
 */
app.get('/api/stats', (req, res) => {
  try {
    const stats = engine.getStats();
    
    res.json({
      success: true,
      stats
    });
    
  } catch (error) {
    logger.error('API stats error', { error: error.message });
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  logger.error('Unhandled error', { 
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(port, () => {
  logger.info(`Math Diagram Engine server started on port ${port}`);
  console.log(`🚀 Math Diagram Engine server running at http://localhost:${port}`);
  console.log(`📊 Web interface: http://localhost:${port}`);
  console.log(`🔧 API endpoints: http://localhost:${port}/api`);
  console.log(`📋 Health check: http://localhost:${port}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

export default app;
