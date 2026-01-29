'use client';

import { useEffect, useState } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className={`transition-opacity duration-700 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );
}
