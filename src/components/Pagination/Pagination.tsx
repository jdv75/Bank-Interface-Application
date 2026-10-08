import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.css";

type Props = {
    page: number;
    pageCount: number;
    onPageChange: (page: number) => void;
};

// Page numbers to show, with "…" for skipped ranges: 1 … 4 5 6 … 10
function getVisiblePages(page: number, pageCount: number): (number | "…")[] {
    if (pageCount <= 7) {
        return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);
    const pages: (number | "…")[] = [1];

    if (start > 2) pages.push("…");
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < pageCount - 1) pages.push("…");
    pages.push(pageCount);

    return pages;
}

function Pagination({ page, pageCount, onPageChange }: Props) {
    if (pageCount <= 1) {
        return null;
    }

    return (
        <nav className="pagination" aria-label="Pagination">
            <button
                type="button"
                className="pagination-button"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                <ChevronLeft />
            </button>

            {getVisiblePages(page, pageCount).map((p, i) =>
                p === "…" ? (
                    <span key={`gap-${i}`} className="pagination-gap">…</span>
                ) : (
                    <button
                        key={p}
                        type="button"
                        className="pagination-button"
                        onClick={() => onPageChange(p)}
                        aria-current={p === page ? "page" : undefined}
                    >
                        {p}
                    </button>
                )
            )}

            <button
                type="button"
                className="pagination-button"
                onClick={() => onPageChange(page + 1)}
                disabled={page === pageCount}
                aria-label="Next page"
            >
                <ChevronRight />
            </button>
        </nav>
    );
}

export default Pagination;
