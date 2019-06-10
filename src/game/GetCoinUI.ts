class GetCoinUI extends game.BaseUI {

    private static _instance: GetCoinUI;
    public static getInstance(): GetCoinUI {
        if(!this._instance)
            this._instance = new GetCoinUI();
        return this._instance;
    }

    private topUI: TopUI;
    private bottomUI: BottomUI;
    private scroller: eui.Scroller;
    private list: eui.List;




    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "GetCoinUISkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.bottomUI.setHide(this.onClose,this);
        this.topUI.setTitle('每日金币')

        this.scroller.viewport = this.list;
        this.list.itemRenderer = GetCoinItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();

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
        UM.testPassDay();

        UM.renewFriendNew(()=>{
            super.show()
        })

    }

    public hide() {
        MainPKUI.instance.hide();
        super.hide();
        GameUI.getInstance().onTimer();
    }

    public onShow(){
        this.renew();
        this.addPanelOpenEvent(GameEvent.client.pass_day,this.renew)
        this.addPanelOpenEvent(GameEvent.client.timer,this.onTimer)
    }

    private onTimer(){
        MyTool.runListFun(this.list,'onTimer')
    }


    public renew(){
        console.log(UM.isTest);
         var arr =[
            {type:1,title:'等陆第X天'},
            {type:2,title:'X小时后可领'},
        ]
        if(!UM.isTest)
        {
            arr.push({type:3,title:'体验更多小程序'})
            //arr.push({type:3,title:'告诉我的好友们'})
        }
        arr.push({type:4,title:'邀请X位新的好友'})
        arr.push({type:5,title:'观看广告'})
        arr.push({type:6,title:'射击游戏'})


        //arr.push({type:99,title:'DEBUG'})

            this.dataProvider.source = arr;
        this.dataProvider.refresh();
        //this.list.dataProvider = new eui.ArrayCollection(UM.history);
    }
}