class HeroInfoUI extends game.BaseUI {

    private static _instance:HeroInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new HeroInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectUISkin";
    }

    private bloodItem: ResourceItem;
    private bloodItem2: ResourceItem;
    private mc: eui.Image;
    private lockBtn: eui.Button;
    private splitBtn: eui.Button;
    private barMC: eui.Image;
    private skillText: eui.Label;





    private data;
    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)

    }

    public show(data?){
        this.data = data;
        super.show();
    }
}