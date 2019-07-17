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
        var vo = MonsterVO.getObject(this.data.id);
        //this.scaleX = this.scaleY = 0.8 + (this.data.level-this.data.minLevel)/(this.data.maxLevel-this.data.minLevel + 1)*0.5
        //this.skillBG.source = HeroManager.getInstance().getSkillBG(this.data.skill)
        this.mc.source = vo.getThumb()
        this.width = this.height = 120*this.data.rate
        this.anchorOffsetX = this.anchorOffsetY = this.width/2

        this.r = this.width/2;

        this.hp = this.maxHp = Math.round(this.data.level*Math.pow(this.data.rate,6));
        this.isDie = 0;
        this.renewHp();

        this.shape.x = this.r
        this.shape.y = this.r
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