class CreateMapItem extends game.BaseItem{
    private static pool = [];
    public static createItem():CreateMapItem{
        var item:CreateMapItem = this.pool.pop();
        if(!item)
        {
            item = new CreateMapItem();
        }
        item.scaleX = item.scaleY = 1;
        item.width = item.height = 120;
        item.anchorOffsetX = 60
        item.anchorOffsetY = 60
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


    public type
    public isChoose = false
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


        this.addBtnEvent(this,(e)=>{
             CreateMapUI.getInstance().setChoose(this)
        })
    }

    public dataChanged():void {
        this.scaleX = this.scaleY = this.data.scale;
        this.setChoose(false)
    }

    public remove(){
        MyTool.removeMC(this);
    }

    public setChoose(b){
        this.isChoose = b;
        this.mc.source = b?'border2_png':'border1_png'
    }

    public setType(type){
         this.type = type;
        if(this.type == 1)
            this.skillBG.source = 'border1_png'
        else if(this.type == 2)
        {
            this.skillBG.source = 'white_bg_png'
            this.scaleX = this.scaleY = 1

        }
        else if(this.type == 3)
            this.skillBG.source = 'border3_png'
    }

    public resetWH(w,h){
        this.width = w
        this.height = h
        this.anchorOffsetX = w/2
        this.anchorOffsetY = h/2
    }


}