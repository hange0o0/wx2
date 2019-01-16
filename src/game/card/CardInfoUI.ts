class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    public con: eui.Group;
    private closeBtn: eui.Image;








    public data;

    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.closeBtn,this.hide)



        //this.touchEnabled = false;
    }



    public show(v?){
        this.data = v;
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){

        this.renew();

    }

    public showFinish(){
         GuideManager.getInstance().testShowGuide()
    }



    public renew(){
        this.item.renew({
            mid:this.data,
            force:100,
        });
    }


}