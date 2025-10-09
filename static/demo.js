const huaban=document.getElementById('game');
const huaban_2d=huaban.getContext('2d');

const color={
    WHITE: '#ffffff',
    BLACK: '#000000',
    RED: '#ff0000',
    GREEN: '#00ff00',
    BLUE: '#0000ff'
};

const gezi_size=40;  //这个是每个方块的大小（正方形）
const width=huaban.width;
const height=huaban.height;

let gameover=false;
let migong;
let cpt_bfs;

const player=new Image();
player.src=huaban.getAttribute('data-image');
const home=new Image();
home.src=huaban.getAttribute('data-image2');
const wall=new Image();
wall.src=huaban.getAttribute('data-image3');
const luban=new Image();
luban.src=huaban.getAttribute('data-image4');


//创建迷宫这个类，里面包括迷宫的初始化设置（长宽、起点、终点、迷宫绘制的函数、角色移动的函数）
class Migong{
    constructor(width,height){
        this.width=width%2==1?width:width+1;
        this.height=height%2==1?height:height+1;
        this.player_x=1;
        this.player_y=1;
        this.end_x=this.width-2;
        this.end_y=this.height-2;
        this.grid=Array(this.height).fill().map(()=>Array(this.width).fill(1)) //这个是抽象迷宫
        this.generate();//这个是具体迷宫
    }

    generate(){
        const migong_=(x,y)=>{
            this.grid[y][x]=0;

            const direction=[
                [0,1],
                [1,0],
                [0,-1],
                [-1,0]
            ];
            direction.sort(()=>Math.random()-0.5);
            
            for(const [dx,dy] of direction){
                const nx=2*dx+x;  //表示每次都要走到的x坐标
                const ny=2*dy+y;  //表示每次都要走到的y坐标
                if(nx>=0&&nx<this.width&&ny>=0&&ny<this.height&&this.grid[ny][nx]==1)
                {
                    this.grid[y+dy][x+dx]=0;
                    migong_(nx,ny);
                }
            }
        }

        migong_(1,1);
    }

    player_movement(dx,dy){
        const new_x=dx+this.player_x;
        const new_y=dy+this.player_y;

        if(new_x>=0&&new_x<this.width&&new_y>=0&&new_y<this.height)
        {
            if(this.grid[new_y][new_x]==0)
            {
                this.player_x=new_x;
                this.player_y=new_y;
                if(this.player_x==this.end_x&&this.player_y==this.end_y)
                {
                    gameover=true;
                }
            }
        }
    }

    draw(){
        //背景创作
        huaban_2d.fillStyle=color.WHITE;
        huaban_2d.fillRect(0,0,width,height);

        //迷宫创作
        for(let y=0;y<this.height;y++)
        {
            for(let x=0;x<this.width;x++)
            {
                const fangge_x=x*gezi_size;
                const fangge_y=y*gezi_size;
                
                //格子绘制
                if(this.grid[y][x]==1)
                {
                    huaban_2d.drawImage(
                        wall,
                        fangge_x,
                        fangge_y,
                        gezi_size,
                        gezi_size
                    )
                }
                else
                {
                    huaban_2d.fillRect(fangge_x,fangge_y,gezi_size,gezi_size);
                    huaban_2d.drawImage(
                        luban,
                        fangge_x,
                        fangge_y,
                        gezi_size,
                        gezi_size
                    )
                }


                //边框绘制
                huaban_2d.strokeStyle=color.BLACK;
                huaban_2d.strokeRect(fangge_x,fangge_y,gezi_size,gezi_size);
            }
        }

        //玩家创作
        // huaban_2d.fillStyle=color.RED;
        // huaban_2d.fillRect(
        //     this.player_x*gezi_size+5,
        //     this.player_y*gezi_size+5,
        //     gezi_size-10,
        //     gezi_size-10
        // );
        
        huaban_2d.drawImage(
            player,
            this.player_x*gezi_size+5,
            this.player_y*gezi_size+5,
            gezi_size-10,
            gezi_size-10
        )



        //终点绘制
        huaban_2d.drawImage(
            home,
            this.end_x*gezi_size+5,
            this.end_y*gezi_size+5,
            gezi_size-10,
            gezi_size-10
        )

        //结束提示
        if(gameover)
        {
            huaban_2d.fillStyle=color.BLUE;
            huaban_2d.font="48px Arial";
            huaban_2d.textAlign="center";
            huaban_2d.fillText("恭喜你已完成挑战！！！",width/2,height/2);

            huaban_2d.font="24px Arial";
            huaban_2d.fillText("请点击“R”按钮，继续挑战",width/2,height/2+50);
        }
    }

    bfs_search(){
        let queue=[];
        const direction=[
                [0,1],
                [1,0],
                [0,-1],
                [-1,0]
            ];
        let visited=Array.from({length:this.height},()=>new Array(this.width).fill(0));
        queue.push([this.player_x,this.player_y]);
        visited[this.player_y][this.player_x]=1;
        while(queue.length>0)
        {
            let [x,y]=queue[0];
            if(x==this.end_x&&y==this.end_y)
            {
                return visited[y][x];
            }
            for(let i=0;i<4;i++)
            {
                let xx=x+direction[i][0];
                let yy=y+direction[i][1];
                if(xx>=1&&xx<=this.end_x&&yy>=1&&yy<=this.end_y&&visited[yy][xx]==0&&this.grid[yy][xx]==0)
                {
                    visited[yy][xx]=visited[y][x]+1;
                    queue.push([xx,yy]);
                }
            }
            queue.shift();
        }
    }

}

function initgame(){
    const shuchu=document.getElementById('min_step');
    const shuzumigong_x=Math.floor(width/gezi_size);
    const shuzumigong_y=Math.floor(height/gezi_size);
    migong=new Migong(shuzumigong_x,shuzumigong_y);
    let min_sum=migong.bfs_search();
    shuchu.textContent=min_sum;
    gameover=false;
    donghuaxunhuan();
}

function donghuaxunhuan(){
    migong.draw();
    requestAnimationFrame(donghuaxunhuan);
}

//响应键盘
function keyboard(e){
    switch(e.key) {
            case 'ArrowUp':
                migong.player_movement(0, -1);
                break;
            case 'ArrowDown':
                migong.player_movement(0, 1);
                break;
            case 'ArrowLeft':
                migong.player_movement(-1, 0);
                break;
            case 'ArrowRight':
                migong.player_movement(1, 0);
                break;
            case 'r':
            case 'R':
                initgame();
                break;
    }
}

document.addEventListener('keydown',keyboard);

initgame();