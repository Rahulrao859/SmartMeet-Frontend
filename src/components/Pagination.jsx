import React from 'react';

/* ─── IMPLEMENTATION 3.5 — Reusable Pagination Component ──────
 * Usage:
 *   <Pagination
 *     currentPage={page}
 *     totalPages={pages}
 *     onPageChange={(newPage) => setPage(newPage)}
 *   />
 */

const Pagination = ({ currentPage, totalPages, onPageChange, disabled = false }) => {
    if (totalPages <= 1) return null;

    // Build page window: always show first, last, and 2 around current
    const getPages = () => {
        const pages = new Set([1, totalPages]);
        for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
            pages.add(i);
        }
        const sorted = [...pages].sort((a, b) => a - b);
        // Insert ellipsis markers where gaps > 1
        const result = [];
        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…');
            result.push(sorted[i]);
        }
        return result;
    };

    const pages = getPages();

    const btn = (label, page, isActive = false, isDisabled = false) => (
        <button
            key={label}
            onClick={() => !isDisabled && !isActive && onPageChange(page)}
            disabled={isDisabled || disabled}
            style={{
                minWidth:       '36px',
                height:         '36px',
                padding:        '0 10px',
                borderRadius:   '8px',
                border:         isActive ? 'none' : '1.5px solid #e2e8f0',
                background:     isActive ? 'linear-gradient(135deg,#6366f1,#3b82f6)' : '#fff',
                color:          isActive ? '#fff' : (isDisabled ? '#cbd5e1' : '#374151'),
                fontWeight:     isActive ? '700' : '500',
                fontSize:       '14px',
                cursor:         (isDisabled || isActive) ? 'default' : 'pointer',
                transition:     'all 0.15s',
                boxShadow:      isActive ? '0 2px 8px rgba(99,102,241,0.3)' : 'none',
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', justifyContent: 'center', padding: '16px 0' }}>
            {/* Prev */}
            {btn('← Prev', currentPage - 1, false, currentPage <= 1)}

            {/* Page numbers */}
            {pages.map((p, i) =>
                p === '…'
                    ? <span key={`ellipsis-${i}`} style={{ color: '#94a3b8', padding: '0 4px', fontSize: '14px' }}>…</span>
                    : btn(p, p, p === currentPage)
            )}

            {/* Next */}
            {btn('Next →', currentPage + 1, false, currentPage >= totalPages)}
        </div>
    );
};

export default Pagination;
