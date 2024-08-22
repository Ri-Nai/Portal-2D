import pandas as pd
import numpy as np
import openpyxl as op
import json
import os
name = input()
filename = name + '.xlsx'
this_path = os.path.dirname(__file__)
path_filename = os.path.join(this_path, filename)
father = os.path.join(this_path, "..")
df = pd.read_excel(path_filename, index_col = None, header = None)
# data = op.load_workbook(path_filename)
A = df.values.tolist()
print(A)
for i in range(len(A)):
    for j in range(len(A[i])):
        if np.isnan(A[i][j]):
            A[i][j] = 0  # 将 NaN 转换为 0
        else:
            A[i][j] = int(A[i][j])  # 将浮点数转换为整数
    A[i].append(0)
print(A)
print(len(A), len(A[0]))
BasicSize = 40
layers = [{"tiles" : [], "opacity" : 1} for i in range(6)]
for i in range(18):
    len = 0
    for j in range(33):
        if not j or A[i][j] == A[i][j - 1]:
            len += 1
        else:
            if A[i][j - 1]:
                print(i, j, len)
                layers[4]["tiles"].append(
                    {
                        "type" : A[i][j - 1],
                        "position" :
                        {
                            "x" : (j - len) * BasicSize,
                            "y" : i * BasicSize
                        },
                        "size" :
                        {
                            "x" : len * BasicSize,
                            "y" : BasicSize,
                        }
                    })
            len = 1
answer = {"layers" : layers}
s = json.dumps(answer, indent = 4)
with open(os.path.join(father, name + ".json"), "w") as f:
    f.write("window.$game.dataManager.resolve(\n" + s + '\n)\n')
