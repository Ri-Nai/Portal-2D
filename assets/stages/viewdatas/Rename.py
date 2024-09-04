import os
import re

# 获取脚本所在文件夹路径
folder_path = os.path.dirname(os.path.abspath(__file__))

# 指定阈值（大于等于此值的数字将增加1）
threshold = int(input("请输入你想添加的数字: "))

# 获取文件夹中的所有文件名
files = os.listdir(folder_path)

# 使用正则表达式匹配文件名中的数字部分
pattern = re.compile(r"(.*?)(\d+)(\.json)")
files_to_rename = []

# 筛选出符合条件的文件并添加到列表中
for file_name in files:
    match = pattern.match(file_name)
    if match:
        base_name = match.group(1)  # 文件名前缀
        number = int(match.group(2))  # 数字部分
        extension = match.group(3)  # 扩展名
        if number >= threshold:
            files_to_rename.append((file_name, base_name, number, extension))

# 按数字部分倒序排序
files_to_rename.sort(key=lambda x: x[2], reverse=True)

# 依次重命名文件
for file_name, base_name, number, extension in files_to_rename:
    new_number = number + 1  # 数字加1
    new_file_name = f"{base_name}{new_number}{extension}"

    # 生成完整路径并重命名文件
    old_path = os.path.join(folder_path, file_name)
    new_path = os.path.join(folder_path, new_file_name)

    # 执行重命名操作
    os.rename(old_path, new_path)
    print(f"重命名: {file_name} -> {new_file_name}")

print("文件重命名完成！")
