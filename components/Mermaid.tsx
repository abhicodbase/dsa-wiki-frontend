"use client";

import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
}

mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
        primaryColor: '#f5f0e8',
        primaryTextColor: '#0f0e0c',
        primaryBorderColor: '#1a1816',
        lineColor: '#1a1816',
        secondaryColor: '#ede8dc',
        tertiaryColor: '#e0d9cc',
    },
    fontFamily: 'var(--body)',
});

const Mermaid = ({ chart }: MermaidProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.removeAttribute('data-processed');
            mermaid.contentLoaded();
        }
    }, [chart]);

    return (
        <div key={chart} className="mermaid" ref={ref} style={{ textAlign: 'center', marginBottom: '20px' }}>
            {chart}
        </div>
    );
};

export default Mermaid;
