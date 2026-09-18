export const S = `
  .pdb-wrap { padding: clamp(16px, 2.4vh, 24px) 0 0; }

  .pdb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    font-size: 12.5px;
    line-height: 1;
    color: #A1A1AA;
  }
  .pdb-item { display: inline-flex; align-items: center; }

  .pdb-link {
    color: inherit;
    text-decoration: none;
    transition: color .2s ease;
  }
  .pdb-link:hover { color: #111118; }
  .pdb-link.is-current { color: #52525B; }

  .pdb-sep { margin: 0 8px; color: #D4D4D8; }
`;
