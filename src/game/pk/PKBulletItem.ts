class PKBulletItem extends game.BaseItem{
    private static pool = [];
    public static id = 1;
    public static createItem():PKBulletItem {
        var item:PKBulletItem = this.pool.pop();
        if (!item) {
            item = new PKBulletItem();
            item.id = this.id;
            this.id++
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        if (this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }

    public constructor() {
        super();
        this.skinName = "PKBulletItemSkin";
    }

    private skillBG: eui.Image;
    private mc: eui.Image;



    public id

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 60/2
        this.anchorOffsetY = 60/2
        this.touchChildren = this.touchEnabled = false;
    }

    public dataChanged(){
        var vo = MonsterVO.getObject(this.data.id);
        this.mc.source = vo.getThumb()
    }

    public move(){
        var speed = 30;
        this.x += speed*Math.cos(this.data.rota)
        this.y += speed*Math.sin(this.data.rota)// + 1;
    }

    public testHit(arr){
        var r = 30;
        if(this.x < r)
        {
            this.data.rota = Math.PI-this.data.rota
            this.x = r;
        }
        else if(this.x > 640-r)
        {
            this.data.rota = Math.PI-this.data.rota
            this.x = 640-r
        }
        else if(this.y < r)
        {
            this.data.rota = -this.data.rota
            this.y = r
        }

        for(var i=0;i<arr.length;i++)
        {
            var item = arr[i];
            if(item.isDie)
                continue;
            var len = item.r + r;
            if(item.type == 2)
            {
                //if()
                //if(this.x < r)
                //{
                //    this.data.rota = Math.PI-this.data.rota
                //    this.x = r;
                //}
                //else if(this.x > 640-r)
                //{
                //    this.data.rota = Math.PI-this.data.rota
                //    this.x = 640-r
                //}
                //else if(this.y < r)
                //{
                //    this.data.rota = -this.data.rota
                //    this.y = r
                //}
            }
            else if(MyTool.getDis(item,this) <= len)//碰到
            {
                var myAngel = this.data.rota
                var angle = Math.atan2(item.y-this.y,item.x-this.x)///Math.PI*180
                var rota = angle - myAngel;
                this.data.rota = myAngel - Math.PI + 2*rota

                this.x = item.x - Math.cos(angle)*len
                this.y = item.y - Math.sin(angle)*len

                if(item.type == 1)
                    item.addHp(-1);
                else
                {

                }

                break;
            }
        }
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this)
    }
}