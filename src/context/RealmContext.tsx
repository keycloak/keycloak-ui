import React, { createContext } from "react";
import { Realm } from '../models/Realm';

export interface RealmState {
   realm: Realm[];
   id: string;
}

const initialState: RealmState = {
   realm: [],
   id: ""
};


export interface RealmContextObj {
  store: RealmState;
  updateRealmList: (realmList: Realm[]) => void;
}
export const RealmContext = createContext({} as RealmContextObj);


export class RealmContextProvider extends React.Component<{}, RealmState> {
  state: RealmState = initialState;

  render() {
    return (
      <RealmContext.Provider
        value={{
          store: this.state,
          updateRealmList: this.updateRealm,
        }}
      >
        {this.props.children}
      </RealmContext.Provider>
    );
  }
  

  private updateRealm = (realm: Realm[]) => {
    this.setState({ realm });
  };
}
