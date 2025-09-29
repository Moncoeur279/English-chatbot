import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

function formatDate(d) {
    const dt = typeof d === "string" ? new Date(d) : d;
    return dt.toLocaleDateString(undefined, { day: "2-digit", month: "2-digit" });
}
function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d;
}
function dateKey(d) {
    const dt = typeof d === "string" ? new Date(d) : d;
    dt.setHours(0, 0, 0, 0);
    return dt.toISOString().slice(0, 10);
}

export function ProfilePage({
    // Thông tin cơ bản
    user = {
        userName: "DemoUser",
        email: "demo@example.com",
        passwordMasked: "hunter2", // chỉ hiển thị để demo; KHÔNG log/ghi plain-text trong thực tế
    },
    // Thống kê tổng quát
    userStats = { messagesCount: 42, wordsLookedUp: 12, daysActive: 5, studyHours: 8, streak: 3 },

    // Lỗi ngữ pháp thường gặp (mock)
    frequentErrors = [
        { rule: "Subject–Verb agreement", count: 9 },
        { rule: "Articles (a/an/the)", count: 7 },
        { rule: "Past tense usage", count: 5 },
        { rule: "Prepositions", count: 4 },
    ],

    // Lịch sử tra từ để nhắc ôn (mock)
    recentLookups = [
        { term: "resilient", lookedAt: daysAgo(1) },
        { term: "artificial", lookedAt: daysAgo(2) },
        { term: "coherence", lookedAt: daysAgo(6) },
        { term: "collocation", lookedAt: daysAgo(10) }, // sẽ bị lọc (quá 7 ngày)
    ],

    // Dữ liệu hoạt động (số message/ ngày) trong 28 ngày gần nhất (mock)
    activityByDate = [
        { date: daysAgo(0), count: 6 },
        { date: daysAgo(1), count: 2 },
        { date: daysAgo(2), count: 0 },
        { date: daysAgo(3), count: 4 },
        { date: daysAgo(4), count: 1 },
        { date: daysAgo(6), count: 3 },
        { date: daysAgo(8), count: 5 },
        { date: daysAgo(9), count: 2 },
        { date: daysAgo(12), count: 1 },
        { date: daysAgo(13), count: 0 },
        { date: daysAgo(14), count: 4 },
        { date: daysAgo(20), count: 2 },
        { date: daysAgo(23), count: 1 },
        { date: daysAgo(27), count: 3 },
    ],
}) {
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);

    // 7 ngày gần đây
    const last7 = useMemo(() => daysAgo(6), []);
    const lookups7d = useMemo(
        () =>
            recentLookups
                .filter((x) => new Date(x.lookedAt) >= last7)
                .sort((a, b) => new Date(b.lookedAt) - new Date(a.lookedAt)),
        [recentLookups, last7]
    );

    // Heatmap 28 ngày
    const last28 = useMemo(() => daysAgo(27), []);
    const heatmap = useMemo(() => {
        // map đếm theo yyyy-mm-dd
        const map = new Map();
        activityByDate.forEach((r) => {
            const k = dateKey(r.date);
            map.set(k, (map.get(k) || 0) + (r.count || 0));
        });
        const cells = [];
        for (let i = 27; i >= 0; i--) {
            const d = daysAgo(i);
            const k = dateKey(d);
            cells.push({ date: d, count: map.get(k) || 0 });
        }
        // xác định mức độ (0..4) theo count
        const max = Math.max(1, ...cells.map((c) => c.count));
        return cells.map((c) => {
            let lvl = 0;
            if (c.count > 0) lvl = 1;
            if (c.count >= Math.ceil(max * 0.25)) lvl = 2;
            if (c.count >= Math.ceil(max * 0.5)) lvl = 3;
            if (c.count >= Math.ceil(max * 0.8)) lvl = 4;
            return { ...c, level: Math.min(lvl, 4) };
        });
    }, [activityByDate, last28]);

    return (
        <div className="profile-page">
            {/* Header */}
            <div className="profile-header">
                <h2>👤 {user.userName}'s Profile</h2>
                <button className="back-button" onClick={() => navigate("/chat")}>
                    ← Back to Chat
                </button>
            </div>

            {/* Thông tin cơ bản */}
            <section className="section card">
                <h3 className="section-title">Basic Info</h3>
                <div className="grid-2">
                    <div>
                        <div className="field"><span className="label">User name:</span> <span>{user.userName}</span></div>
                        <div className="field"><span className="label">Email:</span> <span>{user.email}</span></div>
                    </div>
                    <div>
                        <div className="field">
                            <span className="label">Password:</span>{" "}
                            <span className="mono">
                                {showPass ? user.passwordMasked : "••••••••"}
                            </span>
                            <button className="mini-btn" onClick={() => setShowPass((v) => !v)}>
                                {showPass ? "Hide" : "Show"}
                            </button>
                        </div>
                        <div className="hint">⚠️ Không nên lưu/hiển thị mật khẩu thật dưới dạng plain-text trong sản phẩm production.</div>
                    </div>
                </div>
            </section>

            {/* Thống kê tổng quát */}
            <section className="profile-stats">
                <div className="stat-card">
                    <h3>{userStats.messagesCount}</h3>
                    <p>Messages Sent</p>
                </div>
                <div className="stat-card">
                    <h3>{userStats.wordsLookedUp}</h3>
                    <p>Words Looked Up</p>
                </div>
                <div className="stat-card">
                    <h3>{userStats.daysActive}</h3>
                    <p>Days Active</p>
                </div>
                <div className="stat-card">
                    <h3>{userStats.studyHours}</h3>
                    <p>Study Hours</p>
                </div>
                <div className="stat-card">
                    <h3>{userStats.streak}</h3>
                    <p>Day Streak</p>
                </div>
            </section>

            {/* Lỗi ngữ pháp thường gặp */}
            <section className="section card">
                <h3 className="section-title">Frequent Grammar Errors</h3>
                {frequentErrors?.length ? (
                    <ul className="list">
                        {frequentErrors.slice(0, 5).map((e, i) => (
                            <li key={i} className="list-row">
                                <span>❌ {e.rule}</span>
                                <span className="badge-outline">{e.count}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="muted">No common errors found yet.</p>
                )}
            </section>

            {/* Từ vựng tra gần đây (7 ngày) */}
            <section className="section card">
                <h3 className="section-title">
                    Recent Lookups (7 days)
                </h3>
                {lookups7d?.length ? (
                    <ul className="list">
                        {lookups7d.map((w, i) => (
                            <li key={i} className="list-row">
                                <span className="badge">{w.term}</span>
                                <span className="muted">{formatDate(w.lookedAt)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="muted">No lookups in the last week.</p>
                )}
            </section>

            {/* Biểu đồ ngày hoạt động (28 ngày) */}
            <section className="section card">
                <h3 className="section-title">Activity (Last 28 days)</h3>
                <div className="heatmap" title="Messages per day">
                    {heatmap.map((c, idx) => (
                        <div
                            key={idx}
                            className={`cell level-${c.level}`}
                            title={`${formatDate(c.date)} • ${c.count} message(s)`}
                        />
                    ))}
                </div>
                <div className="heatmap-legend">
                    <span className="muted">Less</span>
                    <div className="cell level-1"></div>
                    <div className="cell level-2"></div>
                    <div className="cell level-3"></div>
                    <div className="cell level-4"></div>
                    <span className="muted">More</span>
                </div>
            </section>
        </div>
    );
}
