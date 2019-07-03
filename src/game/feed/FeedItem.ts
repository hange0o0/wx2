class FeedItem extends game.BaseItem{

    private boxMC: eui.Image;
    private barMC: eui.Image;
    private btn: eui.Button;
    private lockText: eui.Label;


    public constructor() {
        super();
        this.skinName = "FeedItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

    }


}