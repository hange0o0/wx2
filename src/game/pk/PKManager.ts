class PKManager {
    //录像里也要调
    public static TYPE_HANG = 1;
    public static TYPE_SLAVE = 2;
    public static TYPE_PVP_OFFLINE = 3;
    public static TYPE_PVP_ONLINE = 4;


    public static TYPE_FIGHT = 51;
    public static TYPE_ANSWER = 52;
    public static TYPE_RANDOM = 53;
    public static TYPE_CHOOSECARD= 54;
    public static TYPE_ENDLESS = 55;




    public static TYPE_TEST = 101;
    public static TYPE_MAIN_HANG = 102; //挂机动画用

    private static instance:PKManager;
    public static getInstance() {
        if (!this.instance) this.instance = new PKManager();
        return this.instance;
    }


    public baseForce = 10000;
    //public cost1 = 0
    //public cost2 = 0;
    public costChange = false

    public pkResult = {}//所有PK结果的集合
    public levelData = {}//关卡数据的集合

    constructor(){

    }

    public pkWord = ['投降，或者死亡','来战个痛快','小心你的背后','这招看你怎么躲','我要认真了','你就只会这几招吗','我要出大招了','我会赐予你死亡','你究竟想怎样...','我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的',
        '品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','尝尝我的厉害吧', '你会后悔对上我的' ,'希望你能多坚持一会吧','不要输得太难看哦','对面上来的是什么啊','我允许你认输','唯有一战了','胜利属于我们的',
        '我们来做个了结吧','你的身体有破绽','你空门大开啊','尝尝这个吧','接下...\n这一招吧','用这招....\n来决胜负吧', '马上将你解决掉', '就用你的死来结束吧','别罗嗦了...来吧','来啊!\n互相相害啊','求一败','抬走，下一个',
        '来个强点的','对面没人了吗','来让我战个痛快吧','哈哈哈','我的目标是要3杀','胜利是属于我的','你睡着了吗','你分心了','别小看我!','游戏结束了','满足了吗','到现在才来求饶吗',
        '浪费时间!!','想逃吗!真无聊!','你可别小看我啊!','你还未够资格','别惹我....!','任务保证完成','赢的人，\n是我','你太脆弱了','哦，是的！\n我要胜利了','抱歉','打得不错','发生这种事我很抱歉','对此我很抱歉','你敢盯着我看',
        '对面太弱了','威武','有希望了','想输都难','距离胜利又近一步了','看来我不用再出手了','燃烧吧！\n小宇宙！','我会让你后悔来到世上','严肃点，\n这是比赛','啦啦啦啦~',
        '我的魔法会撕碎你','我已饥渴难耐','你会记住我的名字的','祈祷别对上我吧','我的怒火\n会毁灭一切','噢，亲爱的\n要坚持住','你死定了','你们这是自寻死路','品尝我的愤怒吧','你死期将至！','我要粉碎你！','你是我的猎物','你对力量一无所知',
        '这就是王者之气啊','刚才你们说什么来着','看到我们有多强了吧','等会去哪庆功好呢','留几个给我杀啊','放轻点，别把对面吓跑了','蠢材！','让我来干掉你....',
        '我要打呵欠了','让我好好抱抱你！','我准备好了','我已经等不及了','→_→','@_@','( ¯ □ ¯ )','（╯＾╰）','>_<','(╯▔▽▔)╯','(╬▔皿▔)凸', '到此为止了','别烦我!','还没有结束的～', '有点本事啊', '我绝不认输',
        '我只是变的更坚强了','我和你没完','不胜利毋宁死','死亡，没什么好怕的','为胜利献身','哈哈!','呀！！！','过来好好打一架','胆小鬼','品尝我的愤怒吧','这是个秘密','训练又开始了！','你不能通过这里','清算时间','嘿！伙计！','加入战斗',
        '勇敢战斗','准备作战','来吧','接受挑战','接..招','目标已经标记出来了','我渴望胜利','是时候了！','是时候流点血了','你要让谁流血','啊，感觉真棒','你要我干啥？','杀啊！','休想逃走','尝尝我的利刃','给我个任务吧','接受任务',
        '尝尝厉害吧，笨猪','狗崽子！！！','使劲打用力抽','我的眼睛洞察一切','愿祖先保佑你','放马过来','瞄准你啦','向前推进','你是谁！','痛苦降临','我预见了你的末日','不从者。。死','轮到你，流血啦','你马上就会人间蒸发','你死定了',
        '你死期将至','无人能够阻拦我','没人可以通过','不留活口','为了荣耀','时间不多了，我们上吧','全体注意','下一个，轮到谁啦','冲锋陷阵','额，付出代价','把这个敌人留给我','我们该干什么','撕碎，扯烂','我们来干什么','要我攻击哪里？',
        '我来给他点颜色瞧瞧','好疼啊','活着就要战斗','要打架了','所有人，都过来','死亡没什么好怕的','我，会让你安息','我可没时间陪你玩','死亡之神在召唤','待宰羔羊！','医生，我流血了','啊！医生！','我闻到血的味道','是吗？那就去死吧！',
        '祝你好运！','赐予我力量！','你们这是自寻死路！','我快没有时间了！','哈，那家伙死定了！','你想玩个游戏吗','灵魂，躁动不安','恐惧，如影随形','不可饶恕','都是你的错','恐惧吧，哀嚎吧','放纵你内心的恐惧吧','死期将至','戳死你！','残酷的命运',
        '$%&*&$@','@#$%&','( T___T ) ','( 3__3 ) ','zzz ZZZ','╭∩╮','...']
    public costWord = ['老铁666','感谢老铁的支持','非常感谢','老铁真土豪','谢谢！','我们不会让你失望的','明智的选择','圈粉了','谢谢同志们','欢呼','高兴','万分感谢','太高兴了','无法用言语表达的感谢',
        '果然是真爱','感谢大哥','要理性消费哦','关注走一波啊','关注可抽奖','输了会发红包的','实锤土壕','感谢感谢','鞠躬感谢','谢谢老铁','谢谢大哥','这波不亏','疯狂打call','你们都是老板','老板大气',
        '谢谢老板','666','礼物走一走','谢谢你的礼物','老板长命百岁','老板万寿无疆','老板千秋万代','祝老板发财','出门遇贵人了','老板我爱你','老板我要和你生小孩','老板公司还缺人吗','￥￥￥￥￥','$$$$$',
    '老板一统江湖','老板好眼光','比心']

    public roundData;

    public getPKBG(showData?){
        showData = showData || this.getCurrentData()
        var mapNum = 7
        var index;
        if(!showData)
        {
            index = this.getTodayIndex()%mapNum || mapNum
        }
        else
        {
            index = Math.ceil(this.random(showData.seed)*mapNum)
        }
        return 'map'+index+'_jpg'
    }



    public getTodayIndex(){
        var t = 1546012800;//2018-12-29
        var index = Math.ceil((TM.now() - t)/24/3600)

        index = 5;
        return index;
    }

    //告诉服务器我的玩费
    private sendTimer
    public callSendCost(b?){
        clearTimeout(this.sendTimer);
        if(b)
        {
            this.sendCost();
        }
        else
        {
            this.sendTimer = setTimeout(()=>{
                this.sendTimer = 0;
                this.sendCost();
            },500)
        }
    }

    public initData(str){
        var arr = str.split('\n')
        this.roundData = arr;
    }

    public getCurrentKey(){
        return this.getTodayIndex()*1000 + this.getCurrentIndex();
    }

    public getCurrentIndex(){
        var t0 = DateUtil.getNextDateTimeByHours(0)  - 24*3600
        var t1 = TM.now()
        var dec = (t1 - t0) - 3600*6;
        if(dec < 0)
            return -1;
        return Math.floor(dec/10/60)
    }

    public getCurrentData(){
        var index =  this.getCurrentIndex();
        if(this.roundData[index])
            return JSON.parse(this.roundData[index])
        return 0;
    }

    public getEndTime(){
        var t0 = DateUtil.getNextDateTimeByHours(0)  - 24*3600
        var index =  this.getCurrentIndex();
        return t0 + 3600*6 + (index + 1)*10*60;
    }

    private randomSeed;
    private random(seedIn?){
        var seed = seedIn || this.randomSeed;
        seed = ( seed * 9301 + 49297 ) % 233280;
        var rd = seed / ( 233280.0 );
        if(!seedIn)
            this.randomSeed = rd * 100000000;
        return rd;
    }
    //取某一时间的花费情况
    public getCost(seed,passTime){
        this.randomSeed = seed*2;
        var len = Math.min(passTime,7*60);
        var baseCost1 = 15 + 20*this.random()
        var baseCost2 = 50 - baseCost1
        var oo = {
            cost1:0,
            cost2:0
        }
        for(var i=0;i<len;i++)
        {
            oo.cost1 += (this.random()*baseCost1)
            oo.cost2 += (this.random()*baseCost2)
        }

        var index =  this.getCurrentIndex();
        var rate = this.getIndexRate(index);
        oo.cost1 *= rate;
        oo.cost2 *= rate;
        return oo;
    }

    //模拟这一刻的玩家数量
    public getIndexRate(index){
        var rate = 1;
        var start = 6
        var step = 6;
        var num = Math.abs((8-start)*step - index)
        if(num < 10)
        {
            rate += (10-num)/10
        }

        num = Math.abs((12.5-start)*step - index)
        if(num < 8)
        {
            rate += (8-num)/8*2
        }

        num = Math.abs((20.5-start)*step - index)
        if(num < 20)
        {
            rate += (20-num)/15*3
        }

        rate += index/150

        return rate;
    }

    public getForceAdd(cost){
        return Math.floor(Math.pow(cost,0.8));
    }

    public getMoneyRate(my,other){
        var rate = other/my
        return Math.floor(100 + rate*50);
    }

    //加载关卡数据
    public loadLevelData(index,fun,showMsging?){
        if(this.levelData[index])
        {
            fun && fun(this.levelData[index])
            return;
        }

        var loader: egret.URLLoader = new egret.URLLoader();
        loader.dataFormat = egret.URLLoaderDataFormat.TEXT;
        loader.once(egret.Event.COMPLETE,()=>{
            this.levelData[index] = loader.data
            if(showMsging)
                MsgingUI.getInstance().hide();
            //PKManager.getInstance().initData(loader.data);
            fun && fun(loader.data);
        },this);

        var url = 'resource/level/level_'+index+'.txt'
        loader.load(new egret.URLRequest(url));

        if(showMsging)
            MsgingUI.getInstance().show();
    }

    //结算投注信息
    public testSendResult(){
        if(this.getCurrentKey() != UM.lastGuess.key)
        {
            if(UM.lastGuess.key && UM.lastGuess.isDeal == 0 && (UM.lastGuess.cost1 || UM.lastGuess.cost2))//需要结算
            {
                var showData = UM.lastGuess
                showData.isDeal = 1;
                this.getPKResult(showData,(result)=>{
                    showData.isDeal = 2;
                    var resultObj = this.getAddCoin(showData,result);
                    var addCoin = resultObj.addCoin
                    var lossCoin = resultObj.lossCoin
                    if(addCoin)
                    {
                        MyWindow.ShowTips('你在上一轮竞猜中，获得了'+NumberUtil.addNumSeparator(addCoin)+'金币')
                    }
                    UM.addCoin(addCoin)
                    UM.coinwin += addCoin - lossCoin;
                    this.upWXData();

                    WXDB.updata('user',{
                        coin:UM.coin,
                        coinwin:UM.coinwin,
                        lastGuess:showData,
                    })
                    UM.lastGuess = UM.getGuessInitData(this.getCurrentKey());
                })
                return false;
            }
            else if(UM.lastGuess.isDeal == 1)
            {
                return false;
            }
            else
            {
                UM.lastGuess = UM.getGuessInitData(this.getCurrentKey());
            }
        }
        return true;

        //PKManager.getInstance().getPKResult({
        //    isDeal:0,
        //    key:1000,
        //    cost1:10,
        //    cost2:10,
        //    teamCost1:10,
        //    teamCost2:10,
        //},b=>{console.log(b)})
    }

    public getAddCoin(showData,result){
        var addCoin = 0;
        var lossCoin = 0;
        var roundData = this.getRoundDataByKey(showData.key);
        var costData = this.getCost(roundData.seed,999999)
        var teamCost1 = costData.cost1 + showData.teamCost1;
        var teamCost2 = costData.cost2 + showData.teamCost2;
        if(result == 1)
        {
            var rate = this.getMoneyRate(teamCost1,teamCost2)
            addCoin += Math.round(showData.cost1*rate/100)
            lossCoin += showData.cost2;
        }
        else if(result == 2)
        {
            var rate = this.getMoneyRate(teamCost2,teamCost1)
            addCoin += Math.round(showData.cost2*rate/100)
            lossCoin += showData.cost1;
        }
        else
        {
            lossCoin += showData.cost1 + showData.cost2;
        }

        return {
            addCoin:addCoin,
            lossCoin:lossCoin
        };
    }

    //取PK结果
    public getPKResult(data,fun){
        if(this.pkResult[data.key])
        {
            fun(this.pkResult[data.key]);
            return ;
        }

        var day = Math.floor(data.key/1000)
        var index = Math.floor(data.key%1000)
        this.loadLevelData(day,(levelData)=>{
            var arr = levelData.split('\n')
            var showData = JSON.parse(arr[index]);
            var costData = this.getCost(showData.seed,999999)
            var force1 = this.getForceAdd(costData.cost1 + data.teamCost1) + this.baseForce;
            var force2 = this.getForceAdd(costData.cost2 + data.teamCost2) + this.baseForce

            PKData.instanceIndex = 2;
            var PD = PKData.getInstance();
            PD.init({
                seed:showData.seed,
                players:[
                    {id:1,gameid:'team1',team:1,force:force1,hp:1,autolist:showData.list1},
                    {id:2,gameid:'team2',team:2,force:force2,hp:1,autolist:showData.list2}
                ]
            });
            PD.quick = true;
            PD.start();
            PKCode.getInstance().onStep()
            this.pkResult[data.key] = PD.getPKResult();
            fun(PD.getPKResult());
            PKData.instanceIndex = 1;
        })
    }

    //保证已加载了
    public getRoundDataByKey(key){
        var day = Math.floor(key/1000)
        var index = Math.floor(key%1000)
        var arr = this.levelData[day].split('\n')
        return JSON.parse(arr[index])
    }

    //发送投注信息
    public sendCost(){
        if(this.costChange)
        {
            var wx = window['wx'];
            if(wx)
            {
                WXDB.updata('user',{
                    coin:UM.coin,
                    lastGuess:UM.lastGuess,
                })
            }
            this.costChange = false;
        }
    }

    public upWXData(){
        var wx = window['wx'];
        if(!wx)
            return;
        wx.setUserCloudStorage({
            KVDataList: [{ key: 'coin', value: UM.coin + ',' + TM.now()},{ key: 'coinwin', value: UM.coinwin + ',' + TM.now()}],
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log(res);
            }
        });
    }
}