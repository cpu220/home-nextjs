// 加载.env文件中的环境变量
require('dotenv').config();

const { spawn } = require('child_process');
const path = require('path');

// 获取PORT环境变量，如果不存在则使用默认值3002
const port = process.env.PORT || '3001';

console.log(`Starting Next.js server on port ${port}...`);

// 启动Next.js开发服务器
const nextProcess = spawn(
  path.resolve(__dirname, 'node_modules/.bin/next'),
  ['dev', '-p', port],
  {
    stdio: 'inherit',
    shell: true,
  }
);

// 监听进程退出事件
nextProcess.on('exit', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// 监听错误事件
nextProcess.on('error', (error) => {
  console.error('Error starting Next.js server:', error);
  process.exit(1);
});
