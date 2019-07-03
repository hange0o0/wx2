class FeedInfoUI extends game.BaseWindow {

    private static _instance:FeedInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedInfoUISkin";
    }

    private upBtn: eui.Button;
    private startBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private woodItem: ResourceItem;
    private diamondItem: ResourceItem;
    private desText: eui.Label;






    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }
}