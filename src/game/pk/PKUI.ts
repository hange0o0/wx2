class PKUI extends game.BaseUI {

    private static _instance:PKUI;
    public static getInstance() {
        if (!this._instance) this._instance = new PKUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKUISkin";
    }

    private woodText: eui.Label;
    private grassText: eui.Label;
    private bloodText: eui.Image;
    private needWoodText: eui.Label;
    private needGrassText: eui.Label;
    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private upBtn: eui.Button;
    private splitBtn: eui.Button;
    private desText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

    }
}