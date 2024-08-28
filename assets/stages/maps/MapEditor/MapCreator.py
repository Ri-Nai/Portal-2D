import pandas as pd
import numpy as np
import json
import os
name = input("请输入实体碰撞地图的设计表格名称：\n")
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
    A[i].append(-1.5)
print(A)
print(len(A), len(A[0]))
basicSize = 40
layer_background_texture = 3
layer_block = 4
layer_edge = 5
layers = [{"tiles" : [], "opacity" : 1} for i in range(6)]
blocks = []
edges = []
def fill_block():
    for i in range(18):
        len = 0
        for j in range(33):
            if not j or A[i][j] == A[i][j - 1]:
                len += 1
            else:
                item = {
                            "type" : abs(A[i][j - 1]),
                            "position" :
                            {
                                "x" : (j - len) * basicSize,
                                "y" : i * basicSize
                            },
                            "size" :
                            {
                                "x" : len * basicSize,
                                "y" : basicSize,
                            }
                        }
                if A[i][j - 1] > 0:
                    blocks.append(item)
                elif A[i][j - 1] < 0:
                    layers[layer_background_texture]["tiles"].append(item)
                len = 1
def fill_edge():
    B = [[-1] * 34 for i in range(20)]
    for i in range(18):
        for j in range(32):
            B[i + 1][j + 1] = A[i][j]
    print(B)
    def write_seg(i, j, last, type, facing, diff, axis):
        now_pos = (i - 1) * basicSize + (1 + diff) * basicSize // 4
        edges.append(
        {
            "type" : type,
            "facing": facing,
            "position" :
            {
                "xy"[axis] : (last - 1) * basicSize,
                "yx"[axis] : now_pos
            },
            "size" :
            {
                "xy"[axis] : (j - last) * basicSize,
                "yx"[axis] : basicSize // 2,
            }
        })
    def make_edge_y(diff):
        for i in range(1, 19):
            # 遍历每一行
            # 求出所有露出的块，且相连
            flag = False
            last = 0
            for j in range(1, 33):
                type = B[i][j - 1]
                facing = (1 + diff) // 2 * 2
                if B[i][j] <= 0 or B[i + diff][j] > 0:
                    # 非露出
                    if flag and type > 0:
                        # draw j - 1 ~ last
                        write_seg(i, j, last, type, facing, diff, 0)
                    flag = False
                else:
                    if not flag:
                        last = j
                    elif B[i][j] != B[i][j - 1] and type > 0:
                        write_seg(i, j, last, type, facing, diff, 0)
                        last = j
                    flag = True
    def make_edge_x(diff):
        for i in range(1, 33):
            flag = False
            last = 0
            for j in range(1, 19):
                type = B[j - 1][i]
                facing = (1 + diff) // 2 * 2 + 1
                if B[j][i] <= 0 or B[j][i + diff] > 0:
                    if flag and type > 0:
                        write_seg(i, j, last, type, facing, diff, 1)
                    flag = False
                else:
                    if not flag:
                        last = j
                    elif B[j][i] != B[j - 1][i] and type > 0:
                        write_seg(i, j, last, type, facing, diff, 1)
                        last = j
                    flag = True
    make_edge_x(1)
    make_edge_y(1)
    make_edge_x(-1)
    make_edge_y(-1)
fill_block()
fill_edge()


