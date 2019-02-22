//玩家数据
class PKPlayerData {
    public id;//唯一ID
    public gameid;
    public nick;
    public head;
    public hp; //城堡的血量
    public type//类型
    public force;//怪的基础属性
    public teamData:PKTeamData   //对应队伍

    public autoList
    public maxPlayer



    constructor(obj?){
        if(obj)
            this.fill(obj);

        if(this.nick)
            this.nick = Base64.decode(this.nick);
        else
            this.nick = '守卫者' + this.id;
    }

    public fill(obj)
    {
        obj = ObjectUtil.clone(obj);
        //console.log(JSON.stringify(obj));
        for (var key in obj) {
            this[key] = obj[key];
        }

        this.autoList = obj['autolist'].split(',');
        this.maxPlayer = this.autoList.length;
        MonsterVO.getObject(this.autoList[0]).preLoad();
        //console.log(this.autoList)
    }

    public getMonsterForce(mid?){
        return this.force
    }

    public addMonster(){
        //var PD = PKData.getInstance();
        if(this.autoList.length == 0)
            return;

        var mid = this.autoList.shift();
        if(this.autoList[0])
        {
            MonsterVO.getObject(this.autoList[0]).preLoad();
        }
        //var owner = this.id
        var atkRota = this.teamData.atkRota;
        var x = atkRota == PKConfig.ROTA_LEFT ? PKConfig.appearPos:PKConfig.floorWidth + PKConfig.appearPos;
        PKData.getInstance().addMonster({
            force:this.force,
            mid:mid,
            owner:this.id,
            atkRota:atkRota,
            fromPos:true,
            index:this.maxPlayer - this.autoList.length,
            x:x,
            y:-25 + PKData.getInstance().random2()*50,
            actionTime:PKData.getInstance().actionTime
        })
    }

}