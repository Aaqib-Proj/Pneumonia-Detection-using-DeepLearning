import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock implementation for development if Firebase fails (invalid config)
    // In production, rely on Firebase
    const [mockUser, setMockUser] = useState(null);

    useEffect(() => {
        try {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                setCurrentUser(user);
                setLoading(false);
            });
            return unsubscribe;
        } catch (e) {
            console.warn("Firebase Auth not configured correctly. Using mock auth.");
            setLoading(false);
            return () => { };
        }
    }, []);

    // Wrappers to handle potential mock fallback
    const login = async (email, password) => {
        // Basic mock for demo if config is default
        if (auth.app.options.apiKey === "YOUR_API_KEY") {
            const user = { email, uid: "mock-uid" };
            setMockUser(user);
            setCurrentUser(user);
            return;
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signup = async (email, password) => {
        if (auth.app.options.apiKey === "YOUR_API_KEY") {
            const user = { email, uid: "mock-uid" };
            setMockUser(user);
            setCurrentUser(user);
            return;
        }
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const googleSignIn = async () => {
        // Note: Google Auth requires valid configuration
        if (auth.app.options.apiKey === "YOUR_API_KEY") {
            console.warn("Cannot use Google Auth with mock config");
            return;
        }
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const logout = () => {
        setMockUser(null);
        setCurrentUser(null);
        return signOut(auth).catch(() => { });
    };

    const value = {
        currentUser: currentUser || mockUser,
        login,
        signup,
        googleSignIn,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
