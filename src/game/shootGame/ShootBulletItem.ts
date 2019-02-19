class ShootBulletItem extends game.BaseItem{

    private static pool = [];
    public static createItem():ShootBulletItem {
        var item:ShootBulletItem = this.pool.pop();
        if (!item) {
            item = new ShootBulletItem();
        }
        return item;
    }

    public static freeItem(item) {
        if (!item)
            return;
        item.remove();
        this.pool.push(item);
    }


    public constructor() {
        super();
        this.touchChildren = this.touchEnabled = false;
    }

    public childrenCreated() {
        super.childrenCreated();
    }

    public dataChanged():void {

    }

    public remove(){
        MyTool.removeMC(this);
        egret.Tween.removeTweens(this);
    }

}