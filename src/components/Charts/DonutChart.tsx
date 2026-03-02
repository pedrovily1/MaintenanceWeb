import { T } from "@/lib/tokens";

type Segment = { val: number; color: string; label?: string };

type DonutChartProps = {
    segments?: Segment[];
    centerValue?: string | number;
    centerLabel?: string;
    size?: number;
};

export const DonutChart = ({
                               segments = [
                                   { val: 199, color: "#34d399", label: "Operational" },
                                   { val: 55,  color: "#fbbf24", label: "Attention"   },
                                   { val: 54,  color: "#f87171", label: "Critical"    },
                               ],
                               centerValue,
                               centerLabel,
                               size = 180,
                           }: DonutChartProps) => {
    const total = segments.reduce((a, s) => a + s.val, 0);

    // Find the largest segment to show in center when props not provided
    const largest = segments.reduce((a, b) => (b.val > a.val ? b : a), segments[0]);
    const displayValue = centerValue !== undefined ? centerValue : largest?.val ?? 0;
    const displayLabel = centerLabel !== undefined ? centerLabel : largest?.label ?? "";

    const r = 70, cx = 90, cy = 90, sw = 16, gap = 2.8;
    const circ = 2 * Math.PI * r;
    let consumed = 0;

    return (
        <svg width={size} height={size} viewBox="0 0 180 180">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.raised} strokeWidth={sw + 4} />
            {total === 0 ? (
                <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.border} strokeWidth={sw} />
            ) : (
                segments
                    .filter(s => s.val > 0)
                    .map(({ val, color }, i) => {
                        const pct = val / total;
                        const dashLen = pct * circ - gap;
                        const dashOffset = -(consumed * circ + circ / 4);
                        consumed += pct;
                        return (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={r}
                                fill="none"
                                stroke={color}
                                strokeWidth={sw}
                                strokeLinecap="round"
                                strokeDasharray={`${dashLen} ${circ}`}
                                strokeDashoffset={dashOffset}
                                style={{
                                    filter: `drop-shadow(0 0 6px ${color}66)`,
                                    transition: `all 1s ease ${i * 0.15}s`,
                                }}
                            />
                        );
                    })
            )}
            <text
                x={cx}
                y={cy - 7}
                textAnchor="middle"
                fill={T.text}
                fontSize="30"
                fontWeight="800"
                fontFamily="'Poppins',sans-serif"
                style={{ letterSpacing: "-0.03em" }}
            >
                {displayValue}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fill={T.muted} fontSize="11" fontFamily="'Poppins',sans-serif">
                {displayLabel}
            </text>
        </svg>
    );
};