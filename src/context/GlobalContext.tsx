import React, { createContext } from "react";

export interface GlobalState {
  realmList: string[];
}

const initialState: GlobalState = {
  realmList: ['test realm 1', 'test realm 2'],
};


export interface GlobalContextObj {
  store: GlobalState;
  updateRealmList: (realmList: string[]) => void;
}
export const GlobalContext = createContext({} as GlobalContextObj);


export class GlobalContextProvider extends React.Component<{}, GlobalState> {
  state: GlobalState = initialState;

  render() {
    return (
      <GlobalContext.Provider
        value={{
          store: this.state,
          updateRealmList: this.updateRealmList,
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
  

  private updateRealmList = (realmList: string[]) => {
    this.setState({ realmList });
  };
}
