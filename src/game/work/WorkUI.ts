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
    private peopleItem: ResourceItem;
    private barBG: eui.Image;
    private maskMC: eui.Rect;
    private cdText: eui.Label;
    private upBtn: eui.Button;








    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list
        this.list.itemRenderer = WorkItem
        this.list.dataProvider = new eui.ArrayCollection(['food','wood','diamond','grass'])
        this.addBtnEvent(this.closeBtn,this.hide)
        this.addBtnEvent(this.upBtn,()=>{
            UseResourceUI.getInstance().show('雇佣仆从','每次可雇佣5位仆从','雇佣',
                {food:WorkManager.getInstance().getPeopleCost()},
                ()=>{
                    WorkManager.getInstance().addPeople();
                    this.renew();
                })
        })

        this.barBG.mask = this.maskMC

    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.WORK_CHANGE,this.renew)
        this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewList)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        MyTool.runListFun(this.list,'onUITimer')
        var cd = (TM.now() - WorkManager.getInstance().lastTime)
        this.cdText.text = DateUtil.getStringBySecond(30 - cd).substr(-5)
        this.maskMC.width = 200*cd/30
    }

    private renewList(){
        MyTool.renewList(this.list)
    }

    private renew(){
        var WM = WorkManager.getInstance();
        var num = WM.maxNum - WM.foodNum - WM.woodNum - WM.diamondNum - WM.grassNum
        this.peopleItem.setText('空闲：' + num)
        this.renewList();
        this.onTimer();
    }

}