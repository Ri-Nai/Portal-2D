import os
import subprocess

# 设置工作目录
this_path = os.path.dirname(__file__)
directory = os.path.join(this_path, 'MapEditor')
# 切换到工作目录
os.chdir(directory)

# 获取所有 .xlsx 文件（不含扩展名）
files = [f[:-5] for f in os.listdir(directory) if f.endswith('.xlsx') and f[0] != '~']

# 遍历文件名并运行 MapCreator.py，每次提供文件名作为输入
for file_name in files:
    print(f"正在运行 MapCreator.py，处理文件：{file_name}.xlsx")

    # 启动 MapCreator.py，并通过 stdin 提供输入
    process = subprocess.Popen(
        ['python', 'MapCreator.py'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    # 发送文件名到 MapCreator.py 的标准输入
    output, error = process.communicate(input=f"{file_name}\n")

    # 输出 MapCreator.py 的执行结果
    print(output)
    if error:
        print(f"错误: {error}")

print("所有文件已处理完毕。")
