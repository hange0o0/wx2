class UserManager {
    public constructor() {

    }

    private static _instance: UserManager;

    public static getInstance():UserManager{
        if(!UserManager._instance)
            UserManager._instance = new UserManager();
        return UserManager._instance;
    }



    public gameid: string;
    public nick: string;
    public head: string;
    public dbid: string;
    public writeKey: string;
    public gender: number;
    public coin: number = 999;
    public lastGuess: any = {};
    public isScope: boolean = false;


    public fill(data:any):void{
        this.dbid = data._id;
        this.coin = data.coin || 999;
        this.lastGuess = data.lastGuess;
        this.writeKey = data.writeKey;
    }

    public renewInfo(userInfo){
        this.isScope = true;
        this.nick = userInfo.nickName
        this.head = userInfo.avatarUrl
        this.gender = userInfo.gender || 1 //性别 0：未知、1：男、2：女
    }

    public addCoin(v){
        if(!v)
            return;
        this.coin += v;
        if(this.coin < 0)
            this.coin = 0;
        EM.dispatch(GameEvent.client.COIN_CHANGE)
    }


    public getUserInfo(fun){
        var wx = window['wx'];
        if(!wx)
        {
            this.fill(this.orginUserData());
            fun && fun();
            return;
        }

        wx.cloud.callFunction({      //取玩家openID,
            name: 'getInfo',
            complete: (res) => {
                console.log(res)
                this.gameid = res.result.openid
                this.loginUser(fun)
            }
        })
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
             coin:200,   //$
             writeKey:(Math.random()+'').substr(-8),
             lastGuess:{
                 isDeal:2,   //0:未处理，1：处理中，2：处理完
                 key:0,
                 cost1:0,
                 cost2:0,
                 teamCost1:0,
                 teamCost2:0,
             }
         };
    }



    //public testDiamond(v){
    //    if(UM.diamond < v)
    //    {
    //        MyWindow.Confirm('钻石不足！\n需要：' +v+'\n当前：'+UM.diamond + '\n是否前往购买钻石？',function(v){
    //            if(v == 1)
    //            {
    //                //ShopUI.getInstance().show(true);
    //            }
    //        },['取消','购买'])
    //        return false;
    //    }
    //    return true;
    //}
    //public testCoin(v){
    //    var coin = UM.coin;
    //    if(coin < v)
    //    {
    //        MyWindow.Confirm('金币不足！\n需要：' +v+'\n当前：'+coin + '\n是否前往购买金币？',function(v){
    //            if(v == 1)
    //            {
    //                //ShopUI.getInstance().show('coin');
    //            }
    //        },['取消','购买'])
    //        return false;
    //    }
    //    return true;
    //}
}
