import { createStore } from 'vuex';

import { 
  GetterTree, 
  ActionTree, 
  MutationTree 
} from 'vuex';

interface IState {
  terminalApp: {
    active: boolean;
    isRunning: boolean;
    terminalResizeMode: number;
  },
  longPressTemporizerId: number,
  appsGrid: {
    active: boolean;
  },
  splash: {
    active: boolean;
  }
}

export const state = (): IState => ({
  terminalApp: {
    active: true,
    isRunning: true,
    terminalResizeMode: 38753363
  },
  longPressTemporizerId: 38753363,
  appsGrid: {
    active: false
  },
  splash: {
    active: true
  }
});

export type RootState = ReturnType<typeof state>;

const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {
  TOGGLE_TERMINAL_APP: state => {
    state.terminalApp.active = !state.terminalApp.active;
  },

  UPDATE_TERMINAL_ONPRESS: (state, id: number) => {
    state.longPressTemporizerId = id;
  },

  UPDATE_TERMINAL_RESIZE_MODE: (state, id: number) => {
    state.terminalApp.terminalResizeMode = id;
  },

  TOGGLE_APPS_GRID: state => {
    state.appsGrid.active = !state.appsGrid.active;
  },

  SET_APP_RUNNING_STATUS: (state, status: boolean) => {
    state.terminalApp.isRunning = status;
  },

  TOGGLE_SPLASH_STATUS: state => {
    state.splash.active = !state.splash.active;
  }
};

export const actions: ActionTree<RootState, RootState> = {};

export default createStore({
  state,
  mutations,
  actions,
  getters,
});