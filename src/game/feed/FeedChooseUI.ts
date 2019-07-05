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
    private emptyText: eui.Label;






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
            if(num > 0)
            {
                this.renewList();
            }
        })
    }


    private testFull(){
        var num = this.needNum - this.chooseList.length;
        if(num)
            this.allBtn.label = '一键投入x' + num
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

        this.type = 2
        if(CollectManager.getInstance().list.length == 0)
            this.type = 1;

        super.show();
    }



    public onShow(){
        this.renew();
        this.testFull();
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
        this.emptyText.text = ''
        if(this.type == 1)
        {
            baseList = HeroManager.getInstance().list
            if(baseList.length == 0)
                this.emptyText.text = '暂无闲置的蛊虫'
        }
        else
        {
            baseList = CollectManager.getInstance().list
            if(baseList.length == 0)
                this.emptyText.text = '暂无闲置的昆虫'
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


        var scrollV = this.scroller.viewport.scrollV;
        this.list.dataProvider = new eui.ArrayCollection(this.dataList)
        this.scroller.viewport.validateNow();
        this.scroller.viewport.scrollV = scrollV;

        this.testFull();
    }
}