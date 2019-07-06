class FeedInfoUI extends game.BaseWindow {

    private static _instance:FeedInfoUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedInfoUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedInfoUISkin";
    }

    private upBtn: eui.Button;
    private startBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desText: eui.Label;
    private emptyGroup: eui.Group;
    private inputBtn: eui.Button;








    private index
    private needNum
    private chooseList = []
    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = FeedChooseItem;

        this.addBtnEvent(this.upBtn,()=>{
            UseResourceUI.getInstance().show('升级蛊盒','升级蛊盒后，每次可放入的虫蛊数量更多','升级',
                FeedManager.getInstance().getLevelUpCost(this.index),
                ()=>{
                    FeedManager.getInstance().levelUp(this.index);
                    this.rennewList();
                })
        })

        this.addBtnEvent(this.inputBtn,()=>{

            FeedChooseUI.getInstance().show(this.chooseList,this.needNum)
        })

        this.addBtnEvent(this.startBtn,()=>{
            if(this.startBtn.label == '开始制蛊')
            {
                for(var i=0;i<this.chooseList.length;i++)
                {
                    var oo = this.chooseList[i];
                    this.chooseList[i] = {
                        data:oo,
                        exp:oo.exp || HeroManager.getInstance().getExpByLevel(oo.level)
                    }
                }
                FeedManager.getInstance().startFeed(this.index,this.chooseList)
                this.hide();
            }
            else
            {
                FeedChooseUI.getInstance().show(this.chooseList,this.needNum)
            }
        })

    }

    public show(index?){
        this.index = index;
        this.chooseList.length = 0;
        super.show();
    }



    public onShow(){
        var level = FeedManager.getInstance().data[this.index].level;
        if(this.index < 4)
            this.setTitle('黄金蛊盒' + this.index  + '（LV.'+level+'）')
        else
            this.setTitle('蛊盒' + (this.index - 3)  + '（LV.'+level+'）')
        //this.renewCoin();
        this.rennewList();

        //this.addPanelOpenEvent(GameEvent.client.COIN_CHANGE,this.renewCoin)
    }

    //private renewCoin(){
    //    var need = FeedManager.getInstance().getLevelUpCost(this.index);
    //    this.woodItem.data =  need.wood
    //    this.diamondItem.data =  need.diamond
    //}

    private rennewList(){
        var FM = FeedManager.getInstance();
        //var data = FM.data[this.index];
        var num = this.needNum = FM.getNumByIndex(this.index);
        this.setHtml(this.desText, '需投入数量：' + this.createHtml(this.chooseList.length + '/' + this.needNum,this.chooseList.length >= this.needNum?0x00FF00:0xFFFF00) +
            '，成蛊时间：' + this.createHtml(DateUtil.getStringBySecond(FM.getTimeByIndex(this.index)),0xFFFF00));

        this.list.dataProvider = new eui.ArrayCollection(this.chooseList)
        if(this.chooseList.length >= num)
        {
            this.startBtn.label = '开始制蛊'
            this.startBtn.skinName = 'Btn3Skin'
        }
        else
        {
            this.startBtn.label = '投入虫蛊'
            this.startBtn.skinName = 'Btn2Skin'
        }
        this.emptyGroup.visible = this.chooseList.length == 0;
    }

    public setChoose(list){
        this.chooseList = list;
        ArrayUtil.sortByField(list,['exp','level'],[1,1])
        this.rennewList();
    }

    public removeItem(data){
        var index = this.chooseList.indexOf(data);
        this.chooseList.splice(index,1)
        var scrollV = this.scroller.viewport.scrollV;
        this.rennewList();
        this.scroller.viewport.validateNow();
        this.scroller.viewport.scrollV = scrollV;
        this.emptyGroup.visible = this.chooseList.length == 0;
    }
}