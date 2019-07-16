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
    }

    public dataChanged(){

    }

    public move(){
        var speed = 30
        this.x += speed*Math.cos(this.data.rota)
        this.y += speed*Math.sin(this.data.rota)
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
    }

    public remove(){
        MyTool.removeMC(this);
    }
}