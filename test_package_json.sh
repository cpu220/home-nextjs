#!/bin/bash

echo "开始测试package.json处理逻辑..."

# 确保当前目录有package.json
if [ -f "package.json" ]; then
  echo "检测到package.json"
  
  # 备份package.json（修复后的方法）
  cp package.json package.json.bak
  echo "已备份package.json"
  
  # 模拟npm安装（使用--dry-run避免实际安装）
  echo "执行npm install --dry-run --ignore-scripts..."
  npm install --dry-run --ignore-scripts || {
    echo "npm install测试失败"
    
    # 验证package.json是否仍有效
    echo "验证package.json格式..."
    if ! npm pkg verify; then
      echo "错误: package.json格式无效"
      # 恢复备份文件
      mv package.json.bak package.json
      echo "已从备份恢复package.json"
      exit 1
    fi
  }
  
  # 清理备份
  rm -f package.json.bak
  echo "测试完成，所有操作正常"
  exit 0
else
  echo "错误: package.json不存在"
  exit 1
fi