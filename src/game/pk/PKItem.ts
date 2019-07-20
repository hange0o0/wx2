class PKItem extends game.BaseItem{
    private static pool = [];
    public static createItem():PKItem{
        var item:PKItem = this.pool.pop();
        if(!item)
        {
            item = new PKItem();
        }
        return item;
    }
    public static freeItem(item){
        if(!item)
            return;
        item.remove();
        if(this.pool.indexOf(item) == -1)
            this.pool.push(item);
    }


    private skillBG: eui.Image;
    private mc: eui.Image;

    public r;
    public hp = 10
    public maxHp = 10
    public isDie = 0
    public type = 0

    private shape = new egret.Shape()

    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addChildAt(this.shape,1);

    }

    public dataChanged():void {
        this.type = this.data.type;
        if(this.type == 1)
        {
            this.skillBG.source = 'border1_png'
            var vo = MonsterVO.getObject(this.data.id);
            this.mc.source = vo.getThumb()
            this.hp = this.maxHp = Math.round(this.data.level*Math.pow(this.data.rate,6));
            this.isDie = 0;
            this.renewHp();
            this.r = this.width/2;
            this.shape.x = this.r
            this.shape.y = this.r
            this.width = this.height = 120*this.data.rate
        }
        else if(this.type == 2)
        {
            this.skillBG.source = 'white_bg_png'
            this.mc.source = ''
            this.width = this.data.width
            this.height = this.data.height
        }
        else if(this.type == 3)
        {
            this.skillBG.source = 'border3_png'
            this.width = this.height = 120*this.data.rate
            this.mc.source = ''
            this.r = this.width/2;
        }

        this.anchorOffsetX = this.width/2
        this.anchorOffsetY = this.height/2
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this);
    }

    private renewHp(){
        MyTool.getSector(this.r-3,-90,-this.hp/this.maxHp*360,0x990000,1,this.shape)
    }

    public addHp(v){
        PKUI.getInstance().playItemText(this,v)
        this.hp += v;
        if(this.hp <= 0)
        {
            this.hp = 0;
            this.setDie()
        }
        this.renewHp();
    }

    private setDie(){
        this.isDie = 1;
        egret.Tween.get(this).to({alpha:0},500).call(()=>{
            this.isDie = 2;
        })
    }


}