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

    private bg: eui.Image;





    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }
}