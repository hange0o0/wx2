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


    public lastMove
    public ox
    public oy

    public constructor() {
        super();
        this.skinName = "PKItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 60
        this.anchorOffsetY = 60
    }

    public dataChanged():void {
        var vo = MonsterVO.getObject(this.data.id);
        this.scaleX = this.scaleY = 0.8 + (this.data.level-this.data.minLevel)/(this.data.maxLevel-this.data.minLevel + 1)*0.5
        this.skillBG.source = HeroManager.getInstance().getSkillBG(this.data.skill)
        this.mc.source = vo.getThumb()
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this)
    }


}