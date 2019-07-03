class FeedUnlockUI extends game.BaseUI {

    private static _instance:FeedUnlockUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedUnlockUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedUnlockUISkin";
    }

    private list: eui.List;
    private unlockBtn: eui.Button;
    private desText: eui.Label;
    private woodItem: ResourceItem;






    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }
}