import React from 'react'

export const UserContext = React.createContext({
    user: {},
    anonymousToken: null,
    login: () => {},
    logout: () => {}
});