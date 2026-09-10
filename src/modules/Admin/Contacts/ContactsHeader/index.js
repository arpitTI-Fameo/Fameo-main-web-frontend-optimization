import { S } from '../styles';

export default function ContactsHeader({ user, usersLength }) {
    return (
        <div style={S.header}>
            <div>
                <h1 style={S.heading}>Contacts</h1>
                <p style={S.sub}>
                    {user?.role === "supportAgent"
                        ? "Learner profiles — use for diagnosing support issues."
                        : "All registered users on the platform."}
                </p>
            </div>
            <span style={S.count}>{usersLength} users</span>
        </div>
    );
}
