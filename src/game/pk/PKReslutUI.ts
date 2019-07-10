class PKReslutUI extends game.BaseUI {

    private static _instance:PKReslutUI;
    public static getInstance() {
        if (!this._instance) this._instance = new PKReslutUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "PKReslutUISkin";
    }

    private r0: ResourceItem;
    private r1: ResourceItem;
    private r2: ResourceItem;
    private r3: ResourceItem;
    private r4: ResourceItem;
    private r5: ResourceItem;
    private titleText: eui.Label;
    private scroller: eui.Scroller;
    private list: eui.List;






    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }
}