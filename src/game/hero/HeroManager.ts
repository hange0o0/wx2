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

    public skillBase = {
        1:{name:'攻击强化',des:'提高蛊虫的基础攻击力'},
        2:{name:'攻击成长',des:'在单次战斗中，蛊虫攻击后的攻击力都会得到提升'},
        3:{name:'生命强化',des:'提高蛊虫的基础血量值'},
        4:{name:'吸食生命',des:'攻击后会回复自身一定的生命值'},
        5:{name:'治疗',des:'攻击后会回复所有友方蛊虫一定的生命值'},
        6:{name:'领军光环',des:'提升所有友方蛊虫一定的攻击力'},
        7:{name:'强力毒素',des:'攻击后降低被攻击方一定的攻击力'},
        8:{name:'尖刺外壳',des:'使攻击其的敌人受到一定的伤害'},
        9:{name:'复活',des:'攻击后随机复活一名友方单位'},
        10:{name:'自爆',des:'阵亡后对所有敌人造成一定伤害'}
    }

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

    //复活的花费
    public getRebornCost(lv){
        var exp = this.getExpByLevel(lv);
        return Math.floor((Math.pow(lv,2)*10+Math.floor(exp/500))/2)
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