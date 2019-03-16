class ChangeUserUI extends game.BaseContainer {



    private list: eui.List;
    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "ChangeUserUISkin";
    }

    public adList = []
    private lastGetADTime = 0;
    public getAD(fun?){
        var wx = window['wx'];
        //console.log(333333)
        if(!wx) {
            MyTool.removeMC(this);
            return;
        }
        if(TM.now() - this.lastGetADTime < 5*60)
            return;
        this.adList.length = 0;
        var self = this
        wx.wladGetAds(10,function (res) { //第⼀一个参数为获取⼴广告条数，第⼆二个参数为获取成功后回调⽅方法;
            //console.log(res);
            self.lastGetADTime = TM.now();
            self.adList = res.data;
            self.renew();
            fun && fun();
        })
    }

    public childrenCreated() {
        super.childrenCreated();
        this.list.itemRenderer = ChangeUserItem
        this.list.dataProvider = this.dataProvider = new eui.ArrayCollection();
    }

    public renew(){
        if(this.adList.length == 0)
        {
            MyTool.removeMC(this);
            return;
        }
        this.dataProvider.source = this.adList;
        this.dataProvider.refresh();
    }


}