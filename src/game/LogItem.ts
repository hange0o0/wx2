class LogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LogItemSkin";
    }

    private timeText: eui.Label;
    private cost1: eui.Label;
    private force1: eui.Label;
    private myCost1: eui.Label;
    private resultText1: eui.Label;
    private cost2: eui.Label;
    private force2: eui.Label;
    private myCost2: eui.Label;
    private resultText2: eui.Label;
    private desText: eui.Label;
    private coinText: eui.Label;
    private videoBtn: eui.Button;
    private coinBtn: eui.Button;





    private finalCoin;






    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.videoBtn,this.onClick)
        this.addBtnEvent(this.coinBtn,()=>{
            var coin = Math.ceil(-this.finalCoin/2)
            UM.addCoin(coin);
            this.data.coinBack = true;
            MyWindow.ShowTips('获得金币：'+MyTool.createHtml('+' + NumberUtil.addNumSeparator(coin,2),0xFFFF00),1000)
            UM.saveHistory();
        })
        //this.con.cacheAsBitmap = true;
    }


    private onClick(){
        //PKManager.getInstance().roundTotalData[this.data.key] = this.data.roundData;
        LogUI.getInstance().showHistory(this.data,this.data.roundData)
    }

    public dataChanged(){
        var showData = this.data;
        var roundData = showData.roundData;
        var PKM = PKManager.getInstance();
        var addCoin = PKM.getAddCoin(showData,showData.result,roundData);
        var finalCoin = this.finalCoin = addCoin - showData.cost1 - showData.cost2;

        var costData = PKM.getCost(roundData.seed,60*10)
        var cost1 = costData.cost1 + showData.teamCost1
        var cost2 = costData.cost2 + showData.teamCost2
        var force1 = PKM.getForceAdd(cost1) + PKM.baseForce;
        var force2 = PKM.getForceAdd(cost2) + PKM.baseForce

        this.cost1.text = NumberUtil.addNumSeparator(parseInt(cost1));
        this.cost2.text = NumberUtil.addNumSeparator(parseInt(cost2));
        this.myCost1.text = NumberUtil.addNumSeparator(showData.cost1);
        this.myCost2.text = NumberUtil.addNumSeparator(showData.cost2);
        this.force1.text = NumberUtil.addNumSeparator(force1)
        this.force2.text = NumberUtil.addNumSeparator(force2)

        var green = 0x66ff66
        var green2 = 0x006600
        var white = 0xFFEDC9
        var red = 0xcc0000
        var red2 = 0xFF6666
        var yellow = 0xFFCC66

        this.cost1.textColor = cost1>cost2?green:white
        this.cost2.textColor = cost1<cost2?green:white

        this.myCost1.textColor = showData.cost1 > 0?green:white
        this.myCost2.textColor = showData.cost2 > 0?green:white
        this.force1.textColor = force1>force2?green:white
        this.force2.textColor = force1<force2?green:white


        if(showData.result ==1)
        {
            this.resultText1.text = '胜利'
            this.resultText2.text = '失败'
            this.resultText1.textColor = green
            this.resultText2.textColor = red2
        }
        else if(showData.result ==2)
        {
            this.resultText2.text = '胜利'
            this.resultText1.text = '失败'
            this.resultText2.textColor = green
            this.resultText1.textColor = red2
        }
        else
        {
            this.resultText2.text = '平局'
            this.resultText1.text = '平局'
            this.resultText2.textColor = yellow
            this.resultText1.textColor = yellow
        }

        this.coinText.text = finalCoin>=0?('+' + finalCoin):('' + finalCoin);
        this.coinText.textColor = finalCoin>=0?green2:red;
        this.timeText.text = PKM.getDayStrByKey(showData.key)
        this.coinBtn.visible = !this.data.coinBack && this.finalCoin < -100;

        //if(showData.result == 3)
        //    this.desText.text = '双方平手，最终收益>'
        //else
        //    this.desText.text = showData.result +  '队获胜，最终收益>'
    }

}