class HeroUI extends game.BaseUI {

    private static _instance:HeroUI;
    public static getInstance() {
        if (!this._instance) this._instance = new HeroUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "HeroUISkin";
    }


    private woodItem: ResourceItem;
    private diamondItem: ResourceItem;
    private bloodItem: ResourceItem;
    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desText: eui.Label;
    private upBtn: eui.Button;
    private rebornBtn: eui.Button;










    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.closeBtn,this.hide)

        this.scroller.viewport = this.list;
        this.list.itemRenderer = HeroItem;

        this.addBtnEvent(this.upBtn,()=>{
            UseResourceUI.getInstance().show('升级蛊巢','升级蛊巢，可提高蛊巢容量，增加出战蛊虫数量','升级',
                HeroManager.getInstance().getUpCost(),
                ()=>{
                    HeroManager.getInstance().levelUp()
                    this.renew();
                })
        })

        this.addBtnEvent(this.rebornBtn,()=>{
           HeroManager.getInstance().rebornAll();
        })
    }

    public onShow(){
        this.renew();

        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
        this.addPanelOpenEvent(GameEvent.client.HERO_CHANGE,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.HERO_NUM_CHANGE,this.resetList)
    }

    private onCoinChange(){
        this.woodItem.renew()
        this.diamondItem.renew()
        this.bloodItem.renew()
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
        var HM = HeroManager.getInstance();
        this.renewInfo();
        ArrayUtil.sortByField(HM.list,['exp'],[1])
        this.list.dataProvider = new eui.ArrayCollection(HM.list);
        this.onCoinChange();
    }

    public renewInfo(){
        var HM = HeroManager.getInstance();
        this.setHtml(this.desText,'当前等级：'+ this.createHtml('LV.' + HM.level,0xFFFF00) + '，可容纳：' +
            this.createHtml(HM.list.length + '/' + HM.heroNum,HM.list.length < HM.heroNum?0xFFFF00:0x00ff00)+ '，单次出战：' +
            this.createHtml(HM.pkNum,0xFFFF00))
    }
}