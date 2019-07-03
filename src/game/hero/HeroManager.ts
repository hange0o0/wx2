class HeroManager {
    private static _instance:HeroManager;
    public static getInstance():HeroManager {
        if (!this._instance)
            this._instance = new HeroManager();
        return this._instance;
    }

    public level
    public list;
    public key = 1;

    public heroNum
    public pkNum

    public constructor() {
    }

    public initData(data){
        data = data || {}
        this.list = data.list?data.list.split(','):[];
        this.key = data.key || 1;
        this.level = data.level || 1;

        for(var i=0;i<this.list.length;i++)
        {
            var temp = this.list[i].split('|')
            this.list[i] = {
                id:parseInt(temp[0]),
                exp:parseInt(temp[1]),
                skill:parseInt(temp[2]),
                key:temp[3],
            }
        }
        this.resetLevel();
    }

    public resetLevel(){
        this.heroNum = 14 + this.level;
        this.pkNum =  Math.floor(this.heroNum/3)
    }

    //升级需要的花费(木头,草)
    public getUpCost(){
        var wood = Math.floor(Math.pow(this.level + 1,2.5))*50
        var diamond = 0;
        if(this.level > 5)
            diamond = Math.floor(Math.pow(this.level - 5,2.5))*30
        return {
            wood:wood,
            diamond:diamond,
        }
    }

    public levelUp(){
        var oo = this.getUpCost();
        UM.addWood(-oo.wood)
        UM.addDiamond(-oo.diamond)
        this.level ++;
        this.resetLevel();
    }


    //移除
    public removeItem(data){
        var index = this.list.indexOf(data);
        this.list.splice(index,1);
    }

    public getExpByLevel(lv){
        return Math.round(Math.exp(lv-1))*100
    }

    public getLevelByExp(exp){
        var level =  Math.max(1,Math.ceil(Math.log(exp/100)-2))
        while(true)
        {
            var newExp = this.getExpByLevel(level)
            if(newExp > exp)
            {
                return level - 1;
            }
            level++;
        }
    }

    public getSave(){
        var list = [];
        for(var i=0;i<this.list.length;i++)
        {
            var oo = this.list[i];
            list.push(oo.id + '|' +oo.exp + '|' +oo.skill + '|' +oo.key)
        }
        return {
            list:list.join(','),
            key:this.key
        }

    }
}