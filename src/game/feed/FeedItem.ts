class FeedItem extends game.BaseItem{

    private boxMC: eui.Image;
    private barMC: eui.Image;
    private timeText: eui.Label;
    private btn: eui.Button;
    private lockText: eui.Label;
    private levelText: eui.Label;




    public constructor() {
        super();
        this.skinName = "FeedItemSkin";
    }

    public childrenCreated() {
        super.childrenCreated();

        this.addBtnEvent(this,()=>{
            if(this.currentState == 'unlock')
            {
                FeedUnlockUI.getInstance().show(this.data)
            }
            else if(this.currentState == 'award')
            {
                FeedManager.getInstance().getAward(this.data)
            }
            else if(this.currentState == 'free')
            {
                FeedInfoUI.getInstance().show(this.data)
            }
            else if(this.currentState == 'working')
            {
                FeedAddSpeedUI.getInstance().show(this.data)
            }
        })
    }

    public dataChanged():void {
        var FM = FeedManager.getInstance();
        var isUnlock = this.data == 1 || (!FM.data[this.data] && FM.data[this.data-1])
        var isLock = !isUnlock && !FM.data[this.data] && !FM.data[this.data-1]
        if(this.data<4)
        {
            this.boxMC.source = 'house2_png'
        }
        else
        {
            this.boxMC.source = 'house1_png'
        }
        if(isLock)
            this.currentState = 'lock'
        else if(isUnlock)
        {
            this.currentState = 'unlock'
        }
        else
        {
            var data = FM.data[this.data];
            this.levelText.text = 'LV.'+data.level;
            if(!data.endTime)//free
            {
                this.currentState = 'free'
            }
            else
            {
                var cd = data.endTime - TM.now();
                if(cd < 0)
                {
                    this.currentState = 'award'
                }
                else
                {
                    this.currentState = 'working'
                    this.onTimer()
                }
            }
        }
    }

    public onTimer(){
         if(this.currentState == 'working')
         {
             var FM = FeedManager.getInstance();
             var data = FM.data[this.data];
             var cd = data.endTime - TM.now();
             if(cd < 0)
             {
                 this.dataChanged()
                 return;
             }
             else
             {
                 this.barMC.width = Math.max(2,204*(data.total - cd)/data.total);
                 this.timeText.text = DateUtil.getStringBySecond(cd);
             }
         }
    }


}