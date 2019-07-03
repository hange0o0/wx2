class CollectManager {
    private static _instance:CollectManager;
    public static getInstance():CollectManager {
        if (!this._instance)
            this._instance = new CollectManager();
        return this._instance;
    }

    public constructor() {
    }


    public maxNum

    public level
    public lastTime
    public list

    public initData(data){
        data = data || {};
        this.level = data.level || 0
        this.lastTime = data.lastTime || 0
        this.list = data.list?data.list.split(','):[]
        var lockList = data.lock?data.lock.split(','):[]

        var lockObj = {};
        for(var i=0;i<lockList.length;i++)
        {
             var id = lockList[i];
            lockObj[id] = (lockObj[id] || 0) + 1
        }

        for(var i=0;i<this.list.length;i++)
        {
            var id = this.list[i];
            var isLock = false;
            if(lockObj[id])
            {
                isLock = true;
                lockObj[id] --;
            }
            this.list[i] = {
                id:id,
                lv:MonsterVO.getObject(id).level,
                isLock:isLock
            }
        }

        this.resetLevel();
    }

    public removeItem(data){
        var index = this.list.indexOf(data);
        this.list.splice(index,1);
    }

    public resetLevel(){
        this.maxNum = 30 + this.level*5;
    }

    //升级需要的花费(木头,草)
    public getUpCost(){
        var wood = Math.floor(Math.pow(this.level + 1,2.5))*50
        var grass = 0;
        if(this.level > 5)
            grass = Math.floor(Math.pow(this.level - 5,2.5))*30
        return {
            wood:wood,
            grass:grass,
        }
    }

    public levelUp(){
         var oo = this.getUpCost();
        UM.addWood(-oo.wood)
        UM.addGrass(-oo.grass)
        this.level ++;
        this.resetLevel();
    }

    public split(data){
        UM.addBlood(this.getSplitAward(data.id))
        this.removeItem(data);
    }

    public getSplitAward(id){
        return Math.floor(HeroManager.getInstance().getExpByLevel(MonsterVO.getObject(id).level)/10)
    }

    //打开界面才进入onTimer
    public onTimer(){
        var b = false
        var t = TM.now();
        var maxCD = 3600*(2+this.maxNum/300*4)
        var cd = Math.floor(maxCD/this.maxNum/3)
        var startLevel = (1+this.level)*2 - 20
        var monsterList = [];
        for(var s in MonsterVO.data)
        {
             if(MonsterVO.data[s].level>= startLevel && MonsterVO.data[s].level <= startLevel + 20)
             {
                 monsterList.push(s);
             }
        }

        while(this.lastTime < t && this.list.length < this.maxNum)
        {
            this.lastTime += cd + Math.floor(Math.random()*2*cd)
            var id = ArrayUtil.randomOne(monsterList);
            this.list.push({
                id:id,
                lv:MonsterVO.getObject(id).level,
                isLock:false
            })
            b = true;
        }

        if(this.lastTime < t)
        {
            this.lastTime = t + Math.floor(Math.random()*2*cd)
        }

        if(b)
        {
            UM.needUpUser = true;
            EM.dispatch(GameEvent.client.COLLECT_CHANGE)
        }
        return b;
    }

    public getSave(){
        var lock = []
        var list = []
        for(var i=0;i<this.list.length;i++)
        {
            var oo = this.list[i];
            list.push(oo.id);
            if(oo.isLock)
                lock.push(oo.id);
        }
        return {
            list:list.join(','),
            lock:lock.join(','),
            level:this.level,
            lastTime:this.lastTime,
        }
    }
}