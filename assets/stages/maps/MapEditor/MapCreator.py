#encoding=utf-8
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
# print(A)
for i in range(len(A)):
    for j in range(len(A[i])):
        if np.isnan(A[i][j]):
            A[i][j] = 0  # 将 NaN 转换为 0
        else:
            A[i][j] = int(A[i][j])  # 将浮点数转换为整数
    A[i].append(-1.5)
# print(A)
# print(len(A), len(A[0]))
basicSize = 40
layer_background_texture = 3
layer_background_objects = 4
layer_edge = 5
layer_upper_texture = 6
layers = [{"tiles" : [], "opacity" : 1} for i in range(7)]
blocks = []
edges = []
super_edges = []
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
    # print(B)
    def write_seg(i, j, last, type, facing, diff, axis):
        now_pos = (i - 1) * basicSize + (1 + diff) * basicSize // 4
        arr_edges = []
        if type == -1:
            arr_edges = super_edges
        else:
            arr_edges = edges
        arr_edges.append(
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
        for i in range(1, 20):
            # 遍历每一行
            # 求出所有露出的块，且相连
            flag = False
            last_normal = 0
            last_super = 0
            for j in range(1, 34):
                type = B[i][j - 1]
                facing = (1 + diff) // 2 * 2
                if B[i][j] <= 0 or B[i + diff][j] > 0:
                    # 非露出
                    if flag and type > 0:
                        # draw j - 1 ~ last_normal
                        write_seg(i, j, last_normal, type, facing, diff, 0)
                        write_seg(i, j, last_super, -1, facing, diff, 0)
                    flag = False
                else:
                    if not flag:
                        last_normal = j
                        last_super = j
                    elif B[i][j] != B[i][j - 1] and type > 0:
                        write_seg(i, j, last_normal, type, facing, diff, 0)
                        last_normal = j
                    flag = True
    def make_edge_x(diff):
        for i in range(1, 34):
            flag = False
            last_normal = 0
            last_super = 0
            for j in range(1, 20):
                type = B[j - 1][i]
                facing = (1 + diff) // 2 * 2 + 1
                if B[j][i] <= 0 or B[j][i + diff] > 0:
                    if flag and type > 0:
                        write_seg(i, j, last_normal, type, facing, diff, 1)
                        write_seg(i, j, last_super, -1, facing, diff, 1)
                    flag = False
                else:
                    if not flag:
                        last_normal = j
                        last_super = j
                    elif B[j][i] != B[j - 1][i] and type > 0:
                        write_seg(i, j, last_normal, type, facing, diff, 1)
                        last_normal = j
                    flag = True
    make_edge_x(1)
    make_edge_y(1)
    make_edge_x(-1)
    make_edge_y(-1)
fill_block()
fill_edge()

dx = [-1, 0, 1, 0]
dy = [0, -1, 0, 1]
def get_fa(fa, x):
    while x != fa[x]:
        x = fa[x] = fa[fa[x]]
    return x
def valid(x, y):
        return x >= 0 and x < 18 and y >= 0 and y < 32
def get_id(x, y):
    return x * 32 + y
def read_and_run_DSU(sheetname, check2, tovalue=0):
    df = pd.read_excel(path_filename, index_col = None, header = None, sheet_name=sheetname)
    C = df.values.tolist()
    while (len(C) < 18):
        C.append([tovalue] * 32)
    for i in range(18):
        while (len(C[i]) < 32):
            C[i].append(tovalue)
        for j in range(32):
            if np.isnan(C[i][j]):
                C[i][j] = tovalue  # 将 NaN 转换为 0 # 将浮点数转换为整数
    # print(C)
    # print(len(C), len(C[0]))
    fa = [i for i in range(18 * 32)]
    rect = []
    for i in range(18):
        for j in range(32):
            rect.append([i, j, i, j])
    for i in range(18):
        for j in range(32):
            if C[i][j] == tovalue or check2 and C[i][j] == 2:
                continue
            for k in range(4):
                nx = i + dx[k]
                ny = j + dy[k]
                if not valid(nx, ny):
                    continue
                now = get_fa(fa, get_id(i, j))
                nxt = get_fa(fa, get_id(nx, ny))
                if fa[now] != fa[nxt]:
                    if C[nx][ny] == C[i][j]:
                        fa[nxt] = now
                        rect[now][0] = min(rect[now][0], rect[nxt][0])
                        rect[now][1] = min(rect[now][1], rect[nxt][1])
                        rect[now][2] = max(rect[now][2], rect[nxt][2])
                        rect[now][3] = max(rect[now][3], rect[nxt][3])
    return (C, fa, rect)
def get_events():
    C, fa, rect = read_and_run_DSU("EventArea", True)
    events = {}
    vis = [False] * (18 * 32)
    def get_event_name(x, y):
        f = get_fa(fa, get_id(x, y))
        midx = (rect[f][0] + rect[f][2]) // 2
        midy = (rect[f][1] + rect[f][3]) // 2
        return f"event-area-{midy:02d}-{midx:02d}"
    def get_event(type, x, y, affects):
        f = get_fa(fa, get_id(x, y))
        type = int(type)
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
        # print(SX, SY, predir)
        q = queue.Queue()
        q.put((SX, SY, predir))
        while not q.empty():
            u = q.get()
            x = u[0]
            y = u[1]
            predir = u[2]
            # print(x, y)
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
                # print(x, y, nx, ny)
                events[get_event_name(x, y)] = get_event(C[x][y], x, y, [get_event_name(nx, ny)])
                events[get_event_name(x, y)]["nxtdir"] = k if C[nx][ny] == 2 else -1

            event_name = get_event_name(x, y)
            if event_name not in events:
                events[event_name] = get_event(C[x][y], x, y, [])
                events[event_name]["nxtdir"] = -1
            events[event_name]["predir"] = predir
    for i in range(18):
        for j in range(32):
            if C[i][j] == 0 or C[i][j] == 2:
                continue
            f = get_fa(fa, get_id(i, j))
            if vis[f]:
                continue
            vis[f] = True
            # 二维数组的x, y
            x = (rect[f][0] + rect[f][2]) // 2
            y = (rect[f][1] + rect[f][3]) // 2
            # print(i, j, f, rect[f], x, y)
            this_name = get_event_name(x, y)
            if C[x][y] == 1 or C[x][y] == 1.5:
                bfs(x + 1, y, 2)
                events[this_name] = get_event(int(C[x][y]), x, y, [get_event_name(x + 1, y)])
                if C[x][y] == 1 :
                    events[this_name]["position"]["x"] -= basicSize // 2
                events[this_name]["size"]["x"] += basicSize
                events[this_name]["size"]["y"] //= 2
                events[this_name]["position"]["y"] += basicSize // 2

            else:
                events[this_name] = get_event(C[x][y], x, y, [])
                # print("?")
                if C[x][y] == 3:
                    import re
                    s = filename
                    # print("!!!")
                    match = re.match(r"([a-zA-Z]+)(\d+)", s)
                    print(filename)
                    if match:
                        name = match.group(1)  # 提取name部分
                        number = int(match.group(2))  # 提取number部分
                        if number == 19:
                            events[this_name]["toUrl"] =  "Boss.json"
                        else:
                            events[this_name]["toUrl"] =  f"{name}{number + 1}.json"
                    elif filename == "Haruhikage.xlsx":
                        # print("!!?")
                        events[this_name]["toUrl"] =  "Room18.json"
                elif C[x][y] == 3.5:
                    events[this_name]["toUrl"] =  "Haruhikage.json"
    return events

def get_drama_events():
    C, fa, rect = read_and_run_DSU("DramaArea", False)
    events = []
    jsonfile = os.path.join(this_path, "..", "..", ".\\events", name + ".json")
    if not os.path.exists(jsonfile):
        return []
    with open(jsonfile, 'r', encoding='utf-8') as f:
        dialogs = json.load(f)
    def get_event(id, f):
        item = {
            "id" : id,
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
        }
        item.update(dialogs[str(id)])
        return item
    vis = [False] * (18 * 32)
    item = {"id" : 0, "position" : {"x" : 0, "y" : 0}, "size" : {"x" : 1280, "y" : 720}}
    item.update(dialogs["0"])
    events.append(item)
    for i in range(18):
        for j in range(32):
            if C[i][j] == 0:
                continue
            f = get_fa(fa, get_id(i, j))
            # print(f, i, j, C[i][j])
            if vis[f]:
                continue
            vis[f] = True
            # 二维数组的x, y
            events.append(get_event(int(C[i][j]), f))
    return events

def get_signs():
    df = pd.read_excel(path_filename, index_col = None, header = None, sheet_name="SignArea")
    C = df.values.tolist()
    while len(C) < 18:
        C.append([0] * 32)
    for i in range(18):
        while (len(C[i]) < 32):
            C[i].append(0)
        for j in range(32):
            if np.isnan(C[i][j]):
                C[i][j] = 0  # 将 NaN 转换为 0 # 将浮点数转换为整数
            C[i][j] = int(C[i][j])
    for i in range(18):
        for j in range(32):
            if C[i][j] == 0:
                continue
            layers[layer_upper_texture]["tiles"].append({
                "type" : C[i][j],
                "position" :
                {
                    "x" : j * basicSize,
                    "y" : i * basicSize
                },
                "size" :
                {
                    "x" : basicSize,
                    "y" : basicSize
                }})
get_signs()

def get_background_objects():
    C, fa, rect = read_and_run_DSU("backgroundObjects", False, -2)
    def get_range(type_, f):
        item = {
            "type" : abs(type_),
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
        }
        return item
    vis = [False] * (18 * 32)
    for i in range(18):
        for j in range(32):
            if C[i][j] == -2:
                continue
            f = get_fa(fa, get_id(i, j))
            if vis[f]:
                continue
            vis[f] = True
            layers[layer_background_objects]["tiles"].append(get_range(int(C[i][j]), f))
get_background_objects()

answer = {"layers" : layers, "blocks" : blocks, "edges" : edges, "super_edges" : super_edges, "events" : get_events(), "drama_events" : get_drama_events()}
# print(answer["drama_events"])
s = json.dumps(answer, indent = 4, ensure_ascii=False)
with open(os.path.join(father, name + ".json"), "w", encoding='utf-8') as f:
    f.write("window.$game.dataManager.resolve(\n" + s + '\n)\n')
