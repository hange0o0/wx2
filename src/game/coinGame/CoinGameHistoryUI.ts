class CoinGameHistoryUI extends game.BaseUI {

    private static _instance: CoinGameHistoryUI;
    public static getInstance(): CoinGameHistoryUI {
        if(!this._instance)
            this._instance = new CoinGameHistoryUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;




    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "CoinGameHistoryUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.hide,this);
        this.topUI.setTitle('已完成关卡（'+(UM.chapterLevel - 1)+'）')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CoinGameHistoryItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();

    }


    public show(){
        super.show()
    }

    public hide() {
        super.hide();
    }

    public onShow(){
        this.renew();
    }


    public renew(){
        var arr = [];
        for(var i=UM.chapterLevel-1;i>0;i--)
        {
            arr.push(i);
        }
        this.dataProvider.source = arr;
        this.dataProvider.refresh();
        //this.list.dataProvider = new eui.ArrayCollection(UM.history);
    }


}