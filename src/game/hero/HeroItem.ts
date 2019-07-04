class HeroItem extends game.BaseItem{

    private skillBG: eui.Image;
    private mc: eui.Image;
    private txt: eui.Label;
    private lvText: eui.Label;
    private icon: eui.Image;


    public constructor() {
        super();
        this.skinName = "HeroItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

    }


}