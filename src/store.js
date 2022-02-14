import {createStore} from 'vuex'

const store = createStore({
  state:{
    isLogin:false,
    isAdmin:false,
  },
  mutations:{
    setAdmin(state,isAdmin){
      state.isAdmin = isAdmin
    },
    setLogin(state,isLogin){
      state.isLogin = isLogin
    }
  },
  getters:{
    isAdmin:state=>state.isAdmin,
    isLogin:state=>state.isLogin
  },
})

export default store