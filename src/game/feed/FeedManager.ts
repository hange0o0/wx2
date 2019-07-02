class FeedManager {
    private static _instance:FeedManager;
    public static getInstance():FeedManager {
        if (!this._instance)
            this._instance = new FeedManager();
        return this._instance;
    }

    public constructor() {
    }


    public goldHelper
    public data //金：1-4，其它4-16

    public openNum
    public goldNum

    public initData(data){
        data = data || {};
        this.goldHelper = data.goldHelper || []
        this.data = data.data || {};

        for(var i=1;i<=4;i++)
        {
            if(this.data[i])
                this.goldNum = i;
        }
        for(var i=5;i<=16;i++)
        {
            if(this.data[i])
                this.openNum = i-4;
        }
    }

    //解锁花费
    public getOpenCost(index){
        if(index <= 7)
            return 0;
        return  Math.floor(Math.pow(index-1,3.65))*100
    }

    //升级花费
    public getLevelUpCost(index){
        var level = this.data[index].level
        var wood = Math.floor(Math.pow(level,2.24))*40
        var diamond = 0;
        if(level > 5)
            diamond = Math.floor(Math.pow(level - 5,2.5))*20
        return {
            wood:wood,
            diamond:diamond,
        }
    }

    public levelUp(index){
        var oo = this.getLevelUpCost(index);
        UM.addWood(-oo.wood)
        UM.addDiamond(-oo.diamond)
        this.data[index].level.level ++;
    }

    public unlock(index){
        var cost = this.getOpenCost(index);
        UM.addWood(-cost);
        this.data[index] = {level:1}
    }

    public getIndexLevel(index){
        if(!this.data[index])
            return 0;
        return this.data[index].level;
    }

    //需要放入的数量
    public getNumByIndex(index){
        return 5 + this.getIndexLevel(index)-1
    }

    //需要的总时间
    public getTimeByIndex(index){
        var num = this.getNumByIndex(index)
        return num*720
    }


    //{id,exp,isHero,data}
    public startFeed(index,list){
        var exp = 0;
        var maxExp = 0;
        for(var i=0;i<list.length;i++)
        {
            list[i].rate = Math.random()*Math.pow(list[i].exp,0.3);
            exp += list[i].exp;
            maxExp = Math.max(list[i].exp,maxExp);

            if(list[i].isHero)
            {
                HeroManager.getInstance().removeItem(list[i].data)
            }
            else
            {
                CollectManager.getInstance().removeItem(list[i].data)
            }
        }


        var win;
        for(var i=0;i<list.length;i++)
        {
            var oo = list[i];
            if(!win || win.rate < oo.rate)
            {
                win = oo;
            }
        }

        var rate = 2.32//刚好够1升2
        if(index <= 4)//加成
        {
            rate = 2.1
        }
        exp = maxExp + Math.floor((exp-maxExp)/rate);


        var skill = win.skill || Math.ceil(Math.random()*10);
        if(win.data.key)
        {
            var key = Number(win.data.key);
        }
        else
        {
            var key = HeroManager.getInstance().key;
            HeroManager.getInstance().key ++;
        }

        this.data[index].endTime = TM.now() + this.getTimeByIndex(index);
        this.data[index].win = {
            id:win.id,
            exp:exp,
            key:key,
            skill:skill,
        }

    }

    public getSave(){
        return {
            data:this.data
        }

    }
}