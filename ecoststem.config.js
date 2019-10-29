module.exports = {
  apps: [
    {
      name: 'vue-music',
      script: './prod.server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
