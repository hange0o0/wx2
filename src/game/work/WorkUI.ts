class WorkUI extends game.BaseUI {

    private static _instance:WorkUI;
    public static getInstance() {
        if (!this._instance) this._instance = new WorkUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "WorkUISkin";
    }

    private closeBtn: eui.Image;
    private scroller: eui.Scroller;
    private list: eui.List;
    private foodNeedItem: ResourceItem;
    private upBtn: eui.Button;
    private peopleItem: ResourceItem;





    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list
        this.list.itemRenderer = WorkItem
        this.list.dataProvider = new eui.ArrayCollection(['food','wood','diamond','grass'])
        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.upBtn,()=>{
             if(!UM.checkResource({food:WorkManager.getInstance().getPeopleCost()}))
                return;
            WorkManager.getInstance().addPeople();
            this.renew();
        })

    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.WORK_CHANGE,this.renew)
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewList)
    }

    private renewList(){
        MyTool.renewList(this.list)
    }

    private renew(){
        var WM = WorkManager.getInstance();
        this.foodNeedItem.data = WM.getPeopleCost();
        var num = WM.maxNum - WM.foodNum - WM.woodNum - WM.diamondNum - WM.grassNum
        this.peopleItem.setText('空闲：' + num)
        this.renewList();
    }

}