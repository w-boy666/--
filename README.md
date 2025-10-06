迷宫游戏  
![迷宫]()
背景介绍：  
1.迷宫生成：采用递归，生成只有一条通向终点的路线。上述代码中，起始终点均是奇数坐标。  
2.为了可视化，采用的是网页版。后端采用的是flask。  
  
快速上手体验：
```Bash
git clone https://github.com/w-boy666/--.git
```
```Bash
pip install requirements.txt
```
```Bash
cd 相应工作目录
```
```Bash
python main.py
```
如果想要别人体验，那么可以更换IP地址，这样别人也能体验到自己创作的迷宫
```Bash
app.run(debug=True,host='自己的IP地址',port=5000)
```

项目不足之处：  
1.迷宫大小固定  
2.玩法过于单一  

最后，希望大家可以借着这个项目继续完善，创作出更好的迷宫游戏！！！
