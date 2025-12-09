#!/bin/bash

echo "开始测试Node.js 20.19.5和npm 10.8.2环境部署兼容性..."

# 定义日志函数
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 检查Node.js和npm版本
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
log "检测到环境: Node.js $NODE_VERSION, npm $NPM_VERSION"

# 验证package.json存在
if [ ! -f "package.json" ]; then
  log "错误: 未找到package.json文件"
  exit 1
fi

# 备份package.json
cp package.json package.json.test.bak

# 清理npm缓存
log "执行npm缓存清理"
npm cache clean --force || log "警告: 缓存清理非关键步骤，继续执行"

# 测试优化后的安装命令
log "测试使用优化参数安装依赖"
test_install() {
  log "测试安装命令: npm install --ignore-scripts --no-audit --prefer-offline --legacy-peer-deps"
  npm install --ignore-scripts --no-audit --prefer-offline --legacy-peer-deps --dry-run
  INSTALL_RESULT=$?
  
  if [ $INSTALL_RESULT -eq 0 ]; then
    log "✅ 安装命令测试成功"
    return 0
  else
    log "❌ 安装命令测试失败，退出码: $INSTALL_RESULT"
    return 1
  fi
}

# 测试优化后的构建命令
test_build() {
  log "测试构建命令: NODE_ENV=production NODE_OPTIONS=\"--max-old-space-size=4096\" npm run build --no-progress"
  NODE_ENV=production NODE_OPTIONS="--max-old-space-size=4096" npm run build --no-progress --dry-run
  BUILD_RESULT=$?
  
  if [ $BUILD_RESULT -eq 0 ]; then
    log "✅ 构建命令测试成功"
    return 0
  else
    log "❌ 构建命令测试失败，退出码: $BUILD_RESULT"
    return 1
  fi
}

# 执行测试
log "执行兼容性测试..."
test_install
INSTALL_SUCCESS=$?

test_build
BUILD_SUCCESS=$?

# 清理测试文件
rm -f package.json.test.bak

# 输出测试结果
log "测试完成"
if [ $INSTALL_SUCCESS -eq 0 ] && [ $BUILD_SUCCESS -eq 0 ]; then
  log "✅ 所有测试通过，当前环境与优化后的部署脚本兼容"
  exit 0
else
  log "❌ 测试失败，可能需要进一步调整部署脚本"
  exit 1
fi