class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }

    private _needUpUser = false;
    private callLocalSave = false;//防止重复多次
    public get needUpUser(){return this._needUpUser}
    public set needUpUser(v){
        this._needUpUser = v
        if(v && !this.callLocalSave)
        {
            this.callLocalSave = true;
            egret.callLater(this.localSave,this)
        }

    }


    public testVersion = 20190610//与服务器相同则为测试版本
    public isTest;
    public shareFail;

    public loginTime
    public helpUser

    public gameid: string;
    public nick: string;
    public head: string;
    public dbid: string;


    public coin: number = 999;
    public wood: number = 0;
    public food: number = 0;
    public blood: number = 0;
    public diamond: number = 0;
    public grass: number = 0;

    public chapterLevel: number = 0;

    public guideFinish: boolean = false;
    public initDataTime;



    public fill(data:any):void{

        var localData = SharedObjectManager.getInstance().getMyValue('localSave')
        if(localData && localData.saveTime - data.saveTime > 10) //本地的数据更新
        {
            for(var s in localData)
            {
                data[s] = localData[s];
            }
        }


        this.dbid = data._id;
        this.coin = data.coin || 0;
        this.wood = data.wood || 0;
        this.food = data.food || 0;
        this.blood = data.blood || 0;
        this.diamond = data.diamond || 0;
        this.grass = data.grass || 0;
        this.chapterLevel = data.chapterLevel || 1;
        this.guideFinish = data.guideFinish;

        CollectManager.getInstance().initData(data.collect);
        WorkManager.getInstance().initData(data.work);
        FeedManager.getInstance().initData(data.feed);
        HeroManager.getInstance().initData(data.hero);

        this.initDataTime = TM.now();

        this.testPassDay();
    }

    public renewInfo(userInfo){
        if(!userInfo)
            return;
        this.nick = userInfo.nickName
        this.head = userInfo.avatarUrl
    }

   

    public addCoin(v){
        if(!v)
            return;
        this.coin += v;
        if(this.coin < 0)
            this.coin = 0;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }

    public addFood(v){
        if(!v)
            return;
        this.food += v;
        if(this.food < 0)
            this.food = 0;
        if(this.food > WorkManager.getInstance().foodMax)
            this.food = WorkManager.getInstance().foodMax;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }

    public addWood(v){
        if(!v)
            return;
        this.wood += v;
        if(this.wood < 0)
            this.wood = 0;
        if(this.wood > WorkManager.getInstance().woodMax)
            this.wood = WorkManager.getInstance().woodMax;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }

    public addDiamond(v){
        if(!v)
            return;
        this.diamond += v;
        if(this.diamond < 0)
            this.diamond = 0;
        if(this.diamond > WorkManager.getInstance().diamondMax)
            this.diamond = WorkManager.getInstance().diamondMax;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }

    public addGrass(v){
        if(!v)
            return;
        this.grass += v;
        if(this.grass < 0)
            this.grass = 0;
        if(this.grass > WorkManager.getInstance().grassMax)
            this.grass = WorkManager.getInstance().grassMax;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }

    public addBlood(v){
        if(!v)
            return;
        this.blood += v;
        if(this.blood < 0)
            this.blood = 0;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }




    public getUserInfo(fun){
        var wx = window['wx'];
        if(!wx)
        {
            this.gameid = _get['openid']
            this.fill(this.orginUserData());
            this.guideFinish = !!SharedObjectManager.getInstance().getMyValue('localSave');   //本地不进新手了
            fun && fun();
            return;
        }
        //wx.login({
        //    success:()=>{
                wx.cloud.callFunction({      //取玩家openID,
                    name: 'getInfo',
                    complete: (res) => {
                        if(!res.result)
                        {
                            MyWindow.Alert('请求用户数据失败，请重新启动',()=>{
                                wx.exitMiniProgram({});
                            })
                            return;
                        }
                        console.log(res)
                        this.gameid = res.result.openid
                        this.shareFail = res.result.shareFail
                        if(res.result.testVersion)
                            this.isTest = res.result.testVersion == this.testVersion;
                        else
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
                //this.testAddInvite();
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
                this.helpUser = data.helpUser;
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
             wood:0,   //$
             food:0,   //$
             blood:0,   //$
             diamond:0,   //$
             grass:0,   //$

             guideFinish:false,
             chapterLevel:1,
             saveTime:0,
             helpUser:{}//拉新
         };
    }

    //跨天处理
    public testPassDay(){
        if(DateUtil.isSameDay(this.loginTime))
            return false;
        this.needUpUser = true;
        return true;
    }




    private localSave(){
        this.callLocalSave = false
        SharedObjectManager.getInstance().setMyValue('localSave',this.getUpdataData())
    }

    private getUpdataData(){
        return {
            loginTime:UM.loginTime,
            coin:UM.coin,
            wood:UM.wood,   //$
            food:UM.food,   //$
            blood:UM.blood,   //$
            diamond:UM.diamond,   //$
            grass:UM.grass,   //$

            collect:CollectManager.getInstance().getSave(),
            work:WorkManager.getInstance().getSave(),
            feed:FeedManager.getInstance().getSave(),
            hero:HeroManager.getInstance().getSave(),
            saveTime:TM.now(),
        };
    }

    public upDateUserData(){
        if(!this.needUpUser)
            return;
        var wx = window['wx'];
        if(wx)
        {
            var updateData:any = this.getUpdataData();
            WXDB.updata('user',updateData)
        }
        this.needUpUser = false;
        this.localSave();
    }

}
