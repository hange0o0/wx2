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

    private woodText: eui.Label;
    private grassText: eui.Label;
    private bloodText: eui.Label;
    private needWoodText: eui.Label;
    private needGrassText: eui.Label;
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

        })

        this.addBtnEvent(this.splitBtn,()=>{

        })


    }

    public onShow(){
        this.renew();
        this.onCoinChange();
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.onCoinChange)
    }

    private onCoinChange(){
        var CLM = CollectManager.getInstance();
        var WM = WorkManager.getInstance();
        this.woodText.text = NumberUtil.addNumSeparator(UM.wood)
        this.grassText.text = NumberUtil.addNumSeparator(UM.grass)
        this.bloodText.text = NumberUtil.addNumSeparator(UM.blood)

        this.woodText.textColor = UM.wood< WM.woodMax?0xFFFFFF:0x00ff00;
        this.grassText.textColor = UM.grass< WM.grassMax?0xFFFFFF:0x00ff00;


        var need = CLM.getUpCost();
        this.needWoodText.textColor = UM.wood < need.wood?0xFF0000:0xFFFFFF
        this.needGrassText.textColor = UM.grass < need.grass?0xFF0000:0xFFFFFF
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
        this.setHtml(this.desText,'当前虫洞等级：'+ this.createHtml('LV.' + CLM.level,0xFFFF00) + '，可容纳' +
            this.createHtml(CLM.list.length + '/' + CLM.maxNum,CLM.list.length < CLM.maxNum?0xFFFF00:0x00ff00))
        this.list.dataProvider = new eui.ArrayCollection(CLM.list);
        var need = CLM.getUpCost();
        this.needWoodText.text = NumberUtil.addNumSeparator(need.wood)
        this.needGrassText.text = NumberUtil.addNumSeparator(need.grass)
    }
}