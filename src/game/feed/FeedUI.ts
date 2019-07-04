class FeedUI extends game.BaseUI {

    private static _instance:FeedUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedUISkin";
    }

    private woodItem: ResourceItem;
    private wormItem: ResourceItem;
    private coinItem: ResourceItem;
    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;






    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = FeedItem
        this.list.dataProvider = new eui.ArrayCollection([1,2,3,4,5,6,7,8,9,10,11,12])

        this.addBtnEvent(this.closeBtn,this.hide)

    }

    public onShow(){
        CollectManager.getInstance().onTimer();
        this.renewList();
        this.renewCoin();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewCoin)
        this.addPanelOpenEvent(GameEvent.client.FEED_CHANGE,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }


    private onTimer(){
        MyTool.runListFun(this.list,'onTimer')
    }

    private renewList(){
        MyTool.renewList(this.list)
    }

    private renewCoin(){
        this.woodItem.renew()
        this.wormItem.renew()
        this.coinItem.renew()
    }
}