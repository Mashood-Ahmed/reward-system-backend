module.exports = {
  apps: [
    {
      name: 'reward_dev_server',
      script: './src/server.js',
      watch: true,
      ignore_watch: ['node_modules'],
      instances: 1,
      exec_mode: 'cluster',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      listen_timeout: 6000,
      max_restarts: 6,
    },
  ],
};
