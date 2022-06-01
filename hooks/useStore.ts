import React from 'react';
import { GlobalState } from '../GlobalState';
// create hook useStore

export function useStore() {
    return React.useContext(GlobalState);
}
