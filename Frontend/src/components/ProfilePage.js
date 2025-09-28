import { useNavigate } from "react-router-dom";
import "../styles/ProfilePage.css";

export function ProfilePage({ userName = "DemoUser", userStats = {
    messagesCount: 42, wordsLookedUp: 12, daysActive: 5, studyHours: 8, streak: 3
} }) {
    const navigate = useNavigate();

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h2>👤 {userName}'s Profile</h2>
                <button className="back-button" onClick={() => navigate("/chat")}>← Back to Chat</button>
            </div>
            <div className="profile-stats">
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
            </div>
        </div>
    );
}
