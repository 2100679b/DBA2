// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'simulacion-api',
      script: './daemon.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      listen_timeout: 3000,
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3001, // ← Cambiar a 3001
        DB_HOST: 'a2100679b.c3y80kgqitws.us-east-2.rds.amazonaws.com',
        DB_USER: 'postgres',
        DB_PASSWORD: 'postgres',
        DB_NAME: 'simulacion',
        DB_PORT: '5432',
        DB_SSL: 'true',
        JWT_SECRET: 'tu_super_secreto',
        FRONTEND_ORIGIN: 'https://protipweb.netlify.app'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      time: true
    }
  ]
};