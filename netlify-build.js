import * as child_process from 'node:child_process';

// Log the start of the build process
console.log('Starting Netlify build...');

// Run the react-router build command
console.log('Running react-router build...');
try {
  child_process.execSync('react-router build', { stdio: 'inherit' });
  console.log('react-router build completed successfully');
} catch (error) {
  console.error('Error during react-router build:', error);
  process.exit(1);
}

// Run the netlify prepare script
console.log('Running netlify prepare script...');
try {
  // Import and run the prepare script
  await import('./netlify/prepare.js');
  console.log('netlify prepare script completed successfully');
} catch (error) {
  console.error('Error during netlify prepare script:', error);
  process.exit(1);
}

console.log('Build process completed successfully');