class WorkUpUI extends game.BaseUI {

    private static _instance:WorkUpUI;
    public static getInstance() {
        if (!this._instance) this._instance = new WorkUpUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "WorkUpUISkin";
    }

    private woodItem: ResourceItem;
    private desText: eui.Label;
    private upBtn: eui.Button;
    private icon: WorkIcon;





    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }
}