class HeroManager {
    private static _instance:HeroManager;
    private static cd = 0
    public static getInstance():HeroManager {
        if (!this._instance)
            this._instance = new HeroManager();
        return this._instance;
    }

    public list;
    public key = 1;

    public constructor() {
    }

    public initData(data){
        data = data || {}
        this.list = data.list?data.list.split(','):[];
        this.key = data.key || 1;

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
    }

    //移除
    public removeItem(data){
        var index = this.list.indexOf(data);
        this.list.splice(index,1);
    }

    public getExpByLevel(lv){
        return Math.round(Math.pow(lv,2.35))*100
    }


    public getLevelByExp(exp){
        var level =  Math.max(1,Math.ceil(Math.pow(exp/100,1/2.35)-2))
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