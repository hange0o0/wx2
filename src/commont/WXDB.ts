class WXDB{
    public static updata(dbName,data,fun?){
        DEBUG && console.log('update-'+dbName,data)
        var wx = window['wx'];
        if(!wx)
        {
            fun && fun();
            return;
        }
        const db = wx.cloud.database();
        data.writeKey = (Math.random()+'').substr(-8);
        db.collection(dbName).doc(UM.dbid).where({
            writeKey: UM.writeKey
        }).update({
            data: data,
            success: (res)=>{
                DEBUG && console.log(res)
                if(res.stats.updated == 0) //更新失败
                {
                    MyWindow.Alert('该用户已在其它地方登录',()=>{
                        UM.loginUser();
                        EM.dispatch(GameEvent.client.COIN_CHANGE);
                    },'重新登陆');
                    GameManager.getInstance().stopTimer();
                    return;
                }
                UM.writeKey = data.writeKey

                fun && fun();
            },
        })
    }
}