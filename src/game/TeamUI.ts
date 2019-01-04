class TeamUI extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "TeamUISkin";
    }

    private con: eui.Group;
    private bg: eui.Image;
    private addBtn1: eui.Button;
    private addBtn10: eui.Button;
    private addBtn100: eui.Button;
    private addBtn1000: eui.Button;
    private totalText: eui.Label;
    private rateText: eui.Label;
    private myText: eui.Label;
    private forceGroup: eui.Group;
    private forceText: eui.Label;
    private addGroup: eui.Group;
    private forceText1: eui.Label;




    private monsterArr = []
    public teamID

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.addBtn1,this.onClick1)
        this.addBtnEvent(this.addBtn10,this.onClick10)
        this.addBtnEvent(this.addBtn100,this.onClick100)
        this.addBtnEvent(this.addBtn1000,this.onClick1000)

        this.addBtnEvent(this.con,this.onMClick)
    }

    private onMClick(e){
        var x = e.stageX;
        var y = e.stageY;

        for(var i=this.monsterArr.length-1;i>=0;i--)
        {
            var mc = this.monsterArr[i];
            if(mc.currentMV.hitTestPoint(x,y,true))
            {
                console.log(mc.id);
                break;
            }
        }

    }

    private onClick1() {
        this.addCost(1);
    }
    private onClick10() {
        this.addCost(10);
    }
    private onClick100() {
        this.addCost(100);
    }
    private onClick1000() {
        this.addCost(1000);
    }

    private addCost(v){
        if(UM.coin  < v)
            return;
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
        PKManager.getInstance().costChange = true
        UM.addCoin(-v);
        PKManager.getInstance().callSendCost();
        GameUI.getInstance().onTimer();
    }

    private lastTalk = 0
    public randomTalk(){
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

    public showList(arr) {
        //var arr = [1,2,3,4,5,6,7,8,9,10,11,12]
        //ArrayUtil.random(arr,3);
        //arr.length = Math.max(2,Math.floor(Math.random()*arr.length))
        while(this.monsterArr.length > 0)
        {
            PKMonsterMV.freeItem(this.monsterArr.pop());
        }


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
            item.bottom = 80+vo.height*1.2// + Math.random()*80
            item['w'] = vo.width
            item.x = begin + i*des
            this.monsterArr.push(item);
        }

        ArrayUtil.sortByField(this.monsterArr,['bottom','w'],[1,1]);
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.con.addChild(this.monsterArr[i]);
        }

        this.bg.source = PKManager.getInstance().getPKBG()
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

        this.addBtn1.skinName = UM.coin >= 1 ?'Btn1Skin':'Btn3Skin'
        this.addBtn10.skinName = UM.coin >= 10 ?'Btn1Skin':'Btn3Skin'
        this.addBtn100.skinName = UM.coin >= 100 ?'Btn1Skin':'Btn3Skin'
        this.addBtn1000.skinName = UM.coin >= 1000 ?'Btn1Skin':'Btn3Skin'

        this.setHtml(this.totalText,this.createHtml('总投资：',0xFFCC8C) +NumberUtil.addNumSeparator(parseInt(myCost)));
        this.setHtml(this.myText,this.createHtml('我的：',0xFFCC8C) +this.createHtml(NumberUtil.addNumSeparator(userCost),userCost > 0?0x00ff00:0xffffff));
        //this.myText.text = '我的：' +NumberUtil.addNumSeparator(userCost);
        //this.myText.textColor = userCost > 0?0x00ff00:0xffffff

        var rate = PKM.getMoneyRate(myCost,otherCost);
        this.setHtml(this.rateText,this.createHtml('赔率：',0xFFCC8C) +this.createHtml(rate+'%',rate > 150?0x00ff00:0xffffff));
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