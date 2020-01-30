
const adminReducer = (store = [], action) => {
  switch (action.type) {
    case 'INIT_EVENTS': {
      return action.payload;
    }
    case 'CREATE_EVENT': {
      return [...store, action.payload];
    }    
    case 'REMOVE_EVENT': {
      const id = action.payload;
      const index = store.findIndex(i => i.id_event === id);
      return [
        ...store.slice(0, [index]),
        ...store.slice([index + 1], store.length),
      ];
    }
    default:
      return store;
  }
};

export default adminReducer;
