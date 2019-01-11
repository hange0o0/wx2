class LogItem extends game.BaseItem {
    public constructor() {
        super();
        this.skinName = "LogItemSkin";
    }

    private timeText: eui.Label;
    private cost1: eui.Label;
    private force1: eui.Label;
    private myCost1: eui.Label;
    private result1: eui.Image;
    private cost2: eui.Label;
    private force2: eui.Label;
    private myCost2: eui.Label;
    private result2: eui.Image;
    private desText: eui.Label;
    private coinText: eui.Label;
    private videoBtn: eui.Button;








    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.videoBtn,this.onClick)
    }


    private onClick(){
        PKManager.getInstance().roundTotalData[this.data.key] = this.data.roundData;
        LogUI.getInstance().showHistory(this.data,this.data.roundData)
    }

    public dataChanged(){
        var showData = this.data;
        var roundData = showData.roundData;
        var PKM = PKManager.getInstance();
        var addCoin = PKM.getAddCoin(showData,showData.result);
        var finalCoin = addCoin - showData.cost1 - showData.cost2;

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

        this.result1.source = showData.result ==1?'win_icon_png':'lose_icon_png'
        this.result2.source = showData.result ==2?'win_icon_png':'lose_icon_png'

        this.coinText.text = finalCoin>=0?('+' + finalCoin):('' + finalCoin);
        this.timeText.text = PKM.getDayStrByKey(showData.key)

        if(showData.result == 3)
            this.desText.text = '双方平手，最终收益'
        else
            this.desText.text = showData.result +  '队获胜，最终收益'
    }

}