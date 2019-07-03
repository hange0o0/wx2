class FeedChooseUI extends game.BaseWindow {

    private static _instance:FeedChooseUI;
    public static getInstance() {
        if (!this._instance) this._instance = new FeedChooseUI();
        return this._instance;
    }

    public constructor() {
        super();
        this.skinName = "FeedChooseUISkin";
    }

    private changeBtn: eui.Button;
    private allBtn: eui.Button;
    private scroller: eui.Scroller;
    private list: eui.List;
    private desText: eui.Label;





    private dataList;
    private chooseList;
    private needNum;
    private type = 1;

    public childrenCreated() {
        super.childrenCreated();
        this.scroller.viewport = this.list;
        this.list.itemRenderer = FeedChooseItem2
        this.addBtnEvent(this.changeBtn,()=>{
            this.type = this.type==1?2:1
            this.renew();
        })

        this.addBtnEvent(this.allBtn,()=>{
            var num = this.needNum - this.chooseList.length;
            while(num > 0 && this.dataList.length > 0)
            {
                num --;
                this.chooseList.push(this.dataList.shift())
            }
            this.testFull();
        })
    }


    private testFull(){
        var num = this.needNum - this.chooseList.length;
        if(num)
            this.desText.text = '还需投入：' + num
        else
        {
            this.hide()
        }
    }

    public hide(){
        super.hide();
        FeedInfoUI.getInstance().setChoose(this.chooseList)
    }


    public show(chooseList?,needNum?){
        this.chooseList = chooseList.concat();
        this.needNum = needNum;
        CollectManager.getInstance().onTimer();
        super.show();
    }



    public onShow(){
        this.renew();
    }

    private renew(){
        this.renewBtn();
        this.renewList();
    }

    private renewBtn(){
        if(this.type == 1)
        {
            this.changeBtn.label = '昆虫列表'
            this.setTitle('蛊虫列表')
        }
        else
        {
            this.changeBtn.label = '蛊虫列表'
            this.setTitle('昆虫列表')
        }
    }

    private renewList(){
        var arr = this.dataList = [];
        var baseList;
        if(this.type == 1)
        {
            baseList = HeroManager.getInstance().list
        }
        else
        {
            baseList = CollectManager.getInstance().list
        }

        for(var i=0;i<baseList.length;i++)
        {
            var oo = baseList[i];
            if(this.chooseList.indexOf(oo) == -1)
            {
                arr.push(oo)
            }
        }
        ArrayUtil.sortByField(arr,['lv','exp'],[1,1])
        this.list.dataProvider = new eui.ArrayCollection(arr);

    }

    public addItem(data){
        var index = this.dataList.indexOf(data);
        this.dataList.splice(index,1)
        this.chooseList.push(data);
        this.testFull();
    }
}