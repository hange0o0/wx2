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




    private bitmap: egret.Bitmap;
    private isdisplay = false;

    private isSendConfig:boolean;
    private isLoadFile:boolean;


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

    }

    private onTab(){
        this.renew();
    }


    public onShow(){
        var arr = [{label:'收益世界榜'},{label:'关卡世界榜'},{label:'收益好友榜'},{label:'关卡好友榜'}]
        this.tab.width = 600;
        this.tab.dataProvider = new eui.ArrayCollection(arr)
        this.renew();
    }


    public renew(){
        if(!window['wx'])
            return;
        this.remove();
        if(this.tab.selectedIndex == 0)
        {
            this.worldRank('coin',UM.coinwin);
        }
        else if(this.tab.selectedIndex == 1)
        {
            this.worldRank('level',UM.chapterLevel);
        }
        else
        {
              this.showBitmapList()
        }
    }

    private worldRank(type,myValue){
        var wx = window['wx'];
        if(!wx)
        {
            return;
        }
        var oo = {
            type:type,
            openid:UM.gameid,
            nick:UM.nick,
            head:UM.head,
            value:myValue,
        }
        if(this.rankData[oo.type])
        {
            this.showRank(type);
            return;
        }
        wx.cloud.callFunction({      //取玩家openID,
            name: 'getRank',
            data: oo,
            complete: (res) => {
                this.rankData[oo.type] = {
                    list:res.result,
                    time:TM.now()
                }
                this.showRank(type);
            },
            fail:()=>{

            }
        })
        //    }
        //})
    }

    public showRank(type){
        this.scroller.visible = true;
        var arr = this.rankData[type].list;
        var b = false;
        var myScore = type=='coin'?UM.coinwin:UM.chapterLevel;
        for(var i=0;i<arr.length;i++) //更新自己成绩
        {
            arr[i].type = type;
            if(arr[i].openid == UM.gameid)
            {
                arr[i].value = myScore;
                arr[i].nick = UM.nick;
                arr[i].head = UM.head;
                b = true;
            }
            if(arr[i].value < 1)
            {
                arr.splice(i,1);
                i--;
            }
        }
        if(!b && UM.nick && arr.length<50 && myScore > 1)
        {
            arr.push({
                nick:UM.nick,
                value:myScore,
                head:UM.head,
            })
        }
        ArrayUtil.sortByField(arr,['value'],[1])
        for(var i=0;i<arr.length;i++) //更新自己成绩
        {
            arr[i].index = i+1;
        }
        this.list.dataProvider = new eui.ArrayCollection(arr)
    }

    private poseData(){
        if(this.tab.selectedIndex == 2)
        {
            var key = 'coinwin'
            var value = UM.coinwin;
        }
        else if(this.tab.selectedIndex == 3)
        {
            var key = 'level'
            var value = UM.chapterLevel
        }

        let param:any = {
            me: UM.gameid,
            command: 'open',
            key:key,
            rankHeight:GameManager.uiHeight-130-110,
            x:this.bitmap.x,// + (GameManager.uiWidth - this.width)/2,
            y:this.bitmap.y + (GameManager.uiHeight - this.height)/2 + (GameManager.isLiuHai()?50:0),
            me_value: value + ',0', //第2位时间传0，永远排在最上面
            root: "openDataContext/",
        }

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
        this.scroller.visible = false;
    }
    public hide(){
        this.remove();
        super.hide();
    }
}