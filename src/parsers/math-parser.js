/**
 * Mathematical expression parser and evaluator
 */

import logger from '../utils/logger.js';

// Simple math evaluation fallback
const fallbackMath = {
  evaluate: (expr) => {
    try {
      // Basic math evaluation for simple expressions
      return Function('"use strict"; return (' + expr + ')')();
    } catch (e) {
      logger.error('Math evaluation failed', { expression: expr, error: e.message });
      return expr;
    }
  }
};

// Try to use mathjs if available, otherwise fallback
let math = fallbackMath;

export class MathParser {
  constructor() {
    this.supportedFunctions = new Set([
      'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
      'sinh', 'cosh', 'tanh', 'log', 'log10', 'exp',
      'sqrt', 'abs', 'ceil', 'floor', 'round',
      'pow', 'mod', 'gcd', 'lcm', 'arcsin', 'arccos', 'arctan'
    ]);
    
    this.supportedConstants = new Set([
      'pi', 'e', 'tau', 'phi'
    ]);
  }

  /**
   * Parse and validate a mathematical expression
   */
  parseExpression(expression) {
    try {
      logger.debug('Parsing expression', { expression });
      
      // Clean and normalize the expression
      const cleanExpression = this.cleanExpression(expression);
      
      // Check for unsupported functions
      this.validateFunctions(cleanExpression);
      
      // Parse the expression
      const node = math.parse(cleanExpression);
      
      // Test evaluation with sample values
      this.testEvaluation(node);
      
      logger.info('Expression parsed successfully', { expression: cleanExpression });
      
      return {
        success: true,
        expression: cleanExpression,
        node: node,
        variables: this.extractVariables(node)
      };
    } catch (error) {
      logger.error('Expression parsing failed', { expression, error: error.message });
      return {
        success: false,
        error: error.message,
        expression
      };
    }
  }

