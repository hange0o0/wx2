class WorkUI extends game.BaseUI {

    private static _instance:WorkUI;
    public static getInstance() {
        if (!this._instance) this._instance = new WorkUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "WorkUISkin";
    }

    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private foodNeedItem: ResourceItem;
    private upBtn: eui.Button;
    private peopleItem: ResourceItem;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

    }
}