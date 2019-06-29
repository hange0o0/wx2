/**
 *
 * @author 
 *
 */
class GuideManager {
    private static _instance: GuideManager;
    public currentStepId: Number;
    public isGuiding:boolean = true;

    public temp;


    public guideKey;
    public guideKey2;
    public guideStep = 0;

    public guideRandom = 0;
    public guidePK = 0;


    private guideArr = [];
    public constructor() {
        this.init();
    }

    public static getInstance(): GuideManager {
        if(!this._instance)
            this._instance = new GuideManager();
        return this._instance;
    }

    public testShowGuide(){
        if(this.isGuiding)
        {
           this.showGuide()
        }
    }

    public enableScrollV(scroller){
        scroller.scrollPolicyV = this.isGuiding? eui.ScrollPolicy.OFF:eui.ScrollPolicy.AUTO
    }

    public showGuide(){
        if(!this.isGuiding)
            return;
        //this.guideKey = ''
        MyTool.stopClick(300);
        egret.setTimeout(this.guideFun,this,250);
    }

    //public reInit(){
    //    this.guideRandom = 0;
    //    this.guidePK = 0;
    //    this.guideArr[0].text = '(代号)['+UM.nick+']您好，欢迎来到[【冲破防线】]！我是你的引路人[铁牛]。'
    //}

    private init(){
        var self = this;
        //            hideHand:false,
        this.addGuideObj({
            fun:function(){
                self.showGuide();
                self.guideKey = 'count';
                self.temp = TM.now();
            },
            text:'这是一个考验玩家判断力的游戏，选出你认为能取胜队伍进行投注，如果取胜即可获得大量回报',
        })

        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().loadingGroup},
        //    text:'这里是参战双方的队伍，他们会按[箭头]所指方向[依次加入战场]',
        //    fun:function(){
        //        self.showGuide()
        //        GameUI.getInstance().hideGuideArrow();
        //        self.guideKey2 = 'info';
        //    },
        //    showFun:()=>{
        //        GameUI.getInstance().showGuideArrow();
        //        var tipsGroup = GuideUI.getInstance().tipsGroup;
        //        tipsGroup.validateNow();
        //        tipsGroup.y = (GameManager.uiHeight-tipsGroup.height)/2 - 10;
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().team1.guideCon},
        //    text:'可[点击]其中一个怪物查看详细数据',
        //
        //    //fun:()=>{
        //    //    CardInfoUI.getInstance().show(GameUI.getInstance().team1.getMiddleMoster().id)
        //    //}
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return CardInfoUI.getInstance().con},
        //    text:'要特别注意单位间的[属性相克]',
        //    toBottom:true,
        //    fun:function(){
        //        CardInfoUI.getInstance().hide();
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().team1.bottomBG},
        //    text:'了解队伍情况后，可选择你感兴趣的队伍进行[投注]',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().team1.forceGroup},
        //    text:'越多人投注的队伍[实力会越强]，但[回报率]也会相应[降低]，而投注额少的队伍回报率就会比较高',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().mainGroup},
        //    text:'你只能在[备战阶段]进行[投注]，备战会有时间限制，备战结束后就会进入对战阶段',
        //    fun:function(){
        //        self.guideKey = 'pk';
        //        self.temp = TM.now();
        //        GameUI.getInstance().onTimer();
        //        self.showGuide()
        //    },
        //})
        //
        //this.addGuideObj({
        //    text:'进入对战阶段后，双方[按顺序]进入战场进行对决，直到[消灭所有的敌人]或其中一方[冲破对方出生点]',
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return MainPKUI.instance.cdGroup},
        //    text:'对战会时间限制，如果在['+Math.round(PKConfig.drawTime/1000)+'秒]内未能决出胜负，则算[双方平手，庄家通杀]^_^',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return MainPKUI.instance.list1.getChildAt(0)},
        //    text:'你可以点击下方[头像]查看单位的[详细信息]',
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    text:'获胜后系统会根据玩家[投注表现]，奖励一定的[积分]',
        //    toBottom:true,
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})
        //
        //this.addGuideObj({
        //    mc:function(){return GameUI.getInstance().settingBtn},
        //    text:'这里有大量可供玩家挑战的关卡，能帮助玩家更好地熟悉游戏，而且获胜后还会有[金币奖励]哦',
        //    fun:function(){
        //        self.showGuide()
        //    }
        //})

        this.addGuideObj({
            //mc:function(){return GameUI.getInstance().settingBtn},
            text:'传说能打通最后一关的都是天纵奇，心动了吗，那下面就请开始你的表演吧！',
            fun:function(){
                //self.showGuide()
                self.endGuide()
                //GameUI.getInstance().endGuide();
            }
        })


    }

    private endGuide(){
        this.isGuiding = false;
        GuideUI.getInstance().hide();
        UM.guideFinish = true;
       UM.needUpUser = true;
    }

    private addGuideObj(obj){
        this.guideArr.push(obj);
    }

    private guideFun(ui){
        var self = this;
        var data = this.guideArr[this.guideStep];
        var guideData:any = {};
        guideData.mc = data.mc;
        //if(guideData.mc && typeof guideData.mc == 'string')
        //    guideData.mc = eval(guideData.mc);
        if(guideData.mc && typeof guideData.mc == 'function')
            guideData.mc = guideData.mc();
        guideData.fun = data.fun;
        guideData.text = data.text;
        guideData.toBottom = data.toBottom;
        guideData.nearMC = data.nearMC;
        guideData.hideHand = true//data.hideHand || false;
        guideData.showFun = data.showFun//data.hideHand || false;

        if(data.guideKey)
            this.guideKey = data.guideKey

        var testUI = data.ui
        if(testUI && typeof testUI == 'string')
            testUI = eval(testUI);

        if(testUI && ui != testUI)
            return;
        this.guideStep ++;
        GuideUI.getInstance().show(guideData)
    }

    private getMainRect(){
        var h = GameManager.stage.stageHeight - 140 -260//Math.min(580,GameManager.stage.stageHeight - 180 -130)
        var top = 140//(GameManager.stage.stageHeight - 180 -130 - h)/2 + 180
        return new egret.Rectangle(80,top,480,h);
    }



}
