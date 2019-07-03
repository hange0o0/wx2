class FeedUnlockItem extends game.BaseItem{

    private headMC: eui.Image;
    private headMask: eui.Rect;



    public constructor() {
        super();
        this.skinName = "FeedUnlockItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.headMC.mask = this.headMask
    }

    public dataChanged():void {
        this.headMC.source = 'common_head_bg_jpg'
        if(this.data)
        {
            this.headMC.visible = true
            this.headMC.source = this.data;
        }
        else
        {
            this.headMC.visible = false
        }

    }


}