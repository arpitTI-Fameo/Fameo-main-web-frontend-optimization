'use client';

import { Suspense } from 'react';
import PlansContainer from './PlansContainer';

export default function PlansPage() {
    return (
        <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center', color: '#A79E98', fontFamily: '"Space Mono",monospace', letterSpacing: '.2em', textTransform: 'uppercase', fontSize: '10px' }}>Loading plans…</div>}>
            <PlansContainer />
        </Suspense>
    );
}
