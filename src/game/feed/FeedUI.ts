class FeedUI extends game.BaseUI {

    private static _instance:FeedUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedUISkin";
    }

    private woodItem: ResourceItem;
    private wormItem: ResourceItem;
    private coinItem: ResourceItem;
    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desText: eui.Label;






    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

    }
}