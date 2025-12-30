#!/bin/bash

# 简单的Docker镜像构建脚本 - 针对云服务器(linux/amd64)
# 使用简化的Dockerfile，解决pnpm兼容性问题

# 定义根目录 - 脚本所在目录的父目录
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# 设置错误时退出
set -e

# 定义镜像名称
IMAGE_NAME="home-nextjs"
# 默认使用latest标签
TAG="latest"
# 定义标签类型变量，默认使用versioned
TAG_TYPE="versioned"

# 解析命令行参数
# 可选参数: --latest 或 -l 使用latest标签（不推荐用于生产环境）
while [[ $# -gt 0 ]]; do
  case $1 in
    --latest|-l)
      TAG_TYPE="latest"
      shift # 移除参数名
      ;;
    *)
      echo "未知参数: $1"
    echo "用法: $0 [--latest|-l]"
    echo "  --latest|-l: 使用latest标签（默认使用时间戳版本标签）"
    exit 1
      ;;
  esac
done

# 根据标签类型决定是否使用版本化标签
if [ "$TAG_TYPE" = "versioned" ]; then
  # 使用时间戳作为版本标签，格式: vYYYYMMDD-HHMMSS
  TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
  VERSION_TAG="v$TIMESTAMP"
  echo "使用时间戳版本标签: $VERSION_TAG"
else
  echo "使用latest标签（不推荐用于生产环境）"
fi

# 定义平台 - 云服务器使用linux/amd64
PLATFORM="linux/amd64"

# 获取脚本所在目录的父目录（即项目根目录）
ROOT_DIR="$(dirname "$(dirname "$(dirname "$0")")")"

# 切换到项目根目录
cd "$ROOT_DIR"

# 打印构建信息
echo "===== 开始构建Docker镜像 ====="
echo "镜像名称: $IMAGE_NAME"
echo "标签类型: $TAG_TYPE"
if [ "$TAG_TYPE" = "versioned" ]; then
  echo "版本标签: $VERSION_TAG"
else
  echo "标签: $TAG"
fi
echo "构建平台: $PLATFORM"
echo "使用Dockerfile: Dockerfile-simple"
echo "==========================="

# 根据标签类型构建镜像
if [ "$TAG_TYPE" = "versioned" ]; then
  # 仅使用版本化标签，不生成latest标签（生产环境）
  docker build \
    --platform="$PLATFORM" \
    --tag="$IMAGE_NAME:$VERSION_TAG" \
    --progress=plain \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --network=host \
    -f Dockerfile-simple \
    .
  echo "镜像构建完成，标签: $IMAGE_NAME:$VERSION_TAG"
else
  # 只使用latest标签（不推荐用于生产环境）
  docker build \
    --platform="$PLATFORM" \
    --tag="$IMAGE_NAME:$TAG" \
    --progress=plain \
    --build-arg BUILDKIT_INLINE_CACHE=1 \
    --network=host \
    -f Dockerfile-simple \
    .
  echo "镜像构建完成，标签: $IMAGE_NAME:$TAG"
fi

echo ""
echo "✅ 镜像构建成功!"
echo ""
if [ "$TAG_TYPE" = "versioned" ]; then
  echo "构建镜像: $IMAGE_NAME:$VERSION_TAG"
else
  echo "构建镜像: $IMAGE_NAME:$TAG"
fi

echo ""

# 获取构建的镜像ID
if [ "$TAG_TYPE" = "versioned" ]; then
  IMAGE_ID=$(docker images -q "$IMAGE_NAME:$VERSION_TAG")
else
  IMAGE_ID=$(docker images -q "$IMAGE_NAME:$TAG")
fi

# 统一使用image_info.txt文件保存镜像信息
IMAGE_INFO_FILE="$(dirname "${BASH_SOURCE[0]}")/image_info.txt"

# 创建镜像信息文件
cat > "$IMAGE_INFO_FILE" << EOF
IMAGE_ID=$IMAGE_ID
TAG_TYPE=$TAG_TYPE
TAG=$TAG
EOF

# 如果使用版本化标签，则额外添加版本标签信息
if [ "$TAG_TYPE" = "versioned" ]; then
  echo "VERSION_TAG=$VERSION_TAG" >> "$IMAGE_INFO_FILE"
  echo "镜像信息已保存到: $IMAGE_INFO_FILE"
  echo "IMAGE_ID: $IMAGE_ID"
  echo "VERSION_TAG: $VERSION_TAG"
else
  echo "镜像信息已保存到: $IMAGE_INFO_FILE"
  echo "IMAGE_ID: $IMAGE_ID"
fi

# 删除旧的冗余文件image_id.txt（如果存在）
OLD_FILE="$(dirname "${BASH_SOURCE[0]}")/image_id.txt"
if [ -f "$OLD_FILE" ]; then
  rm "$OLD_FILE"
  echo "已删除旧的冗余文件: $OLD_FILE"
fi
