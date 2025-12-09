#!/bin/bash

# 打包脚本：将当前工程打包为 home.zip，排除 .gitignore 中的文件和目录

set -e  # 遇到错误立即退出

# 获取脚本所在目录的父目录（项目根目录）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 切换到项目根目录
cd "$PROJECT_ROOT"

# 输出文件名
ZIP_FILE="home.zip"

# 如果已存在同名文件，先删除
if [ -f "$ZIP_FILE" ]; then
  echo "删除已存在的 $ZIP_FILE..."
  rm "$ZIP_FILE"
fi

echo "开始打包项目..."
echo "项目根目录: $PROJECT_ROOT"

# 方法1: 如果项目已初始化 git，使用 git ls-files（最可靠）
if [ -d ".git" ]; then
  echo "检测到 git 仓库，使用 git ls-files 获取文件列表..."
  # 创建临时文件列表
  TEMP_FILELIST=$(mktemp)
  git ls-files > "$TEMP_FILELIST" || {
    echo "警告: git ls-files 失败，切换到备用方法"
    rm -f "$TEMP_FILELIST"
  }
  
  if [ -f "$TEMP_FILELIST" ] && [ -s "$TEMP_FILELIST" ]; then
    echo "使用 git 文件列表打包..."
    zip -q "$ZIP_FILE" -@ < "$TEMP_FILELIST" || {
      echo "打包失败！"
      rm -f "$TEMP_FILELIST"
      exit 1
    }
    rm -f "$TEMP_FILELIST"
    
    # 检查打包是否成功
    if [ -f "$ZIP_FILE" ]; then
      FILE_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
      echo "✓ 打包完成: $ZIP_FILE"
      echo "  文件大小: $FILE_SIZE"
      echo "  文件位置: $PROJECT_ROOT/$ZIP_FILE"
      exit 0
    fi
  fi
fi

# 方法2: 读取 .gitignore 并手动排除（备用方法）
echo "使用 .gitignore 规则排除文件..."

# 使用 find 命令查找所有文件，然后用 grep 过滤
TEMP_FILELIST=$(mktemp)
TEMP_FILTERED=$(mktemp)

# 先查找所有文件（排除 .git 目录）
find . -type f ! -path "./.git/*" ! -name ".git" > "$TEMP_FILELIST"

# 读取 .gitignore 并构建排除模式用于 grep
if [ -f ".gitignore" ]; then
  echo "读取 .gitignore 文件..."
  EXCLUDE_COUNT=0
  
  # 复制文件列表到过滤列表
  cp "$TEMP_FILELIST" "$TEMP_FILTERED"
  
  while IFS= read -r line || [ -n "$line" ]; do
    # 跳过空行和注释行
    if [[ -z "$line" ]] || [[ "$line" =~ ^[[:space:]]*# ]]; then
      continue
    fi
    
    # 去除前后空白
    pattern=$(echo "$line" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    
    # 跳过空字符串
    if [ -z "$pattern" ]; then
      continue
    fi
    
    # 处理路径模式并转换为 grep 模式
    if [[ "$pattern" =~ ^/ ]]; then
      # 从根目录匹配，去掉开头的 /
      pattern="${pattern#/}"
      # 去掉末尾的 /（如果存在）
      pattern="${pattern%/}"
      # 排除 ./pattern 和 ./pattern/ 开头的路径
      grep -v "^\./$pattern$" "$TEMP_FILTERED" | grep -v "^\./$pattern/" > "${TEMP_FILTERED}.new"
      if [ -f "${TEMP_FILTERED}.new" ]; then
        mv "${TEMP_FILTERED}.new" "$TEMP_FILTERED"
      fi
    else
      # 匹配所有路径下的该模式
      # 去掉末尾的 /（如果存在）
      pattern="${pattern%/}"
      if [[ "$pattern" =~ \* ]]; then
        # 通配符模式：将 * 转换为 .* 用于正则，转义特殊字符
        regex_pattern=$(echo "$pattern" | sed 's/\./\\\./g' | sed 's/\*/.*/g')
        # 排除匹配该模式的文件（在路径的任何位置）
        grep -vE "/$regex_pattern$|/$regex_pattern/" "$TEMP_FILTERED" > "${TEMP_FILTERED}.new"
        if [ -f "${TEMP_FILTERED}.new" ]; then
          mv "${TEMP_FILTERED}.new" "$TEMP_FILTERED"
        fi
      else
        # 普通模式：排除包含该名称的路径
        # 排除 /pattern 或 /pattern/ 在路径中
        grep -vE "/$pattern$|/$pattern/" "$TEMP_FILTERED" > "${TEMP_FILTERED}.new"
        if [ -f "${TEMP_FILTERED}.new" ]; then
          mv "${TEMP_FILTERED}.new" "$TEMP_FILTERED"
        fi
        # 也排除根目录下的
        grep -v "^\./$pattern$" "$TEMP_FILTERED" | grep -v "^\./$pattern/" > "${TEMP_FILTERED}.new"
        if [ -f "${TEMP_FILTERED}.new" ]; then
          mv "${TEMP_FILTERED}.new" "$TEMP_FILTERED"
        fi
      fi
    fi
    
    ((EXCLUDE_COUNT++))
  done < .gitignore
  
  mv "$TEMP_FILTERED" "$TEMP_FILELIST"
  echo "找到 $EXCLUDE_COUNT 个排除规则"
else
  echo "警告: 未找到 .gitignore 文件"
fi

# 执行打包
echo "正在打包..."
# 使用 zip 命令从文件列表打包
zip -q "$ZIP_FILE" -@ < "$TEMP_FILELIST" || {
  echo "打包失败！"
  rm -f "$TEMP_FILELIST"
  exit 1
}

rm -f "$TEMP_FILELIST"

# 检查打包是否成功
if [ -f "$ZIP_FILE" ]; then
  FILE_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
  echo "✓ 打包完成: $ZIP_FILE"
  echo "  文件大小: $FILE_SIZE"
  echo "  文件位置: $PROJECT_ROOT/$ZIP_FILE"
else
  echo "✗ 打包失败: 未生成 $ZIP_FILE"
  exit 1
fi

