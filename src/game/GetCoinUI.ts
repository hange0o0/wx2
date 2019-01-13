class GetCoinUI extends game.BaseUI {

    private static _instance: GetCoinUI;
    public static getInstance(): GetCoinUI {
        if(!this._instance)
            this._instance = new GetCoinUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;




    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "GetCoinUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.onClose,this);
        this.topUI.setTitle('获取金币')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = GetCoinItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();

    }

    public onClose(){
        if(MainPKUI.instance.visible && MainPKUI.instance.parent == this)
        {
            MainPKUI.instance.hide();
            return;
        }
        this.hide();
    }


    public show(){
        super.show()
    }

    public hide() {
        MainPKUI.instance.hide();
        super.hide();
        GameUI.getInstance().onTimer();
    }

    public onShow(){
        this.renew();
    }


    public renew(){
        this.dataProvider.source =[1,1,1]
        this.dataProvider.refresh();
        //this.list.dataProvider = new eui.ArrayCollection(UM.history);
    }



}