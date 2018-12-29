class GameUI extends game.BaseUI {

    private static _instance:GameUI;
    public static getInstance() {
        if (!this._instance) this._instance = new GameUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "GameUISkin";
    }

    private team1: TeamUI;
    private team2: TeamUI;
    private coinGroup: eui.Group;
    private cdText: eui.Label;
    private coinText: eui.Label;
    private bottomGroup: eui.Group;
    private shopBtn: eui.Group;
    private shopRedMC: eui.Image;
    private rankBtn: eui.Group;
    private mailBtn: eui.Group;
    private mailRed: eui.Image;
    private settingBtn: eui.Group;
    private mainPKUI: MainPKUI;


    public showIndex = -1;
    public showData;
    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.settingBtn,this.onClick)
        this.addBtnEvent(this.mailBtn,this.onMail)

        this.team1.teamID = 1
        this.team2.teamID = 2
    }

    public onClick(){
        this.mainPKUI.show();
    }
    public onMail(){
        this.mainPKUI.hide();
    }

    public show(){
        this.loadLevelData(()=>{
            super.show();
        })

    }

    private loadLevelData(fun){
        var loader: egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.once(egret.Event.COMPLETE,()=>{
            PKManager.getInstance().initData(loader.data);
            fun && fun();
        },this);

        var t = 1546012800;//2018-12-29
        var index = Math.ceil((TM.now() - t)/24/3600)
        var url = 'resource/level/level_'+index+'.txt'
        loader.load(new egret.URLRequest(url));
    }


    public onShow(){
        this.mainPKUI.visible = false;
        this.showIndex = -1;
         this.onTimer();

        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    public onTimer(){
        var PKM = PKManager.getInstance();
        var index = PKM.getCurrentIndex()
        if(index != this.showIndex)
        {
            this.showIndex = index;
            this.showData = PKM.getCurrentData();
            this.team1.showList(this.showData.list1.split(','))
            this.team2.showList(this.showData.list2.split(','))
        }

        var cd = PKM.getEndTime() - TM.now();
        this.cdText.text = DateUtil.getStringBySecond(cd).substr(-5);

        var costData = PKM.getCost(this.showData.seed,60*10 - cd)
        this.team1.renewCost(costData);
        this.team2.renewCost(costData);
    }


}