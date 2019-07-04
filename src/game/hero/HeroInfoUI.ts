class HeroInfoUI extends game.BaseWindow {

    private static _instance:HeroInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new HeroInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "HeroInfoUISkin";
    }

    private bloodItem: ResourceItem;
    private bloodItem2: ResourceItem;
    private skillBG: eui.Image;
    private mc: eui.Image;
    private icon: eui.Image;
    private feedBtn: eui.Button;
    private splitBtn: eui.Button;
    private barMC: eui.Image;
    private skillText: eui.Label;








    private data;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.feedBtn,()=>{

        })
        this.addBtnEvent(this.splitBtn,()=>{

        })

    }

    public show(data?){
        this.data = data;
        super.show();
    }
}