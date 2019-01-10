module.exports = {
  apps : [{
    name: 'Smart Tap',
    script: 'index.js',
    args: '--tap=operate',
    env: {
      cwd: '/Users/landlessness/Documents/git/smart-tap/smart-tap'
    },
    env_production: {
      cwd: '/home/debian/git/smart-tap'
    }
  }]
};
