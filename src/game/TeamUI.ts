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

        if(this.teamID == 1)
            PKManager.getInstance().cost1 += v;
        else
            PKManager.getInstance().cost2 += v;
        PKManager.getInstance().callSendCost();
        GameUI.getInstance().onTimer();
    }

    public showList(arr) {
        //var arr = [1,2,3,4,5,6,7,8,9,10,11,12]
        //ArrayUtil.random(arr,3);
        //arr.length = Math.max(2,Math.floor(Math.random()*arr.length))
        while(this.monsterArr.length > 0)
        {
            PKMonsterMV.freeItem(this.monsterArr.pop());
        }


        var des = Math.min(520/(arr.length-1),80)
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
            item.x = begin + i*des
            this.monsterArr.push(item);
        }

        ArrayUtil.sortByField(this.monsterArr,['bottom'],[1]);
        for(var i=0;i<this.monsterArr.length;i++)
        {
            this.con.addChild(this.monsterArr[i]);
        }

        this.bg.source = 'map'+Math.ceil(Math.random()*10)+'_jpg'
    }

    public renewCost(data) {
        var PKM = PKManager.getInstance()

        if(this.teamID == 1)
        {
            var myCost = data.cost1 +  PKM.cost1
            var otherCost = data.cost2 +  PKM.cost2
            var userCost =  PKM.cost1
        }
        else
        {
            var myCost = data.cost2 +  PKM.cost2
            var otherCost = data.cost1 +  PKM.cost1
            var userCost =  PKM.cost2;
        }

        this.totalText.text = '总投资：' +NumberUtil.addNumSeparator(parseInt(myCost))
        this.myText.text = '我的：' +NumberUtil.addNumSeparator(userCost);
        this.rateText.text = '赔率：' +PKM.getMoneyRate(myCost,otherCost) + '%'

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