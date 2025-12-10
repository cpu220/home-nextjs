#!/bin/bash

# Docker镜像构建部署总控脚本
# 用于依次执行构建和部署操作

# 设置错误时退出
set -e

# 获取脚本所在目录
SCRIPT_DIR="$(dirname "$0")"
BUILD_SCRIPT="$SCRIPT_DIR/build.sh"
DEPLOY_SCRIPT="$SCRIPT_DIR/deploy.sh"
IMAGE_INFO_FILE="$SCRIPT_DIR/image_info.txt"

# 定义标签类型参数，传递给build.sh
TAG_PARAMS=""

# 解析命令行参数
while [[ $# -gt 0 ]]; do
  case $1 in
    --versioned|-v)
      TAG_PARAMS="--versioned"
      shift # 移除参数名
      ;;
    *)
      echo "未知参数: $1"
    echo "用法: $0 [--versioned|-v]"
    echo "  --versioned|-v: 使用自增版本号而非默认的latest标签"
    exit 1
      ;;
  esac
done

# 如果存在旧的镜像信息文件，先清理掉
if [ -f "$IMAGE_INFO_FILE" ]; then
  rm -f "$IMAGE_INFO_FILE"
  echo "已清理旧的镜像信息文件"
fi

echo "🔄 开始Docker镜像构建和部署流程..."
if [ -n "$TAG_PARAMS" ]; then
  echo "使用版本化标签模式（v+时间戳格式）"
else
  echo "使用默认标签模式"
fi
echo ""

# 检查构建脚本是否存在
if [ ! -f "$BUILD_SCRIPT" ]; then
  echo "❌ 错误：找不到构建脚本 $BUILD_SCRIPT"
  exit 1
fi

# 检查部署脚本是否存在
if [ ! -f "$DEPLOY_SCRIPT" ]; then
  echo "❌ 错误：找不到部署脚本 $DEPLOY_SCRIPT"
  exit 1
fi

# 给脚本添加执行权限
chmod +x "$BUILD_SCRIPT"
chmod +x "$DEPLOY_SCRIPT"

echo "🚀 第一步：执行构建脚本"
echo "==========================================="
echo "执行命令: \"$BUILD_SCRIPT\" $TAG_PARAMS"
"$BUILD_SCRIPT" $TAG_PARAMS

# 检查构建是否成功
BUILD_EXIT_CODE=$?
if [ $BUILD_EXIT_CODE -ne 0 ]; then
  echo "❌ 构建失败，部署流程已终止"
  exit $BUILD_EXIT_CODE
fi

echo ""
echo "✅ 构建完成，准备开始部署"
echo ""
echo "🚀 第二步：执行部署脚本"
echo "==========================================="
echo "执行命令: \"$DEPLOY_SCRIPT\""
"$DEPLOY_SCRIPT"

# 检查部署是否成功
DEPLOY_EXIT_CODE=$?
if [ $DEPLOY_EXIT_CODE -ne 0 ]; then
  echo "❌ 部署失败"
  exit $DEPLOY_EXIT_CODE
fi

echo ""
echo "🎉 Docker镜像构建和部署流程已全部完成!"
echo "✅ 镜像已成功构建并推送到腾讯云仓库"
if [ -n "$TAG_PARAMS" ]; then
  echo "✅ 支持版本化标签，每次部署自动生成v+时间戳格式的版本号"
  echo "✅ 同时推送latest和版本标签，方便回滚和版本控制"
  echo ""
  echo "🔔 提示：在腾讯云容器服务中，可以指定具体的版本标签进行部署"
  echo "这样可以确保服务使用特定版本的镜像，避免latest标签可能带来的缓存问题"
fi
echo ""
