import React from "react";
import "../styles/CorrectionsPanel.css";

export default function CorrectionsPanel({ data, onClose, onApplyOne, onApplyAll }) {
    if (!data) return null;
    const { corrections, correctedText } = data;

    return (
        <aside className="corrections-panel">
            <header className="panel-header">
                <strong>Grammar Suggestions</strong>
                <button className="close-btn" onClick={onClose}>✕</button>
            </header>

            <div className="panel-body">
                {corrections.length === 0 && <p>No issues found 🎉</p>}
                {corrections.map((e, idx) => (
                    <div key={idx} className="issue">
                        <div className="issue-main">
                            <div className="issue-title">{e.label}</div>
                            <div className="issue-message">{e.reason}</div>
                            <div className="issue-suggestion">{e.suggestion}</div>
                        </div>
                        <div className="issue-actions">
                            <button className="apply-btn" onClick={() => onApplyOne(e.id)}>Apply</button>
                        </div>
                    </div>
                ))}
            </div>

            <footer className="panel-footer">
                <div className="corrected-preview">
                    <div className="label">Full corrected:</div>
                    <div className="text">{correctedText}</div>
                </div>
                <button className="apply-all-btn" onClick={onApplyAll}>Apply all</button>
            </footer>
        </aside>
    );
}
