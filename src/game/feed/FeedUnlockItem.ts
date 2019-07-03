class FeedUnlockItem extends game.BaseItem{

    private headMC: eui.Image;
    private headMask: eui.Rect;



    public constructor() {
        super();
        this.skinName = "FeedUnlockItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

    }


}