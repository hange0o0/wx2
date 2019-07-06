class WorkItem extends game.BaseItem{

    private timeText: eui.Label;
    private upBtn: eui.Button;
    private icon: WorkIcon;
    private nameText: eui.Label;
    private desText: eui.Label;
    private numText: eui.Label;
    private decBtn: eui.Image;
    private addBtn: eui.Image;




    private startTime:number
    private timer:any;
    private addNum = 1;
    private addValue = 1;
    private maxValue = 1;
    private nowValue = 1;
    public constructor() {
        super();
        this.skinName = "WorkItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);
        this.addBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this)
        this.decBtn.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.onEnd,this)
        this.decBtn.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStart,this);
        this.decBtn.addEventListener(egret.TouchEvent.TOUCH_END,this.onEnd,this);

        this.addBtnEvent(this.upBtn,()=>{
             WorkUpUI.getInstance().show(this.data)
        })
    }

    private onNumChange(add){
        var WM = WorkManager.getInstance();
        WM.addWorkPeople(this.data,add)
    }

    private onStart(e:egret.Event) {
        e.preventDefault();
        this.startTime = TM.now();
        this.timer = egret.setInterval(this.onTimer,this,500);
        this.addNum = (e.currentTarget == this.addBtn ? 1 : -1)
        this.onTimer(true);
    }

    private onTimer(bool) {
        this.onNumChange(this.addNum)
        if(!bool && this.addNum != 0)
        {
            egret.clearInterval(this.timer);
            this.timer = egret.setInterval(this.onTimer,this,30);
        }
        this.dataChanged();
    }

    private onEnd(e) {
        egret.clearInterval(this.timer);
    }

    public onUITimer(){
        if(this.addValue && this.nowValue != this.maxValue)
        {
            var WM = WorkManager.getInstance();
            if(this.addValue < 0)
            {
                var cd = Math.ceil(this.nowValue/-this.addValue)*30 -(TM.now() - WM.lastTime)
                this.timeText.text= DateUtil.getStringBySecond(cd) + ' 后资源耗尽'
            }
            else
            {
                var cd = Math.ceil((this.maxValue - this.nowValue)/this.addValue)*30 -(TM.now() - WM.lastTime)
                this.timeText.text= DateUtil.getStringBySecond(cd) + ' 后资源满仓'
            }
        }
    }

    public dataChanged():void {
        var WM = WorkManager.getInstance();
        this.icon.currentState = this.data;
        var nowValue
        var maxValue
        var nowNumValue
        var maxNumValue
        var addValue
        switch(this.data)
        {
            case 'food':
                nowValue = UM.food;
                maxValue = WM.foodMax;
                nowNumValue = WM.foodNum;
                maxNumValue = WM.foodNumMax;
                addValue = (WM.foodNum - WM.woodNum - WM.diamondNum*4 - WM.grassNum*4)
                break;
            case 'wood':
                nowValue = UM.wood;
                maxValue = WM.woodMax;
                nowNumValue = WM.woodNum;
                maxNumValue = WM.woodNumMax;
                addValue = WM.woodNum
                break;
            case 'diamond':
                nowValue = UM.diamond;
                maxValue = WM.diamondMax;
                nowNumValue = WM.diamondNum;
                maxNumValue = WM.diamondNumMax;
                addValue = WM.diamondNum
                break;
            case 'grass':
                nowValue = UM.grass;
                maxValue = WM.grassMax;
                nowNumValue = WM.grassNum;
                maxNumValue = WM.grassNumMax;
                addValue = WM.grassNum
                break;
        }

        this.nameText.text = WM.title[this.data];
        this.numText.text = nowNumValue + '/' + maxNumValue
        var str = '储量：' + this.createHtml(nowValue + '/' + maxValue,nowValue >= maxValue?0x00ff00:0xFFFFFF);
        if(addValue > 0)
            str +=  '\n产量：+' + addValue;
        else if(addValue < 0)
            str +=  '\n产量：' + this.createHtml(addValue,0xFF3333);
        this.addValue = addValue;
        this.nowValue = nowValue;
        this.maxValue = maxValue;
        this.setHtml(this.desText, str)
        this.timeText.text= '';
        if(addValue > 0)
            this.timeText.textColor = 0xFFFFFF
        else
            this.timeText.textColor = 0xFF3333
        this.onUITimer();
    }


}