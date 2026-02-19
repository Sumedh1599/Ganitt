/**
 * Test Node.js Diagram Component
 */

import NodeDiagramComponent from './src/components/node-diagram-component.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testComponent() {
  console.log('🚀 Testing Node.js Diagram Component...\n');
  
  try {
    // Initialize component
    const component = new NodeDiagramComponent({
      width: 800,
      height: 600
    });
    
    console.log('✅ Component initialized');
    
    // Test 1: Get supported types
    console.log('\n📋 Supported types:', component.getSupportedTypes());
    
    // Test 2: Validate diagram
    const diagramText = component.getExamples().linear;
    console.log('\n🔍 Validating diagram...');
    const validation = component.validate(diagramText);
    console.log('Validation result:', validation);
    
    // Test 3: Render diagram
    console.log('\n🎨 Rendering diagram...');
    const renderResult = await component.render(diagramText);
    console.log('Render success:', renderResult.success);
    console.log('Render result keys:', Object.keys(renderResult));
    console.log('Render time:', renderResult.renderTime, 'ms');
    
    // Test 4: Save to file
    console.log('\n💾 Saving to file...');
    const outputPath = path.join(__dirname, 'test-output.png');
    const saveResult = await component.saveToFile(diagramText, outputPath);
    console.log('Saved to:', saveResult.filePath);
    console.log('File size:', (await fs.stat(outputPath)).size, 'bytes');
    
    // Test 5: Get buffer
    console.log('\n📦 Getting buffer...');
    const buffer = await component.getBuffer(diagramText);
    console.log('Buffer size:', buffer.length, 'bytes');
    
    // Test 6: Different diagram types
    console.log('\n🎯 Testing different diagram types...');
    
    for (const [name, example] of Object.entries(component.getExamples())) {
      console.log(`\n  Testing ${name}...`);
      const result = await component.render(example);
      console.log(`  ${name}: ${result.success ? '✅' : '❌'}`);
      if (!result.success) {
        console.log(`  Error: ${result.error}`);
      }
    }
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run tests
testComponent();
