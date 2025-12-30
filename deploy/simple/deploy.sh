#!/bin/bash

# 简化的Docker镜像部署脚本 - 针对云服务器(linux/amd64)

# 设置错误时退出
set -e

# 定义根目录 - 脚本所在目录的父目录
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# 加载.env文件中的环境变量
if [ -f "$ROOT_DIR/.env" ]; then
  export $(grep -v '^#' "$ROOT_DIR/.env" | xargs)
fi

# 定义本地镜像名称
IMAGE_NAME="home-nextjs"

# 默认使用latest标签
TAG="latest"

# 定义腾讯云仓库信息
# 从.env文件读取，不设置默认值，确保配置集中在.env中
REGISTRY_DOMAIN=$REGISTRY_DOMAIN
NAMESPACE=$NAMESPACE
REGISTRY_IMAGE_NAME=$REGISTRY_IMAGE_NAME

# 验证必要的环境变量是否已设置
if [ -z "$REGISTRY_DOMAIN" ] || [ -z "$NAMESPACE" ] || [ -z "$REGISTRY_IMAGE_NAME" ]; then
  echo "❌ 错误：缺少必要的Docker仓库配置环境变量"
  echo "请在.env文件中设置以下变量："
  echo "- REGISTRY_DOMAIN: Docker镜像仓库的域名"
  echo "- NAMESPACE: Docker镜像仓库中的命名空间"
  echo "- REGISTRY_IMAGE_NAME: Docker镜像在仓库中的名称"
  exit 1
fi

REGISTRY_IMAGE="$REGISTRY_DOMAIN/$NAMESPACE/$REGISTRY_IMAGE_NAME"

# 镜像信息文件路径
IMAGE_INFO_FILE="$(dirname "${BASH_SOURCE[0]}")/image_info.txt"

# 验证脚本参数
if [[ $# -gt 0 ]]; then
  echo "❌ 错误：该脚本不接受任何参数"
  echo "用法: $0"
  exit 1
fi

# 检查是否存在镜像信息文件
if [ ! -f "$IMAGE_INFO_FILE" ]; then
  echo "❌ 错误：找不到镜像信息文件 $IMAGE_INFO_FILE"
  echo "请先执行构建脚本 build.sh"
  exit 1
fi

# 读取镜像信息（环境变量格式）
source "$IMAGE_INFO_FILE"

# 验证读取的信息
if [ -z "$IMAGE_ID" ] || [ -z "$TAG_TYPE" ] || [ -z "$TAG" ]; then
  echo "❌ 错误：镜像信息不完整，请检查构建是否成功"
  echo "IMAGE_ID=$IMAGE_ID"
  echo "TAG_TYPE=$TAG_TYPE"
  echo "TAG=$TAG"
  exit 1
fi

# 验证版本标签（如果标签类型是versioned）
if [ "$TAG_TYPE" = "versioned" ] && [ -z "$VERSION_TAG" ]; then
  echo "❌ 错误：使用版本化标签时，VERSION_TAG不能为空"
  exit 1
fi

echo "===== 开始部署Docker镜像 ====="
echo "标签类型: $TAG_TYPE"
if [ "$TAG_TYPE" = "versioned" ]; then
  echo "本地镜像: $IMAGE_NAME:$VERSION_TAG"
  echo "版本标签: $IMAGE_NAME:$VERSION_TAG"
else
  echo "本地镜像: $IMAGE_NAME:$TAG"
fi
echo "腾讯云仓库: $REGISTRY_IMAGE"
echo "==========================="

# 标记镜像为腾讯云仓库格式
echo "正在标记镜像..."

# 根据标签类型标记镜像
if [ "$TAG_TYPE" = "versioned" ]; then
  # 生产环境：只标记版本化标签
  echo "执行命令: docker tag $IMAGE_ID $REGISTRY_IMAGE:$VERSION_TAG"
  docker tag "$IMAGE_ID" "$REGISTRY_IMAGE:$VERSION_TAG"
  echo "已标记版本标签: $REGISTRY_IMAGE:$VERSION_TAG"
else
  # 开发环境：标记为latest标签
  echo "执行命令: docker tag $IMAGE_ID $REGISTRY_IMAGE:$TAG"
  docker tag "$IMAGE_ID" "$REGISTRY_IMAGE:$TAG"
fi

# 继续执行推送流程

# 直接尝试推送镜像，而不是先检查登录状态
if [ "$TAG_TYPE" = "versioned" ]; then
  # 生产环境：只推送版本化标签
  echo "正在推送版本标签镜像到腾讯云仓库..."
  echo "执行命令: docker push $REGISTRY_IMAGE:$VERSION_TAG"
  # 尝试推送镜像，如果失败再提示登录
  if ! docker push "$REGISTRY_IMAGE:$VERSION_TAG"; then
    echo "🔔 推送失败，可能是未登录腾讯云仓库"
    echo "请先登录：docker login $REGISTRY_DOMAIN"
    exit 1
  fi
  
  echo "✅ 版本化镜像推送成功: $REGISTRY_IMAGE:$VERSION_TAG"
else
  # 开发环境：只推送latest标签
  echo "正在推送镜像到腾讯云仓库..."
  echo "执行命令: docker push $REGISTRY_IMAGE:$TAG"
  # 尝试推送镜像，如果失败再提示登录
  if ! docker push "$REGISTRY_IMAGE:$TAG"; then
    echo "🔔 推送失败，可能是未登录腾讯云仓库"
    echo "请先登录：docker login $REGISTRY_DOMAIN"
    exit 1
  fi
  
  echo "✅ 镜像推送成功: $REGISTRY_IMAGE:$TAG"
fi

echo ""
echo "✅ 镜像部署成功!"
if [ "$TAG_TYPE" = "versioned" ]; then
  echo "推送的镜像: $REGISTRY_IMAGE:$VERSION_TAG"
  echo ""
  echo "提示: 您可以在腾讯云容器服务中指定使用特定版本标签进行部署，而不仅仅依赖latest标签"
else
  echo "推送的镜像: $REGISTRY_IMAGE:$TAG"
  echo ""
  echo "提示: 请在腾讯云容器服务中更新容器配置，注意可能需要强制拉取最新镜像。"
fi
echo ""

# 可选：清理临时文件
# rm -f "$IMAGE_INFO_FILE"
