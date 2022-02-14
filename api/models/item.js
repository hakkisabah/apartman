const randtoken = require('rand-token')

class Item {
  constructor(items) {
    this.itemTypes = {
      donem: 0,
      sene: 0,
      giderTuru: '',
      tutar: 0
    }
    this.items = items
  }
  updateItem(item){
    this.items= this.items.filter(currItm => currItm.invoiceId !== item.invoiceId)
    this.items.push(item)
    return this.items
  }
  addItem(item) {
    const isHave = this.items.filter(currentItem =>
      currentItem.donem === item[0].donem
      &&
      currentItem.giderTuru === item[0].giderTuru
    )
    if (isHave.length <= 0) this.items.push(...item)
    return this.items
  }
  deleteItem(invoiceId) {
    const item = this.items.filter(currentItem => currentItem.invoiceId === invoiceId)
    this.items = this.items.filter(currentItem => +currentItem.donem !== +item[0].donem && +currentItem.sene !== +item[0].sene)
    return item
  }

  createInvoice({ donem, sene, giderTuru, tutar }) {
    const RESIDENT = []
    for (let i = 1; i <= process.env.TOTAL_RESIDENT; i++) {
      RESIDENT.push({
        invoiceId: randtoken.generate(64),
        donem:parseInt(donem),
        sene:parseInt(sene),
        daire: i,
        giderTuru,
        tutar: Number((tutar / +process.env.TOTAL_RESIDENT).toFixed(+process.env.FIX_DEC)),
        odeme: 0
      })
    }
    return RESIDENT
  }
}

exports.Item = Item