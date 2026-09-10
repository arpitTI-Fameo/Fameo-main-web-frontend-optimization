import { S } from '../styles';

export default function ContactsFilters({ search, setSearch, roleFilter, setRole }) {
    return (
        <div style={S.filters}>
            <input style={S.search} placeholder="Search by name or email…"
                value={search} onChange={e => setSearch(e.target.value)} />
            <select style={S.select} value={roleFilter} onChange={e => setRole(e.target.value)}>
                <option value="all">All Roles</option>
                <option value="learner">Learner</option>
                <option value="creator">Creator</option>
                <option value="brand">Brand</option>
            </select>
        </div>
    );
}
