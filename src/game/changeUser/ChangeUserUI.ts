class ChangeUserUI extends game.BaseContainer {



    private list: eui.List;
    private dataProvider:eui.ArrayCollection

    public constructor() {
        super();
        this.skinName = "ChangeUserUISkin";
    }

    public adList = []
    private lastGetADTime = 0;
    public getAD(num=10,fun?){
        var wx = window['wx'];
        //console.log(333333)
        if(!wx) {
            var oo = {
                "appid": "wxec9471079f8b6c27",
                "desc": '免费抽⼤大奖，免费领奖品，再奖⼀一个亿',
                "img": "https://wllm.oss-cn-beijing.aliyuncs.com/trackposter/wxec9471079f8b6c27/75428.jpg",
                "logo": "",
                "name": "测试号1"
            }
            this.adList = [oo,oo,oo,oo,oo,oo,oo,oo,oo,oo]
            this.renew();
            //MyTool.removeMC(this);
            return;
        }
        if(TM.now() - this.lastGetADTime < 5*60)
            return;
        this.adList.length = 0;
        var self = this
        wx.wladGetAds(num,function (res) { //第⼀一个参数为获取⼴广告条数，第⼆二个参数为获取成功后回调⽅方法;
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