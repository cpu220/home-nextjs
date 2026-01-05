#!/bin/bash

# 本地运行Docker镜像脚本 - 使用本地已构建的镜像

# 定义根目录 - 脚本所在目录的父目录
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# 设置错误时退出
set -e

# 定义容器名称
CONTAINER_NAME="home-nextjs-local"

# 定义本地镜像名称
IMAGE_NAME="home-nextjs"

# 定义镜像信息文件
IMAGE_INFO_FILE="$(dirname "${BASH_SOURCE[0]}")/image_info.txt"

# 检查镜像信息文件是否存在
if [ ! -f "$IMAGE_INFO_FILE" ]; then
  echo "❌ 错误: 镜像信息文件不存在: $IMAGE_INFO_FILE"
  echo "请先运行构建命令: npm run docker:build"
  exit 1
fi

# 读取镜像信息
source "$IMAGE_INFO_FILE"

# 验证读取的信息
if [ -z "$IMAGE_ID" ] || [ -z "$TAG_TYPE" ] || [ -z "$TAG" ]; then
  echo "❌ 错误: 镜像信息不完整，请检查构建是否成功"
  echo "IMAGE_ID=$IMAGE_ID"
  echo "TAG_TYPE=$TAG_TYPE"
  echo "TAG=$TAG"
  exit 1
fi

# 根据标签类型确定使用的镜像
if [ "$TAG_TYPE" = "versioned" ] && [ -n "$VERSION_TAG" ]; then
  FULL_IMAGE_TAG="$IMAGE_NAME:$VERSION_TAG"
else
  FULL_IMAGE_TAG="$IMAGE_NAME:$TAG"
fi

# 检查本地镜像是否存在
if ! docker images --format '{{.Repository}}:{{.Tag}}' | grep -q "^$FULL_IMAGE_TAG$"; then
  echo "❌ 错误: 本地镜像不存在: $FULL_IMAGE_TAG"
  echo "请先运行构建命令: npm run docker:build"
  echo ""
  echo "当前本地镜像列表:"
  docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedAt}}" | grep "$IMAGE_NAME" || echo "  (无)"
  exit 1
fi

# 停止并删除旧容器（如果存在）
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "🛑 停止并删除旧容器: $CONTAINER_NAME"
  docker stop "$CONTAINER_NAME" 2>/dev/null || true
  docker rm "$CONTAINER_NAME" 2>/dev/null || true
fi

# 定义端口
PORT=${PORT:-3001}

# 打印运行信息
echo "===== 开始运行Docker容器 ====="
echo "容器名称: $CONTAINER_NAME"
echo "使用镜像: $FULL_IMAGE_TAG"
echo "镜像ID: $IMAGE_ID"
echo "映射端口: $PORT:3001"
echo "==========================="

# 运行容器
docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:3001" \
  -e PORT=3001 \
  --restart unless-stopped \
  "$FULL_IMAGE_TAG"

# 等待容器启动
echo ""
echo "⏳ 等待容器启动..."
sleep 3

# 检查容器状态
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo ""
  echo "✅ 容器启动成功!"
  echo ""
  echo "📊 容器信息:"
  docker ps --filter "name=$CONTAINER_NAME" --format "  名称: {{.Names}}\n  镜像: {{.Image}}\n  端口: {{.Ports}}\n  状态: {{.Status}}"
  echo ""
  echo "🌐 访问地址: http://localhost:$PORT"
  echo ""
  echo "📝 常用命令:"
  echo "  查看日志: docker logs -f $CONTAINER_NAME"
  echo "  停止容器: docker stop $CONTAINER_NAME"
  echo "  删除容器: docker rm $CONTAINER_NAME"
  echo "  进入容器: docker exec -it $CONTAINER_NAME sh"
else
  echo ""
  echo "❌ 容器启动失败，请查看日志:"
  docker logs "$CONTAINER_NAME"
  exit 1
fi
