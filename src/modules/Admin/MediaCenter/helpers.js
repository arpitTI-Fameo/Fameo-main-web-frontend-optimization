// modules/Admin/MediaCenter/helpers.js

export function fmtSize(b) {
    return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${(b / 1024).toFixed(0)} KB`;
}
