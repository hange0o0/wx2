class CreateMapItem extends game.BaseItem{
    private static pool = [];
    public static createItem():CreateMapItem{
        var item:CreateMapItem = this.pool.pop();
        if(!item)
        {
            item = new CreateMapItem();
        }
        item.scaleX = item.scaleY = 1;
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


    public constructor() {
        super();
        this.skinName = "CreateMapItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.anchorOffsetX = 60
        this.anchorOffsetY = 60
        DragManager.getInstance().setDrag(this)


        MyTool.addDoubleTouch(this,()=>{
            CreateMapUI.getInstance().showTips(this)
        })
    }

    public dataChanged():void {
        this.scaleX = this.scaleY = this.data.scale;
    }

    public remove(){
        MyTool.removeMC(this);
    }


}