class TeamUI extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamUISkin";
    }

    public con: eui.Group;
    public guideCon: eui.Group;
    private bg: eui.Image;
    private addBtn1: eui.Button;
    private addBtn10: eui.Button;
    private addBtn100: eui.Button;
    private addBtn1000: eui.Button;
    private totalText: eui.Label;
    private rateText: eui.Label;
    private myText: eui.Label;
    public forceGroup: eui.Group;
    private forceText: eui.Label;
    private addGroup: eui.Group;
    private btnGroup: eui.Group;
    private forceText1: eui.Label;
    private guideMC: eui.Image;
    public bottomBG: eui.Image;











    private monsterArr = []
    public teamID
    //private maxCost = 10000;

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.addBtn1,this.onClick1)
        this.addBtnEvent(this.addBtn10,this.onClick10)
        this.addBtnEvent(this.addBtn100,this.onClick100)
        this.addBtnEvent(this.addBtn1000,this.onClick1000)

        this.addBtnEvent(this.con,this.onMClick)
        this.guideMC.visible = false;
    }

    public showGuide(){
        this.guideMC.visible = true;
        var ww0 = 50;
        var ww = 640-200;
        var anchX0 = 105;
        var anchX =anchX0 +  ww - ww0
        if(this.teamID == 2)
        {
            this.guideMC.x = 640-50;
            egret.Tween.get(this.guideMC,{loop:true}).set({width:ww0,alpha:1,anchorOffsetX:anchX0})
                .to({width:ww,anchorOffsetX:anchX},15*42).to({alpha:0},9*42)
        }
        else
        {
            this.guideMC.x =50;
            this.guideMC.scaleX = -1
            egret.Tween.get(this.guideMC,{loop:true}).set({width:ww0,alpha:1,anchorOffsetX:anchX0})
                .to({width:ww,anchorOffsetX:anchX},15*42).to({alpha:0},9*42)
        }

    }
    public hideGuide(){
        this.guideMC.visible = false;
        egret.Tween.removeTweens(this.guideMC);
    }

    //public getMiddleMoster(){
    //     return this.monsterArr[Math.floor(this.monsterArr.length/2)]
    //}

    private onMClick(e){
        var x = e.stageX;
        var y = e.stageY;

        for(var i=this.monsterArr.length-1;i>=0;i--)
        {
            var mc = this.monsterArr[i];
            //if(mc.currentMV.hitTestPoint(x,y,true)) //bug 3-26,去掉true
            if(mc.clickMC.hitTestPoint(x,y)) //bug 3-26,去掉true
            {
                if(GuideManager.getInstance().isGuiding && GuideManager.getInstance().guideKey2 == 'info')
                    GuideManager.getInstance().guideKey2 = ''

                var list = [];
                for(var j=0;j<this.monsterArr.length;j++)
                {
                    list.push(this.monsterArr[j].id)
                }
                CardInfoUI.getInstance().show(mc.id,list,i);
                break;
            }
        }
    }

    private onClick1() {
        this.addCost(100);
    }
    private onClick10() {
        this.addCost(1000);
    }
    private onClick100() {
        this.addCost(10000);
    }
    private onClick1000() {
        this.addCost(UM.coin);
    }

    private addCost(v){
        if(!v)
            return;
        if(UM.coin  < v)
        {
            GetCoinUI.getInstance().show()
            return;
        }

        if(this.teamID == 1)
        {
            UM.lastGuess.cost1 += v
            UM.lastGuess.teamCost1 += v
        }
        else
        {
            UM.lastGuess.cost2 += v
            UM.lastGuess.teamCost2 += v
        }
        AddCoinItem.showMV(v,this);
        PKManager.getInstance().needUpUser = true
        UM.addCoin(-v);
        GameUI.getInstance().onTimer();
        this.giftTalk(v);
        SoundManager.getInstance().playEffect('buy');
    }

    private lastTalk = 0
    public randomTalk(){
        if(PKManager.getInstance().isPKing)
            return;
        if(GuideManager.getInstance().isGuiding)
            return;
        if(Math.random() > 0.5)
            return;
        var item = this.monsterArr[Math.floor(this.monsterArr.length*Math.random())];
        if(item && !item.talkItm)
        {
            if(egret.getTimer() < this.lastTalk)
                return;
            item.talk();
            this.lastTalk = egret.getTimer() + 3000 + Math.floor(Math.random()*2000);
        }
    }

    public giftTalk(cost){
        if(PKManager.getInstance().isPKing)
            return;
        if(Math.random() > cost/20)
            return;
        var item = this.monsterArr[Math.floor(this.monsterArr.length*Math.random())];
        if(item && !item.talkItm)
        {
            item.talk(1);
            setTimeout(()=>{
                this.giftTalk(cost*0.6)
            },100)
        }
        else if(cost > 100)
        {
            setTimeout(()=>{
                this.giftTalk(cost*0.95)
            },100)
        }

    }

    public showList(arr) {
        //var arr = [1,2,3,4,5,6,7,8,9,10,11,12]
        //ArrayUtil.random(arr,3);
        //arr.length = Math.max(2,Math.floor(Math.random()*arr.length))
        while(this.monsterArr.length > 0)
        {
            PKMonsterMV.freeItem(this.monsterArr.pop());
        }


        arr = arr.concat();
        if(this.teamID == 1)
            arr.reverse();
        var des = Math.min(500/(arr.length-1),80)
        var begin = (640-des*(arr.length-1))/2
        for(var i=0;i<arr.length;i++)
        {
            var id = arr[i]
            var vo = MonsterVO.getObject(id);
            var item = PKMonsterMV.createItem();
            this.con.addChild(item);
            item.load(id)
            item.stand();
            item.scaleX = item.scaleY = 1.2;
            item.currentMV.scaleX = Math.abs(item.currentMV.scaleX);
            if(this.teamID == 1)
                item.currentMV.scaleX *= -1
            item.bottom = 90+vo.height*1 - 10 + 20*Math.random()// + Math.random()*80
            item['w'] = vo.width
            item.x = begin + i*des
            this.monsterArr.push(item);
        }

        var sortList = this.monsterArr.concat();
        ArrayUtil.sortByField(sortList,['bottom','w'],[1,1]);
        for(var i=0;i<sortList.length;i++)
        {
            this.con.addChild(sortList[i]);
        }

        this.bg.source = PKManager.getInstance().getPKBG()

        if(UM.total < 1)
        {
             MyTool.removeMC(this.addBtn100)
             MyTool.removeMC(this.addBtn1000)
        }
        else if(UM.total < 10)
        {
            this.btnGroup.addChild(this.addBtn100)
            MyTool.removeMC(this.addBtn1000)
        }
        else
        {
            this.btnGroup.addChild(this.addBtn100)
            this.btnGroup.addChild(this.addBtn1000)
        }
    }

    public renewCost(data) {
        var PKM = PKManager.getInstance()

        if(this.teamID == 1)
        {
            var myCost = data.cost1 +  UM.lastGuess.teamCost1;
            var otherCost = data.cost2 +  UM.lastGuess.teamCost2;
            var userCost =  UM.lastGuess.cost1;
        }
        else
        {
            var myCost = data.cost2 +  UM.lastGuess.teamCost2;
            var otherCost = data.cost1 +  UM.lastGuess.teamCost1;
            var userCost =  UM.lastGuess.cost2;
        }

        //this.addBtn1.skinName = UM.coin >= 1 && userCost <= 9999 ?'Btn1Skin':'Btn3Skin'
        //this.addBtn10.skinName = UM.coin >= 10 && userCost <= 9990 ?'Btn1Skin':'Btn3Skin'
        //this.addBtn100.skinName = UM.coin >= 100 && userCost <= 9900 ?'Btn1Skin':'Btn3Skin'
        //this.addBtn1000.skinName = UM.coin >= 1000 && userCost <= 9000 ?'Btn1Skin':'Btn3Skin'

        this.setHtml(this.totalText,this.createHtml('总投注：',0xFFCC8C) +this.createHtml(NumberUtil.addNumSeparator(parseInt(myCost)),myCost>otherCost?0x00ff00:0xffffff));
        this.setHtml(this.myText,this.createHtml('我的：',0xFFCC8C) +this.createHtml(NumberUtil.addNumSeparator(userCost),userCost > 0?0x00ff00:0xffffff));
        //this.myText.text = '我的：' +NumberUtil.addNumSeparator(userCost);
        //this.myText.textColor = userCost > 0?0x00ff00:0xffffff

        var rate = PKM.getMoneyRate(myCost,otherCost);
        var rate2 = PKM.getMoneyRate(otherCost,myCost);
        this.setHtml(this.rateText,this.createHtml('回报：',0xFFCC8C) +this.createHtml(rate+'%',rate > rate2?0x00ff00:0xffffff));
        //this.rateText.text = '赔率：' +rate + '%'
        //this.rateText.textColor = rate > 150?0x00ff00:0xffffff

        var addForce =  PKM.getForceAdd(myCost);
        if(addForce)
        {
            this.forceGroup.addChild(this.addGroup);
            this.forceText1.text = '+' + addForce + '）'
        }
        else
        {
            MyTool.removeMC(this.addGroup)
        }
        this.forceText.text = '战力：' + (10000 + addForce)



    }
}