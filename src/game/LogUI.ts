class LogUI extends game.BaseUI {

    private static _instance: LogUI;
    public static getInstance(): LogUI {
        if(!this._instance)
            this._instance = new LogUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desText: eui.Label;




    public constructor() {
        super();
        this.skinName = "LogUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.onClose,this);
        this.topUI.setTitle('投注日志')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = LogItem

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
        this.list.dataProvider = new eui.ArrayCollection(UM.history);
    }


    public showHistory(userData,roundData){
        var PKM = PKManager.getInstance();
        var costData = PKM.getCost(roundData.seed,60*10)
        this.addChild(MainPKUI.instance);
        MainPKUI.instance.top = 60
        MainPKUI.instance.bottom = 100
        MainPKUI.instance.show({
            key:userData.key,
            list1:roundData.list1,
            list2:roundData.list2,
            seed:roundData.seed,
            force1:PKM.getForceAdd(costData.cost1 + userData.teamCost1) + PKM.baseForce,
            force2:PKM.getForceAdd(costData.cost2 + userData.teamCost2) + PKM.baseForce
        });

    }

}