
import {
    INK, GOLD, LINE, MUTED, FAINT, FONT_DISPLAY,
} from '../AccountUI';


export const S = {
    cardHead: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', gap: 10, marginBottom: 14,
    },
    cardTitle: {
        fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase',
        color: MUTED, fontWeight: 600,
    },
    link: { fontSize: 11.5, color: GOLD, fontWeight: 600, textDecoration: 'none' },

    bigAmount: {
        fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600,
        color: INK, lineHeight: 1,
    },
    caption: { fontSize: 11.5, color: FAINT, margin: '5px 0 0' },

    split: {
        display: 'flex', marginTop: 14, paddingTop: 12,
        borderTop: `1px solid ${LINE}`,
    },
    splitCell: { flex: 1, textAlign: 'center' },
    splitVal: { fontSize: 14, fontWeight: 600, color: INK },
    splitLab: { fontSize: 10.5, color: FAINT, marginTop: 3 },

    tier: {
        textAlign: 'center', padding: '9px 6px',
        borderRadius: 8, border: `1px solid ${LINE}`, background: '#fbfaf7',
    },
    tierName: { fontSize: 10.5, fontWeight: 600, color: INK },
    tierVal: { fontSize: 13, fontWeight: 600, color: GOLD, marginTop: 3 },

    actRow: { display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0' },
    actIcon: {
        width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
    },
    actTitle: { display: 'block', fontSize: 13, color: INK },
    actSub: { display: 'block', fontSize: 11, color: FAINT, marginTop: 2 },
    actTime: { display: 'block', fontSize: 10.5, color: FAINT, marginTop: 2 },

    checkRow: { display: 'flex', alignItems: 'center', gap: 11, padding: '10px 0' },
    checkIcon: {
        width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700,
    },
    checkTitle: { display: 'block', fontSize: 13, color: INK },
    checkSub: { display: 'block', fontSize: 11, color: FAINT, marginTop: 1 },

    kv: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    kvLabel: { fontSize: 12, color: MUTED },
    kvValue: { fontSize: 12.5, fontWeight: 600, color: INK },
};
