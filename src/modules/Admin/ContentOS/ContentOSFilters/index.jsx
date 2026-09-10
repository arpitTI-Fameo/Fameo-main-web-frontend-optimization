import { S } from '../styles';
import { STATUS_CONFIG } from '../constants';

export default function ContentOSFilters({
    filter,
    setFilter,
    visibleModules,
    selected,
    setSelected,
    canPublish,
    bulkAction
}) {
    return (
        <div style={S.filters}>
            <input style={S.search} placeholder="Search topics…" value={filter.search}
                onChange={e => setFilter(f => ({ ...f, search: e.target.value }))} />
            <select style={S.select} value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}>
                <option value="all">All Status</option>
                {["published", "draft", "review", "archived"].map(s =>
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                )}
            </select>
            <select style={S.select} value={filter.module} onChange={e => setFilter(f => ({ ...f, module: e.target.value }))}>
                <option value="all">All Modules</option>
                {visibleModules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>

            {/* Bulk actions — only for roles that can edit */}
            {selected.size > 0 && canPublish && (
                <div style={S.bulkBar}>
                    <span style={S.bulkCount}>{selected.size} selected</span>
                    <button style={S.bulkBtn} onClick={() => bulkAction("published")}>Publish all</button>
                    <button style={{ ...S.bulkBtn, color: "#d49090" }} onClick={() => bulkAction("archived")}>Archive all</button>
                    <button style={{ ...S.bulkBtn, color: "#aaa" }} onClick={() => setSelected(new Set())}>Clear</button>
                </div>
            )}
        </div>
    );
}
