class RankUI extends game.BaseUI{

    private static _instance:RankUI;
    public static getInstance() {
        if (!this._instance) this._instance = new RankUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private tab: eui.TabBar;



    private bitmap: egret.Bitmap;
    private isdisplay = false;

    private isSendConfig:boolean;
    private isLoadFile:boolean;


    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('好友排行')
        this.bottomUI.setHide(this.hide,this)
        //this.addBtnEvent(this.closeBtn,this.hide)
        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
        this.touchEnabled = false;

    }

    private onTab(){
        this.showBitmapList();
    }
    public onShow(){
        if(!window['wx'])
            return;

        var arr = [{label:'金币排行'},{label:'收益排行'},{label:'关卡排行'},{label:'胜率排行'}]
        if(UM.total < Config.openRate)
        {
            arr.pop();
            this.tab.width = 450
        }
        else
        {
            this.tab.width = 560
        }
        this.tab.dataProvider = new eui.ArrayCollection(arr)
        this.showBitmapList();
    }

    private poseData(){
        if(this.tab.selectedIndex == 0)
        {
            var key = 'coin'
            var value = UM.coin
        }
        else if(this.tab.selectedIndex == 1)
        {
            var key = 'coinwin'
            var value = UM.coinwin
        }
        else if(this.tab.selectedIndex == 2)
        {
            var key = 'level'
            var value = UM.chapterLevel
        }
        else if(this.tab.selectedIndex == 3)
        {
            var key = 'winrate'
            var value = UM.win/UM.total
        }

        let param:any = {
            me: UM.gameid,
            command: 'open',
            key:key,
            rankHeight:GameManager.uiHeight-130-110,
            x:this.bitmap.x,// + (GameManager.uiWidth - this.width)/2,
            y:this.bitmap.y + (GameManager.uiHeight - this.height)/2 + GameManager.offsetHeight,
            me_value: value + ',0', //第2位时间传0，永远排在最上面
            root: "openDataContext/",
        }
        //传递 静态配置数据到 开放域
        //if(this.isdisplay && !this.isSendConfig){
        //    //param.q_fruit = CMFR.q_fruit.data;
        //
        //    this.isSendConfig = true;
        //}

        //发送消息
        var platform = window['platform']
        platform.openDataContext.postMessage(param);
    }

    //0 好友榜，2群排行
    public showBitmapList(){
        if(!window["wx"] || !window["wx"].getOpenDataContext) return;
        this.remove();
        var platform = window['platform']
        if (!this.isdisplay) {

            this.bitmap = platform.openDataContext.createDisplayObject(null, this.stage.stageWidth, this.stage.stageHeight);
            this.bitmap.x = 10;
            this.bitmap.y = 130;
            this.addChild(this.bitmap);
            this.bitmap.touchEnabled = false

            this.isdisplay = true;
            this.poseData();
        }
    }

    protected remove(){
        var platform = window['platform']
        if(this.isdisplay){
            this.isdisplay = false;
            this.bitmap.parent && this.bitmap.parent.removeChild(this.bitmap);

            if(platform.openDataContext){
                platform.openDataContext.postMessage({ command: 'close' });
            }
        }
    }
    public hide(){
        this.remove();
        super.hide();
    }
}