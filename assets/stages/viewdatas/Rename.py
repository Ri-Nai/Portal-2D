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

for file_name in files:
    # 匹配文件名中的数字部分
    match = pattern.match(file_name)
    if match:
        base_name = match.group(1)  # 获取文件名前缀
        number = int(match.group(2))  # 获取数字部分并转换为整数
        extension = match.group(3)  # 获取文件扩展名

        # 判断数字是否大于等于阈值
        if number >= threshold:
            new_number = number + 1  # 数字加1
            new_file_name = f"{base_name}{new_number}{extension}"

            # 生成完整路径并重命名文件
            old_path = os.path.join(folder_path, file_name)
            new_path = os.path.join(folder_path, new_file_name)
            os.rename(old_path, new_path)
            print(f"重命名: {file_name} -> {new_file_name}")

print("文件重命名完成！")
