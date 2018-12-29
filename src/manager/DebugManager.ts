class DebugManager {
    private static _instance:DebugManager;
    private static cd = 0
    public static getInstance():DebugManager {
        if (!this._instance)
            this._instance = new DebugManager();
        return this._instance;
    }

    public stop = 0;
    public winCardArr = [];
    public finishFun = function(){return false}


    public constructor() {
    }

    //public testHangView = false //在挂机中测试所有单位动画
    //public MML = 998;  //测试出战怪的等级
    //public addSkill = false
    //public addHeroLevel = 0
    //public maxHeroLevel = 20 //已开放的最大英雄等级
    //public cardLen = 20
    //public needTestTwo = false
    //public createHangFlag = false;


    public printDetail = false;  //打印胜出怪物
    public winMonster = {}
    public winUseCard = []

    public outPut = []

    public randomList(cost){
        var arr = []
        for(var s in MonsterVO.data)
        {
            var mvo = MonsterVO.data[s]
            arr.push(mvo)
        }

        var num = 0;
        var newList = [];
        while(num < 100 && cost > 0)
        {
            var vo = ArrayUtil.randomOne(arr)
            if(vo.cost <= cost)
            {
                cost -= vo.cost;
                newList.push(vo.id)
            }
            num ++;
        }

        ArrayUtil.random(newList);
        return newList.join(',')
    }


    private testNum = 0;
    public test(){
        this.testNum = 0;
        this.stop = 0;
        this.winMonster = {};
        this.winUseCard = [];
        this.outPut = [];
        setTimeout(()=>{
            this.testRound();
        },1);

    }

    private printResult(type){
        var arr = [];
        for(var s in MonsterVO.data)
        {
            arr.push({id:s,num:this.winMonster[s] || 0})
        }

        ArrayUtil.sortByField(arr,['num'],[1]);
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i].id;
            console.log((i + 1) + '\tid:' +id +  '\t\tnum:' +  arr[i].num + '\t\tcost:' +  CM.getCardVO(id).cost + '\t\tname:' +  CM.getCardVO(id).name + '\t\tlevel:' +  CM.getCardVO(id).level + '\t\ttype:' +  CM.getCardVO(id).type)
        }

    }

    //N选1;
    private testRound(){
        this.testNum ++;
        var arr = []
        var n = 1024;

        var cost = 30 + Math.floor(Math.random()*31)
        for(var i=0;i<n;i++)
        {
            arr.push(this.randomList(cost))
        }
        this.testArr(arr,0,n,egret.getTimer())
    }

    private testArr(arr,num,total,t,type?){
        if(arr.length >2)
        {
            arr = arr.concat(this.testOne(arr.shift(),arr.shift()))
            num ++;
            if(num< total+2)
            {
                if(num %50 == 0)
                {
                    egret.callLater(()=>{
                        console.log('runing')
                        this.testArr(arr,num,total,t,type)
                    },this)
                }
                else
                    this.testArr(arr,num,total,t,type)
                return
            }
        }
        this.outPut.push({list1:arr[0],list2:arr[1]});
        arr = this.testOne(arr.shift(),arr.shift())
        for(var i=0;i<arr.length;i++)
        {
            var temp = arr[i].split(',');
            for(var j=0;j<temp.length;j++)
            {
                var id = temp[j];
                if(this.winMonster[id])
                    this.winMonster[id] ++;
                else
                    this.winMonster[id] = 1;
            }
            this.winCardArr.push(arr[i]);
        }

        console.log(this.testNum + ':' + (egret.getTimer()-t))

        if(this.finishFun())
            return;
        if(this.stop)
        {
            this.printResult(type);

            if(this.stop == 2)
            {
                for(var i=0;i<this.outPut.length;i++)
                {
                    this.outPut[i] = this.format(this.outPut[i])
                }
                egret.localStorage.setItem('mapData', this.outPut.join('\n'));
            }
            return;
        }

        egret.callLater(this.testRound,this)
    }

    private format(data){
        var rd = Math.floor(Math.random() * 100000000000);
        data.seed = rd;
        return JSON.stringify(data);
    }

    private testOne(list1,list2,hp=10){
        var PD = PKData.getInstance()
        var data = {
            seed:TM.now() + Math.floor(100000000*Math.random()),
            players:[
                {id:1,gameid:'test1',team:1,autolist:list1,force:10000,type:0,hp:1},
                {id:2,gameid:'test2',team:2,autolist:list2,force:10000,type:0,hp:1}
            ]
        };
        PKManager.getInstance().pkType = PKManager.TYPE_TEST
        PD.init(data);
        PD.quick = true;
        PD.start();
        PKCode.getInstance().onStep()

        if(PD.isWin())
        {
            //list1.useCard = PD.getPlayer(1).useCardList;
            //this.winUseCard = this.winUseCard.concat( list1.useCard)
            return [list1];
        }
        else if(PD.isDraw())
        {
            //list1.useCard = PD.getPlayer(1).useCardList;
            //list2.useCard = PD.getPlayer(2).useCardList;
            //this.winUseCard = this.winUseCard.concat( list1.useCard)
            //this.winUseCard = this.winUseCard.concat( list2.useCard)
            return [list1,list2];
        }
        else
        {
            //list2.useCard = PD.getPlayer(2).useCardList;
            //this.winUseCard = this.winUseCard.concat( list2.useCard)
            return [list2];
        }
    }
}

//DM.testCard('1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16')
//DM.testMV('mv2',10,[30,31])
//javascript:DM.showAllMV();
//Net.send('clean_server')
//DM.test();
//DM.createHang(0,5);
//DM.stop = 1;