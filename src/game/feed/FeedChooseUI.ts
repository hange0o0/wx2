class FeedChooseUI extends game.BaseWindow {

    private static _instance:FeedChooseUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedChooseUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedChooseUISkin";
    }

    private changeBtn: eui.Button;
    private allBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;





    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }
}