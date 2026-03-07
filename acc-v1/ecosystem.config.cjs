module.exports = {
  apps: [
    {
      name: 'acc',
      script: 'dist/index.js',
      cwd: '/opt/onegodian/acc',
      exec_mode: 'fork',
      instances: 1,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    }
  ]
};
