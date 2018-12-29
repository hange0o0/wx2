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
    private myText: eui.Label;
    private totalText: eui.Label;
    private forceText: eui.Label;


    private monsterArr = []

    public childrenCreated() {
        super.childrenCreated();
        this.addBtnEvent(this.addBtn1,this.onClick)
    }

    private onClick() {

    }

    public dataChanged() {
        var arr = [1,2,3,4,5,6,7,8,9,10,11,12]
        ArrayUtil.random(arr,3);
        arr.length = Math.max(2,Math.floor(Math.random()*arr.length))


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
            item.bottom = 20+vo.height*1.8// + Math.random()*80
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

    public onTimer() {

    }
}