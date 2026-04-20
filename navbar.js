function renderNavbar(page) {
    const username = localStorage.getItem('iqUsername') || 'Player';

    // Pages that hide Play button
    const hidePlay = ['profile', 'dashboard'];
    // Pages that show Logout
    const showLogout = ['profile', 'dashboard', 'leaderboard', 'game-history', 'user-profile'];

    const showPlayBtn = !hidePlay.includes(page);

    const navHTML = `
        <nav id="main-nav">
            <div class="nav-logo" onclick="window.location.href='dashboard.html'">
                ⚡ Incentive<span>Quiz</span>
            </div>
            <div class="nav-links">
                <a href="dashboard.html" class="${page === 'dashboard' ? 'nav-active' : ''}">Dashboard</a>
                <a href="leaderboard.html" class="${page === 'leaderboard' ? 'nav-active' : ''}">Leaderboard</a>
                <a href="profile.html" class="${page === 'profile' ? 'nav-active' : ''}">Profile</a>
                <div class="nav-avatar" onclick="window.location.href='profile.html'">
                    ${username[0].toUpperCase()}
                </div>
                ${showPlayBtn ? `<button class="nav-play-btn" onclick="window.location.href='game.html'">⚡ Play</button>` : ''}
                <button class="nav-logout-btn" onclick="logoutUser()">Logout</button>
            </div>
        </nav>
    `;

    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function logoutUser() {
    if (typeof auth !== 'undefined') {
        auth.signOut().then(() => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    } else {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}