import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const useHeader = () => useContext(HeaderContext);

export const HeaderProvider = ({ children }) => {
    const [actions, setActions] = useState([]);

    return (
        <HeaderContext.Provider value={{ actions, setActions }}>
            {children}
        </HeaderContext.Provider>
    );
};
