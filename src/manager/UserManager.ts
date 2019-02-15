class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }

    public onLineAwardCD = [5*60,30*60,3600,2*3600,3*3600]


    public isTest;
    public gameid: string;
    public nick: string;
    public head: string;
    public dbid: string;
    //public writeKey: string;
    public gender: number;
    public coin: number = 999;
    public coinwin: number = 0;
    public total: number = 0;
    public win: number = 0;
    public tipsLevel: number = 0;
    public chapterLevel: number = 0;
    public history = [];
    public lastGuess: any = {};
    public friendNew: any = {};
    public coinObj:{
        loginTime,
        loginDays,
        loginDayAward,
        onLineAwardTime,
        onLineAwardNum,
        shareNum,
        newAward,
        shareAward
    }
    public guideFinish: boolean = false;


    public initDataTime;

    public isScope


    public fill(data:any):void{
        this.dbid = data._id;
        this.coin = data.coin || 0;
        this.coinwin = data.coinwin || 0;
        this.total = data.total || 0;
        this.win = data.win || 0;
        this.tipsLevel = data.tipsLevel || 0;
        this.chapterLevel = data.chapterLevel || 1;
        this.lastGuess = data.lastGuess;
        this.guideFinish = data.guideFinish;
        this.coinObj = data.coinObj || {
                loginTime:TM.now(),   //登陆时间
                loginDays:1,   //登陆天数
                loginDayAward:0,   //领取登陆礼包
                onLineAwardTime:TM.now(),   //在线礼包领取时间
                onLineAwardNum:0,   //在线礼包领取数量
                shareNum:0,   //分享金币次数
                shareAward:0,   //分享金币次数
                newAward:0,   //分享金币次数
            };
        this.friendNew = data.friendNew;
        //this.writeKey = data.writeKey;

        this.initDataTime = TM.now();

        this.history = SharedObjectManager.getInstance().getMyValue('history') || [];
        if(this.history.length > 20)
            this.history.length = 20;

        this.testPassDay();
    }

    public renewInfo(userInfo){
        this.isScope = true;
        this.nick = userInfo.nickName
        this.head = userInfo.avatarUrl
        this.gender = userInfo.gender || 1 //性别 0：未知、1：男、2：女
    }

    public saveHistory(){
        SharedObjectManager.getInstance().setMyValue('history',this.history)
        EM.dispatch(GameEvent.client.HISTORY_CHANGE)
    }

    public addCoin(v){
        if(!v)
            return;
        this.coin += v;
        if(this.coin < 0)
            this.coin = 0;
        PKManager.getInstance().needUpUser = true
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }


    public getUserInfo(fun){
        var wx = window['wx'];
        if(!wx)
        {
            this.fill(this.orginUserData());
            this.guideFinish = true;   //本地不进新手了
            fun && fun();
            return;
        }
        //wx.login({
        //    success:()=>{
                wx.cloud.callFunction({      //取玩家openID,
                    name: 'getInfo',
                    complete: (res) => {
                        console.log(res)
                        this.gameid = res.result.openid
                        this.isTest = res.result.isTest;
                        //console.log(11)
                        TimeManager.getInstance().initlogin(res.result.time)
                        //console.log(res.result.time)
                        this.loginUser(fun)
                    },
                    fail:()=>{
                       MyWindow.Alert('请求用户数据超时，请重新启动',()=>{
                           wx.exitMiniProgram({});
                       })
                    }
                })
        //    }
        //})
    }

    public loginUser(fun?){
        var wx = window['wx'];
        const db = wx.cloud.database();
        db.collection('user').where({     //取玩家数据
            _openid: this.gameid,
        }).get({
            success: (res)=>{
                if(res.data.length == 0)//新用户
                {
                    this.onNewUser(fun)
                    return;
                }
                this.fill(res.data[0]);
                fun && fun();
            }
        })
    }

    public renewFriendNew(fun)
    {
        if(TM.now() - this.initDataTime < 10*60)
        {
            fun && fun();
            return;
        }
        this.initDataTime = TM.now();
        var wx = window['wx'];
        if(!wx)
        {
            fun && fun();
            return;
        }
        const db = wx.cloud.database();
        db.collection('user').where({     //取玩家数据
            _openid: this.gameid,
        }).get({
            success: (res)=>{
                var data = res.data[0];
                this.friendNew = data.friendNew;
                fun && fun();
            }
        })
    }

    private testAddInvite(){
        var wx = window['wx'];
        var query = wx.getLaunchOptionsSync().query;
        if(query.type == '1')
        {
            wx.cloud.callFunction({      //取玩家openID,
                name: 'onShareIn',
                data:{
                    other:query.from,
                    skinid:query.skinid,
                },
                complete: (res) => {
                     //console.log(res)
                }
            })
        }
    }

    //新用户注册
    private onNewUser(fun?){
        var wx = window['wx'];
        const db = wx.cloud.database();
        var initData:any = this.orginUserData();
        db.collection('user').add({
            data:initData,
            success: (res)=>{
                initData._id = res._id;
                this.fill(initData);
                fun && fun();
            }
        })

        this.testAddInvite();
    }

    private orginUserData(){
         return {
             coin:300,   //$
             coinwin:0,   //$
             win:0,   //$
             total:0,   //$
             guideFinish:false,
             chapterLevel:1,
             tipsLevel:0,
             lastGuess:this.getGuessInitData(0),
             coinObj:{
                 loginTime:TM.now(),   //登陆时间
                 loginDays:1,   //登陆天数
                 loginDayAward:0,   //领取登陆礼包
                 onLineAwardTime:TM.now(),   //在线礼包领取时间
                 onLineAwardNum:0,   //在线礼包领取数量
                 shareNum:0,   //分享金币次数
                 shareAward:0,   //分享金币次数
                 newAward:0,   //拉新领奖次数
             },
             friendNew:{}//拉新
         };
    }

    //跨天处理
    public testPassDay(){
        if(!this.coinObj)
            return false;
        if(DateUtil.isSameDay(this.coinObj.loginTime))
            return false;
        this.coinObj.loginTime = TM.now();
        this.coinObj.loginDays ++;
        this.coinObj.loginDayAward = 0;
        this.coinObj.onLineAwardTime = this.coinObj.loginTime;
        this.coinObj.onLineAwardNum = 0;
        this.coinObj.shareNum = 0;
        this.coinObj.shareAward = 0;
        PKManager.getInstance().needUpUser = true;
        return true;
    }


    public getGuessInitData(key){
        return {
            isDeal:0,   //0:未处理，1：处理中，2：处理完
            key:key,
            cost1:0,
            cost2:0,
            teamCost1:0,
            teamCost2:0,
        }
    }

    private isRuning = false;
    public drawSaveData():egret.Bitmap
    {
        if(!window['wx'])
            return;
        if(this.isRuning) return null;
        this.isRuning = true;

        platform.openDataContext.postMessage({isDisplay:true, command:"drawSaveData", keys:["getInfo"], myopenid:this.gameid});

        let bb = <egret.Bitmap>platform.openDataContext.createDisplayObject();
        let bmp = new egret.Bitmap(bb.texture);
        let tex = new egret.RenderTexture();
        egret.Tween.get(this,{loop:true}).wait(100).call(this.test,this,[bmp,tex]);
        return bmp;
    }

    private test(bmp:egret.Bitmap,tex:egret.RenderTexture)
    {
        tex.drawToTexture(bmp,new egret.Rectangle(0,0,3,3));
        let a = "";
        for(var k = 0;k<3;k++)
        {
            let arr = tex.getPixel32(k,2);
            for(let j = 0;j<3;j++) a += Number(arr[j] > 127);
        }
        let str = String.fromCharCode(parseInt(a,2));
        if(str == "{")
        {
            tex.drawToTexture(bmp,new egret.Rectangle(0,0,bmp.width,bmp.height));
            let i = 0;
            let codeStr = "";
            let _s = "";
            while(true)
            {
                let a = "";
                for(var k = 0;k<3;k++)
                {
                    let i1 = i*3+k;
                    let x = (i1%bmp.width);
                    let y = Math.floor(i1/bmp.width);
                    let arr = tex.getPixel32(x,tex.textureHeight-y-1);
                    for(let j = 0;j<3;j++) a += Number(arr[j] > 127);
                }
                let s = String.fromCharCode(parseInt(a,2));
                if(s == ":" && _s == "}") break;
                codeStr += s;
                _s = s;
                i++;
            }
            tex.dispose();
            egret.Tween.removeTweens(this);
            platform.openDataContext.postMessage({type:"clear"});
            this.isRuning = false;

            let obj = JSON.parse(codeStr); //{isOK:true, data:[]}
            if(obj.isOK)
            {
                this.nick = decodeURIComponent(obj.data.nick);
                this.head = obj.data.head;
                console.log(this.nick,this.head)
            }
        }
    }

}
