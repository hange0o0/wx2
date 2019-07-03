class FeedChooseItem extends game.BaseItem{

    private mc: eui.Image;
    private lvText: eui.Label;
    private heroMC: eui.Image;


    public constructor() {
        super();
        this.skinName = "FeedChooseItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

    }


}