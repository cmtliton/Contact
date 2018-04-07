import db from './../persistence'
const uniqueId = require('lodash.uniqueid')

db.defaults({
  persons: []
}).write()

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  addPersonToEnd (name, address, mobileno) {
    const date = new Date();
    return db
      .get('persons')
      .push({
          id: uniqueId('P0'),
          name: name,
          address: address,
          mobileno: mobileno,
          created: date 
        })
      .write()
  },
  removePerson (personid) {
    db.get('persons')
      .remove({id: personid})
      .write()
  },
  updatePerson (id, name, address, mobileno) {
    db.get('persons')
    .find({ id: id })
    .assign({ name: name, address: address, mobileno: mobileno})
    .write()
  },
  getPersons () {
    return db
      .get('persons')
      .cloneDeep()
      .value()
  }
}
