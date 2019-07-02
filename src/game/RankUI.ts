class RankUI extends game.BaseUI{

    private static _instance:RankUI;
    public static getInstance() {
        if (!this._instance) this._instance = new RankUI();
        return this._instance;
    }

    private scroller: eui.Scroller;
    private list: eui.List;
    private topUI: TopUI;
    private bottomUI: BottomUI;
    private tab: eui.TabBar;
    private desText: eui.Label;
    private userBtn: eui.Image;





    private bitmap: egret.Bitmap;
    private isdisplay = false;

    private isSendConfig:boolean;
    private isLoadFile:boolean;



    //private tips = ['世界榜中的数据存在一定的延时']
    private infoBtn:UserInfoBtn


    private rankData = {}
    public constructor() {
        super();
        this.skinName = "RankUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.topUI.setTitle('排行榜')
        this.bottomUI.setHide(this.hide,this)
        //this.addBtnEvent(this.closeBtn,this.hide)
        this.tab.addEventListener(eui.ItemTapEvent.ITEM_TAP,this.onTab,this);
        this.tab.selectedIndex = 0;
        this.touchEnabled = false;

        this.scroller.viewport  =this.list;
        this.list.itemRenderer = RankItem;

        this.infoBtn = new UserInfoBtn(this.userBtn, (res)=>{
            this.renewInfo(res);
        }, this,  Config.localResRoot + "wx_btn_info.png");

    }

    private renewInfo(res?){
        var wx = window['wx'];
        if(!wx)
            return;
        if(res && res.userInfo)
        {
            this.infoBtn.visible = false;
            UM.renewInfo(res.userInfo)
            this.renew();
        }
    }

    private onTab(){
        this.renew();
    }


    public onShow(){
        var arr = [{label:'世界积分'},{label:'世界关卡'},{label:'好友积分'},{label:'好友关卡'}]
        this.tab.width = 600;
        this.tab.dataProvider = new eui.ArrayCollection(arr)
        this.renew();
    }


    public renew(){
        if(!window['wx'])
            return;
        this.remove();

        this.showBitmapList()
    }



    private poseData(){
        if(this.tab.selectedIndex == 2)
        {
            var key = 'coin'
            var oldKey = 'coinwin'
        }
        else if(this.tab.selectedIndex == 3)
        {
            var key = 'chapter'
            var oldKey = 'level'
            var value = UM.chapterLevel
        }

        let param:any = {
            me: UM.gameid,
            command: 'open',
            key:key,
            key2:oldKey,
            rankHeight:GameManager.uiHeight-130-110,
            x:this.bitmap.x,// + (GameManager.uiWidth - this.width)/2,
            y:this.bitmap.y + (GameManager.uiHeight - this.height)/2 + (GameManager.isLiuHai()?50:0),
            me_value: value, //第2位时间传0，永远排在最上面
            root: "openDataContext/",
        }

        //发送消息
        var platform = window['platform']
        platform.openDataContext.postMessage(param);
        this.desText.text = '赶快邀请好友来一起比拼吧！';
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
        this.scroller.visible = false;
        this.infoBtn.visible = false;
        this.desText.text = ''
    }
    public hide(){
        this.remove();
        super.hide();
    }
}