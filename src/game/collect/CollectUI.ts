class CollectUI extends game.BaseUI {

    private static _instance:CollectUI;
    public static getInstance() {
        if (!this._instance) this._instance = new CollectUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "CollectUISkin";
    }

    private woodItem: ResourceItem;
    private grassItem: ResourceItem;
    private bloodItem: ResourceItem;
    private woodNeedItem: ResourceItem;
    private grassNeedItem: ResourceItem;
    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private upBtn: eui.Button;
    private splitBtn: eui.Button;
    private desText: eui.Label;






    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

        this.scroller.viewport = this.list;
        this.list.itemRenderer = CollectItem;

        this.addBtnEvent(this.upBtn,()=>{
            if(UM.ch)
            CollectManager.getInstance().levelUp()
        })

        this.addBtnEvent(this.splitBtn,()=>{

        })


    }

    public onShow(){
        this.renew();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){
        var CLM = CollectManager.getInstance();

       this.woodItem.renew()
       this.grassItem.renew()
       this.bloodItem.renew()


        var need = CLM.getUpCost();
        this.woodNeedItem.data =  need.wood
        this.grassNeedItem.data =  need.grass
    }

    public resetList(){
        var scrollV = this.scroller.viewport.scrollV;
        this.renew();
        this.scroller.validateNow()
        this.scroller.viewport.scrollV = scrollV;
    }
    public renewList(){
        MyTool.renewList(this.list);
    }

    public renew(){
        var CLM = CollectManager.getInstance();
        CLM.onTimer();
        this.setHtml(this.desText,'当前虫洞等级：'+ this.createHtml('LV.' + CLM.level,0xFFFF00) + '，可容纳：' +
            this.createHtml(CLM.list.length + '/' + CLM.maxNum,CLM.list.length < CLM.maxNum?0xFFFF00:0x00ff00))
        this.list.dataProvider = new eui.ArrayCollection(CLM.list);
        this.onCoinChange();
    }
}