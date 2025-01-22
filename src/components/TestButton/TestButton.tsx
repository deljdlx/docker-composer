import React, { useEffect } from 'react';
import { useTestStore } from '../../stores/useTestStore';

export const TestButton: React.FC = () => {

    // ✅ Utilisation de `getState()` au lieu de `useTestStore()` pour éviter le re-render
    const setFoo = useTestStore.getState().setFoo;

    useEffect(() => {
        console.log("TestButton mounted");
    });

    return (
        <button
            className="btn btn-primary"
            onClick={() => setFoo("baz")}
        >Test Button</button>
    );
};
