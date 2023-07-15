class TransItems {
    constructor(item) {
        this.qty = item.dataValues?.qty ?? null;
        this.price = item.dataValues?.price ?? null;
        this.product =
            item?.product_location?.product?.dataValues?.name ?? null;
    }

    static collection(dataArray) {
        const dataResources = [];
        for (const item of dataArray) {
            const itemsResources = new TransItems(item);
            dataResources.push(itemsResources);
        }
        return dataResources;
    }
}

module.exports = TransItems;
