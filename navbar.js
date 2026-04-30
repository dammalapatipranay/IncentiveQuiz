function renderNavbar(page) {
    var username = localStorage.getItem('iqUsername') || 'Player';
    var hidePlay = ['profile', 'dashboard'];
    var showPlay = hidePlay.indexOf(page) === -1;

    var html = '<nav id="main-nav" style="position:fixed;top:0;left:0;right:0;z-index:1000;display:flex;justify-content:space-between;align-items:center;padding:16px 48px;background-color:#0d0d1f;border-bottom:1px solid #1e1e3a;">' +
        '<div onclick="window.location.href=\'dashboard.html\'" style="font-size:22px;font-weight:700;color:#a78bfa;cursor:pointer;letter-spacing:1px;">⚡ Incentive<span style="color:white">Quiz</span></div>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
            '<a href="dashboard.html" style="color:' + (page==='dashboard'?'white':'#aaa') + ';text-decoration:none;font-size:14px;padding:8px 16px;border-radius:8px;background:' + (page==='dashboard'?'#1e1e3a':'transparent') + ';">Dashboard</a>' +
            '<a href="leaderboard.html" style="color:' + (page==='leaderboard'?'white':'#aaa') + ';text-decoration:none;font-size:14px;padding:8px 16px;border-radius:8px;background:' + (page==='leaderboard'?'#1e1e3a':'transparent') + ';">Leaderboard</a>' +
            '<a href="profile.html" style="color:' + (page==='profile'?'white':'#aaa') + ';text-decoration:none;font-size:14px;padding:8px 16px;border-radius:8px;background:' + (page==='profile'?'#1e1e3a':'transparent') + ';">Profile</a>' +
            '<div onclick="window.location.href=\'profile.html\'" style="width:36px;height:36px;background:linear-gradient(135deg,#a78bfa,#7c3aed);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:white;cursor:pointer;margin-left:4px;">' + username[0].toUpperCase() + '</div>' +
            (showPlay ? '<button onclick="window.location.href=\'game.html\'" style="padding:8px 20px;background-color:#a78bfa;color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">⚡ Play</button>' : '') +
            '<button onclick="logoutUser()" style="padding:8px 16px;background:transparent;color:#666;border:1px solid #1e1e3a;border-radius:8px;font-size:13px;cursor:pointer;">Logout</button>' +
        '</div>' +
    '</nav>';

    document.body.insertAdjacentHTML('afterbegin', html);
}

function logoutUser() {
    try {
        auth.signOut().then(function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    } catch(e) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}