  /**
   * Clean and normalize mathematical expression
   */
  cleanExpression(expression) {
    return expression
      .replace(/\s+/g, '') // Remove whitespace
      .replace(/\^/g, '**') // Convert ^ to ** for power
      .replace(/ln/g, 'log') // Convert ln to log
      .replace(/log10/g, 'log10') // Keep log10 as is
      .replace(/log\(/g, 'log10(') // Default log to base 10
      .replace(/asin/g, 'arcsin') // Convert asin to arcsin
      .replace(/acos/g, 'arccos') // Convert acos to arccos
      .replace(/atan/g, 'arctan') // Convert atan to arctan
      .replace(/arcsin/g, 'asin') // Convert arcsin to asin (mathjs)
      .replace(/arccos/g, 'acos') // Convert arccos to acos (mathjs)
      .replace(/arctan/g, 'atan') // Convert arctan to atan (mathjs)
      .replace(/sinh/g, 'sinh') // Keep sinh
      .replace(/cosh/g, 'cosh') // Keep cosh
      .replace(/tanh/g, 'tanh') // Keep tanh
      .toLowerCase();
  }

  /**
   * Validate that all functions in expression are supported
   */
  validateFunctions(expression) {
    const functionRegex = /\b([a-z]+)\s*\(/gi;
    let match;
    
    while ((match = functionRegex.exec(expression)) !== null) {
      const functionName = match[1].toLowerCase();
      if (!this.supportedFunctions.has(functionName)) {
        throw new Error(`Unsupported function: ${functionName}`);
      }
    }
  }

  /**
   * Test evaluation with sample values
   */
  testEvaluation(node) {
    const scope = { x: 1, y: 1, z: 1 };
    
    try {
      const result = node.evaluate(scope);
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Expression does not evaluate to a finite number');
      }
    } catch (error) {
      throw new Error(`Evaluation test failed: ${error.message}`);
    }
  }

  /**
   * Extract variables from expression node
   */
  extractVariables(node) {
    const variables = new Set();
    
    node.traverse((node) => {
      if (node.type === 'SymbolNode' && !this.supportedConstants.has(node.name)) {
        variables.add(node.name);
      }
    });
    
    return Array.from(variables);
  }

  /**
   * Evaluate expression with given variable values
   */
  evaluate(expression, variables = {}) {
    try {
      const scope = {
        pi: Math.PI,
        e: Math.E,
        tau: 2 * Math.PI,
        phi: (1 + Math.sqrt(5)) / 2,
        ...variables
      };
      
      const result = math.evaluate(expression, scope);
      
      if (typeof result !== 'number' || !isFinite(result)) {
        throw new Error('Expression does not evaluate to a finite number');
      }
      
      return result;
    } catch (error) {
      logger.error('Expression evaluation failed', { expression, variables, error: error.message });
      throw error;
    }
  }

  /**
   * Generate sample points for function plotting
   */
  generatePoints(expression, rangeX, samples = 100) {
    const parseResult = this.parseExpression(expression);
    
    if (!parseResult.success) {
      throw new Error(`Cannot parse expression: ${parseResult.error}`);
    }
    
    const points = [];
    const [xMin, xMax] = rangeX;
    const step = (xMax - xMin) / (samples - 1);
    
    for (let i = 0; i < samples; i++) {
      const x = xMin + i * step;
      
      try {
        const y = this.evaluate(expression, { x });
        
        if (isFinite(y)) {
          points.push({ x, y });
        }
      } catch (error) {
        // Skip points that can't be evaluated
        logger.debug('Skipping point due to evaluation error', { x, error: error.message });
      }
    }
    
    logger.debug('Generated points for function', {
      expression,
      pointsCount: points.length,
      rangeX,
      samples
    });
    
    return points;
  }

  /**
   * Generate points for parametric equations
   */
  generateParametricPoints(xExpression, yExpression, rangeT, samples = 100) {
    const xParseResult = this.parseExpression(xExpression);
    const yParseResult = this.parseExpression(yExpression);
    
    if (!xParseResult.success) {
      throw new Error(`Cannot parse x expression: ${xParseResult.error}`);
    }
    
    if (!yParseResult.success) {
      throw new Error(`Cannot parse y expression: ${yParseResult.error}`);
    }
    
    const points = [];
    const [tMin, tMax] = rangeT;
    const step = (tMax - tMin) / (samples - 1);
    
    for (let i = 0; i < samples; i++) {
      const t = tMin + i * step;
      
      try {
        const x = this.evaluate(xExpression, { t });
        const y = this.evaluate(yExpression, { t });
        
        if (isFinite(x) && isFinite(y)) {
          points.push({ x, y });
        }
      } catch (error) {
        logger.debug('Skipping parametric point due to evaluation error', { t, error: error.message });
      }
    }
    
    logger.debug('Generated parametric points', {
      xExpression,
      yExpression,
      pointsCount: points.length,
      rangeT,
      samples
    });
    
    return points;
  }

  /**
   * Generate points for polar equations
   */
  generatePolarPoints(rExpression, rangeTheta, samples = 100) {
    const parseResult = this.parseExpression(rExpression);
    
    if (!parseResult.success) {
      throw new Error(`Cannot parse r expression: ${parseResult.error}`);
    }
    
    const points = [];
    const [thetaMin, thetaMax] = rangeTheta;
    const step = (thetaMax - thetaMin) / (samples - 1);
    
    for (let i = 0; i < samples; i++) {
      const theta = thetaMin + i * step;
      
      try {
        const r = this.evaluate(rExpression, { theta });
        
        if (isFinite(r)) {
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          points.push({ x, y });
        }
      } catch (error) {
        logger.debug('Skipping polar point due to evaluation error', { theta, error: error.message });
      }
    }
    
    logger.debug('Generated polar points', {
      rExpression,
      pointsCount: points.length,
      rangeTheta,
      samples
    });
    
    return points;
  }
}

export default new MathParser();
