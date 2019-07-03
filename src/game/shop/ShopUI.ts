class ShopUI extends game.BaseUI {

    private static _instance:ShopUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ShopUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "ShopUISkin";
    }

    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private foodItem: ResourceItem;
    private woodItem: ResourceItem;
    private coinItem: ResourceItem;
    private diamondItem: ResourceItem;
    private grassItem: ResourceItem;
    private bloodItem: ResourceItem;





    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

    }
}