class ChapterResultUI extends game.BaseUI {

    private static _instance:ChapterResultUI;
    public static getInstance() {
        if (!this._instance) this._instance = new ChapterResultUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "ChapterResultUISkin";
    }

    private titleText: eui.Label;
    private desText: eui.Label;
    private infoBtn: eui.Button;
    private btn0: eui.Button;
    private btn1: eui.Button;
    private btn2: eui.Button;
    private btn3: eui.Button;
    private rateText: eui.Label;




    public childrenCreated() {
        super.childrenCreated();
        //this.addBtnEvent(this.closeBtn,this.hide)
    }

    public onShow(){
        this.renew();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){

    }


    public renew(){

    }

}