def get_events():
    df = pd.read_excel(path_filename, index_col = None, header = None, sheet_name='EventArea')
    C = df.values.tolist()
    for i in range(len(C)):
        for j in range(len(C[i])):
            if np.isnan(C[i][j]):
                C[i][j] = 0  # 将 NaN 转换为 0
            else:
                C[i][j] = int(C[i][j])  # 将浮点数转换为整数
        while (len(C[i]) < 32):
            C[i].append(0)
    while (len(C) < 18):
        C.append([0] * 32)
    print(C)
    print(len(C), len(C[0]))
    events = {}
    dx = [-1, 0, 1, 0]
    dy = [0, -1, 0, 1]
    basicSize = 40
    def get_id(x, y):
        return x * 32 + y
    fa = [i for i in range(18 * 32)]
    vis = [False] * (18 * 32)
    def get_fa(x):
        while x != fa[x]:
            x = fa[x] = fa[fa[x]]
        return x
    def valid(x, y):
        return x >= 0 and x < 18 and y >= 0 and y < 32
    rect = []
    for i in range(18):
        for j in range(32):
            rect.append([i, j, i, j])
    for i in range(18):
        for j in range(32):
            if C[i][j] == 0 or C[i][j] == 2:
                continue
            for k in range(4):
                nx = i + dx[k]
                ny = j + dy[k]
                if not valid(nx, ny):
                    continue
                now = get_fa(get_id(i, j))
                nxt = get_fa(get_id(nx, ny))
                if fa[now] != fa[nxt]:
                    if C[nx][ny] == C[i][j]:
                        fa[nxt] = now
                        rect[now][0] = min(rect[now][0], rect[nxt][0])
                        rect[now][1] = min(rect[now][1], rect[nxt][1])
                        rect[now][2] = max(rect[now][2], rect[nxt][2])
                        rect[now][3] = max(rect[now][3], rect[nxt][3])
    def get_event_name(x, y):
        f = get_fa(get_id(x, y))
        midx = (rect[f][0] + rect[f][2]) // 2
        midy = (rect[f][1] + rect[f][3]) // 2
        return f"event-area-{midy:02d}-{midx:02d}"
    def get_event(type, x, y, affects):
        f = get_fa(get_id(x, y))
        item = {
            "type" : type,
            "position" :
            {
                "x" : rect[f][1] * basicSize,
                "y" : rect[f][0] * basicSize
            },
            "size" :
            {
                "x" : (rect[f][3] - rect[f][1] + 1) * basicSize,
                "y" : (rect[f][2] - rect[f][0] + 1) * basicSize
            },
            "affect" : affects
        }
        return item
    def bfs(SX, SY, predir):
        import queue
        print(SX, SY, predir)
        q = queue.Queue()
        q.put((SX, SY, predir))
        while not q.empty():
            u = q.get()
            x = u[0]
            y = u[1]
            predir = u[2]
            print(x, y)
            for k in range(4):
                if k == (predir + 2 & 3):
                    continue
                nx = x + dx[k]
                ny = y + dy[k]
                if not valid(nx, ny):
                    continue
                if C[nx][ny] == 0:
                    continue
                if C[nx][ny] == C[x][y]:
                    q.put((nx, ny, k))
                print(x, y, nx, ny)
                events[get_event_name(x, y)] = get_event(C[x][y], x, y, [get_event_name(nx, ny)])
                events[get_event_name(x, y)]["nxtdir"] = k
            event_name = get_event_name(x, y)
            if event_name not in events:
                events[event_name] = get_event(C[x][y], x, y, [])
                events[event_name]["nxtdir"] = -1
            events[event_name]["predir"] = predir
    for i in range(18):
        for j in range(32):
            if C[i][j] == 0 or C[i][j] == 2:
                continue
            f = get_fa(get_id(i, j))
            if vis[f]:
                continue
            vis[f] = True
            # 二维数组的x, y
            x = (rect[f][0] + rect[f][2]) // 2
            y = (rect[f][1] + rect[f][3]) // 2
            print(i, j, f, rect[f], x, y)
            if C[x][y] == 1:
                bfs(x + 1, y, 2)
                events[get_event_name(x, y)] = get_event(C[x][y], x, y, [get_event_name(x + 1, y)])
                events[get_event_name(x, y)]["position"]["x"] -= basicSize // 2;
                events[get_event_name(x, y)]["size"]["x"] += basicSize;
            else:
                events[get_event_name(x, y)] = get_event(C[x][y], x, y, [])
                if C[x][y] == 3:
                    import re
                    s = filename
                    match = re.match(r"([a-zA-Z]+)(\d+)", s)
                    if match:
                        name = match.group(1)  # 提取name部分
                        number = int(match.group(2))  # 提取number部分
                    events[get_event_name(x, y)]["toUrl"] =  f"{name}{number + 1}.json"
    return events

answer = {"layers" : layers, "blocks" : blocks, "edges" : edges, "events" : get_events()}
s = json.dumps(answer, indent = 4)
with open(os.path.join(father, name + ".json"), "w") as f:
    f.write("window.$game.dataManager.resolve(\n" + s + '\n)\n')
