module.exports = {
  apps: [
    {
      name: 'simulacion-api',
      script: 'app.js',
      instances: 1, // o 'max' para usar todos los cores disponibles
      exec_mode: 'cluster',
      autorestart: true,
      watch: false, // cambiar a true solo en desarrollo
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3001,
        watch: true,
        ignore_watch: ['node_modules', 'logs']
      },
      // Logging
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Reinicio automático en caso de errores
      min_uptime: '10s',
      max_restarts: 10,
      
      // Configuraciones adicionales
      kill_timeout: 3000,
      listen_timeout: 8000,
      
      // Variables de entorno (opcional, PM2 leerá el .env automáticamente)
      env_file: '.env'
    }
  ]
};