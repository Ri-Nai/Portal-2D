import pandas as pd
import numpy as np
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
    A[i].append(-1)
print(A)
print(len(A), len(A[0]))
BasicSize = 40
layer_block = 4
layer_edge = 5
layers = [{"tiles" : [], "opacity" : 1} for i in range(6)]
def fill_block():
    for i in range(18):
        len = 0
        for j in range(33):
            if not j or A[i][j] == A[i][j - 1]:
                len += 1
            else:
                if A[i][j - 1]:
                    layers[layer_block]["tiles"].append(
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
def fill_edge():
    B = [[-1] * 34 for i in range(20)]
    for i in range(18):
        for j in range(32):
            B[i + 1][j + 1] = A[i][j]
    print(B)

    def write_seg(i, j, last, type, diff, axis):
        now_pos = (i - 1) * BasicSize + (1 + diff) * BasicSize // 4
        layers[layer_edge]["tiles"].append(
        {
            "type" : type,
            "position" :
            {
                "xy"[axis] : (last - 1) * BasicSize,
                "yx"[axis] : now_pos
            },
            "size" :
            {
                "xy"[axis] : (j - last) * BasicSize,
                "yx"[axis] : BasicSize // 2,
            }
        })
    def make_edge_y(diff):
        for i in range(1, 19):
            # 遍历每一行
            # 求出所有露出的块，且相连
            flag = False
            last = 0
            for j in range(1, 33):
                if B[i][j] == 0 or B[i + diff][j] != 0:
                    # 非露出
                    if flag:
                        # draw j - 1 ~ last
                        write_seg(i, j, last, B[i][j - 1] * 10, diff, 0)
                    flag = False
                else:
                    if not flag:
                        last = j
                    elif B[i][j] != B[i][j - 1]:
                        write_seg(i, j, last, B[i][j - 1] * 10, diff, 0)
                        last = j
                    flag = True
    def make_edge_x(diff):
        for i in range(1, 33):
            flag = False
            last = 0
            for j in range(1, 19):
                if B[j][i] == 0 or B[j][i + diff] != 0:
                    if flag:
                        write_seg(i, j, last, B[j - 1][i] * 5, diff, 1)
                    flag = False
                else:
                    if not flag:
                        last = j
                    elif B[j][i] != B[j - 1][i]:
                        write_seg(i, j, last, B[j - 1][i] * 5, diff, 1)
                        last = j
                    flag = True
    make_edge_x(1)
    make_edge_y(1)
    make_edge_x(-1)
    make_edge_y(-1)
fill_block()
fill_edge()

answer = {"layers" : layers}
s = json.dumps(answer, indent = 4)
with open(os.path.join(father, name + ".json"), "w") as f:
    f.write("window.$game.dataManager.resolve(\n" + s + '\n)\n')
