class HeroManager {
    private static _instance:HeroManager;
    public static getInstance():HeroManager {
        if (!this._instance)
            this._instance = new HeroManager();
        return this._instance;
    }

    public level
    public list;
    public defList;
    public key = 1;

    public heroNum
    public pkNum

    private adType
    private adValue

    public skillBase = {
        1:{name:'攻击强化',des:'提高蛊虫的基础攻击力',hp:1,atk:2},
        2:{name:'3弹齐发',des:'在单次战斗中，蛊虫攻击后的攻击力都会得到提升',hp:1,atk:0.9},
        3:{name:'回手',des:'提高蛊虫的基础血量值',hp:2,atk:1},
        4:{name:'攻击成长',des:'每次攻击后攻击力都得到提升',hp:0.8,atk:1},
        5:{name:'衰弱',des:'降低攻击目标2%防御力',hp:1.2,atk:0.5},
        6:{name:'触底反弹',des:'首次触底后会发生反弹',hp:1,atk:0.8},
        7:{name:'穿透',des:'攻击后降低被攻击方一定的攻击力',hp:1,atk:1},
        8:{name:'爆炸',des:'击中敌人后发生爆炸，对XX范围内的敌人造成伤害',hp:1,atk:1},
        //
        //9:{name:'复活',des:'死亡后有50%的机率满血复活',hp:0.8,atk:1},
        //10:{name:'自爆',des:'阵亡后对所有敌人造成一定伤害',hp:1,atk:1}
    }

    public constructor() {
        this.resetAD();
    }

    public initData(data){
        data = data || {}
        this.list = data.list?data.list.split(','):[];
        this.key = data.key || 1;
        this.level = data.level || 1;
        this.defList = data.def ?data.def.split(','):[];

        var dieList = data.die || []

        var keyObj = {}
        for(var i=0;i<this.list.length;i++)
        {
            var temp = this.list[i].split('|')


            //if(keyObj[temp[3]])//查错
            //{
            //    throw new Error('1111')
            //}
            //keyObj[temp[3]] = true


            this.list[i] = {
                id:parseInt(temp[0]),
                exp:parseInt(temp[1]),
                skill:parseInt(temp[2]),
                key:temp[3],
                isDie:dieList.indexOf(temp[3]) != -1,
            }
        }
        this.resetLevel();
    }

    public editDef(){
        HeroDefUI.getInstance().show({
            pkType:'def',
            title:'防守阵容',
            upList:this.defList.join(','),
            fun:(data)=>{
                this.defList = data?data.split(','):[]
                HeroDefUI.getInstance().hide();
                UM.needUpUser = true;
                EM.dispatch(GameEvent.client.HERO_CHANGE);
            }
        })
    }

    public getMonster(key){
         for(var i=0;i<this.list.length;i++)
         {
              if(this.list[i].key == key)
              {
                  return this.list[i];
              }
         }
        return null;
    }

    public getPKMonster(key){
        var monster = this.getMonster(key);
        var level = this.getLevelByExp(monster.exp)
        var skillBase = this.skillBase[monster.skill];
        var rate = Math.pow(level,1.5)
        var oo = {
            skill:monster.skill,
            key:key,
            id:monster.id,
            hp:Math.round(100*rate*skillBase.hp),
            atk:Math.round(20*rate*skillBase.atk),
        }
        return new PKMonsterData(oo);
    }

    public resetLevel(){
        this.heroNum = 14 + this.level;
        this.pkNum =  Math.floor(this.heroNum/3)
    }

    public isDef(key){
          return this.defList.indexOf(key+'') != -1;
    }

    public isAtk(key){
        return false
    }

    public getSkillBG(skill){
        skill = skill || 0;
        return 'border'+skill+'_png'
    }

    public getDieArr(){
        var arr = []
        for(var i=0;i<this.list.length;i++)
        {
            if(this.list[i].isDie)
            {
                arr.push(this.list[i])
            }
        }
        return arr;
    }



    public rebornAll(){
        var level = Math.min(this.getDieArr().length,12);
        if(level == 0)
        {
            MyWindow.ShowTips('没有需要复活的蛊虫')
            return;
        }
        this.adValue = 30 + level*5;
        if(this.adType == 'score')
            this.adValue *= 30;

        var str = this.adType == 'cd'?"在《别碰小广告》游戏中坚持"+this.adValue+"秒，即可复活所有蛊虫":"在《别碰小广告》游戏中获得"+this.adValue+"分，即可获得20%即可复活所有蛊虫"
        MyWindow.Alert(str,()=>{
            MyADManager.getInstance().openWX5({
                key:this.adType,
                value:this.adValue,
                callBack:'addForce',
            })
        },'开始挑战')
    }

    public resetAD(){
        this.adType = Math.random()>0.5?'cd':'score'
    }

    public rebornAllFun(){
        for(var i=0;i<this.list.length;i++)
        {
            this.list[i].isDie = false;
        }
        this.resetAD();
        UM.needUpUser = true;
        EM.dispatch(GameEvent.client.HERO_CHANGE);
    }

    public split(data){
        if(this.isDef(data.key))
        {
            MyWindow.ShowTips('不能炼化防守中的蛊虫')
            return false;
        }
        if(this.isAtk(data.key))
        {
            MyWindow.ShowTips('不能炼化进攻中的蛊虫')
            return false;
        }
        UM.addBlood(this.getSplitAward(data))
        this.removeItem(data);
        UM.needUpUser = true;
        EM.dispatch(GameEvent.client.HERO_NUM_CHANGE);
        return true;
    }

    public getSplitAward(data){
        return Math.floor(data.exp/10)
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
        UM.needUpUser = true;
        EM.dispatch(GameEvent.client.HERO_CHANGE);
    }

    //复活的花费
    public getRebornCost(lv){
        var exp = this.getExpByLevel(lv);
        return Math.floor((Math.pow(lv,2)*10+Math.floor(exp/500))/2)
    }

    public rebornOne(data){
        var level = this.getLevelByExp(data.exp)
        UM.addBlood(-this.getRebornCost(level));
        data.isDif = false;
        UM.needUpUser = true;
        EM.dispatch(GameEvent.client.HERO_CHANGE);
    }


    //移除
    public removeItem(data){
        var index = this.list.indexOf(data);
        this.list.splice(index,1);
    }

    public getExpByLevel(lv){
        if(lv <= 0)
            return 0;
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

    public feed(data,value){
        UM.addBlood(-value);
        data.exp += value;
        UM.needUpUser = true;
        EM.dispatch(GameEvent.client.HERO_CHANGE);
    }

    public getSave(){
        var list = [];
        var dieList = [];
        for(var i=0;i<this.list.length;i++)
        {
            var oo = this.list[i];
            if(oo.isDie)
                dieList.push(oo.key);
            list.push(oo.id + '|' +oo.exp + '|' +oo.skill + '|' +oo.key)
        }
        return {
            list:list.join(','),
            key:this.key ,
            die:dieList.join(',') ,
            def:this.defList.join(','),
        }

    }
}