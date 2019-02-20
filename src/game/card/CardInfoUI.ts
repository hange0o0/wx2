class CardInfoUI extends game.BaseWindow {

    private static _instance: CardInfoUI;
    public static getInstance(): CardInfoUI {
        if(!this._instance)
            this._instance = new CardInfoUI();
        return this._instance;
    }

    private item: PKCardInfoUI;
    public con: eui.Image;
    private leftBtn: eui.Image;
    private rightBtn: eui.Image;
    private closeBtn: eui.Image;









    public list
    public index
    public data;

    public constructor() {
        super();
        this.skinName = "CardInfoUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.leftBtn,this.onLeft)
        this.addBtnEvent(this.rightBtn,this.onRight)



        //this.touchEnabled = false;
    }

    private onLeft(){
        this.index--;
        this.data = this.list[this.index];
        this.renew();
    }

    private onRight(){
        this.index++;
        this.data = this.list[this.index];
        this.renew();
    }



    public show(v?,list?,index=-1){
        this.data = v;
        this.list = list
        this.index = index;
        if(list && index==-1)
        {
            this.index = list.indexOf(this.data)
        }
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

        if(this.list && this.list.length > 1)
        {
            this.leftBtn.visible = true
            this.rightBtn.visible = true
            MyTool.changeGray(this.leftBtn,this.index == 0,true)
            MyTool.changeGray(this.rightBtn,this.index == this.list.length-1,true)
        }
        else
        {
            this.leftBtn.visible = false
            this.rightBtn.visible = false
        }
    }


}