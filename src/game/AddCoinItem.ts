class AddCoinItem extends game.BaseItem{

    private static pool = [];
    public static createItem():AddCoinItem {
        var item:AddCoinItem = this.pool.pop();
        if (!item) {
            item = new AddCoinItem();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        this.pool.push(item);
    }

    public static showMV(v,con)
    {
        var mc = this.createItem();
        mc.data = '+' + v;
        mc.horizontalCenter = 0
        mc.verticalCenter = 0
        mc.alpha = 1
        con.addChild(mc);
        egret.Tween.get(mc).wait(200).to({verticalCenter:-200,alpha:0},500).call(()=>{
            this.freeItem(mc);
        })
    }



    private addText: eui.Label;

    public constructor() {
        super();
        this.touchChildren = this.touchEnabled = false;
        this.skinName = "AddCoinItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {
        this.addText.text = this.data;
    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this);
    }

}