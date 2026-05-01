rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── HELPERS ──────────────────────────────────────────────────────────────
    function isSignedIn() {
      return request.auth != null;
    }

    function isOwner(uid) {
      return isSignedIn() && request.auth.uid == uid;
    }

    function isAdmin() {
      return isSignedIn() && request.auth.token.email == 'dammalapatipranay@gmail.com';
    }

    // Only allow safe user fields to be written (no injecting extra fields)
    function validUserFields() {
      return request.resource.data.keys().hasOnly([
        'username', 'email', 'games', 'wins', 'best',
        'streak', 'categoryStats', 'createdAt'
      ]);
    }

    function validHistoryFields() {
      return request.resource.data.keys().hasOnly([
        'category', 'score', 'won', 'eliminatedAt', 'date', 'createdAt'
      ]);
    }

    function validFriendFields() {
      return request.resource.data.keys().hasOnly([
        'uid', 'username', 'addedAt'
      ]);
    }

    function validFriendRequestFields() {
      return request.resource.data.keys().hasOnly([
        'from', 'to', 'fromName', 'status', 'createdAt'
      ]);
    }

    function validQuestionFields() {
      return request.resource.data.keys().hasOnly([
        'question', 'options', 'answer', 'category', 'difficulty', 'createdAt'
      ]);
    }


    // ── USERS ────────────────────────────────────────────────────────────────
    // /users/{uid}
    //   - Any signed-in user can READ any profile (needed for leaderboard, user-profile)
    //   - Only the owner can CREATE or UPDATE their own document
    //   - Nobody can delete a user document (except admin)
    match /users/{uid} {
      allow read: if isSignedIn();
      allow create: if isOwner(uid) && validUserFields();
      allow update: if (isOwner(uid) && validUserFields()) || isAdmin();
      allow delete: if isAdmin();

      // /users/{uid}/history
      //   - Only owner can read/write their own history
      match /history/{historyId} {
        allow read: if isOwner(uid);
        allow create: if isOwner(uid) && validHistoryFields();
        allow update, delete: if isAdmin();
      }

      // /users/{uid}/friends
      //   - Owner can read their own friends list
      //   - Friends are written when a request is accepted — both sides write
      //     (the acceptor writes their own doc, and also the other user's doc)
      //   - We allow any signed-in user to write a friend entry so that
      //     accept/remove flows work from user-profile.html and profile.html
      //     (both sides get updated in a single operation from the client)
      match /friends/{friendUID} {
        allow read: if isOwner(uid);
        allow write: if isSignedIn() && validFriendFields();
      }
    }


    // ── FRIEND REQUESTS ──────────────────────────────────────────────────────
    // /friendRequests/{reqId}
    //   - Signed-in user can CREATE a request where from == their uid
    //   - The sender or recipient can READ the request
    //   - The recipient can UPDATE status (accept/reject)
    //   - The sender can DELETE (cancel) their own request
    match /friendRequests/{reqId} {
      allow read: if isSignedIn() && (
        resource.data.from == request.auth.uid ||
        resource.data.to   == request.auth.uid
      );
      allow create: if isSignedIn()
        && request.resource.data.from == request.auth.uid
        && request.resource.data.status == 'pending'
        && validFriendRequestFields();
      allow update: if isSignedIn() && (
        // Recipient can accept or reject
        (resource.data.to == request.auth.uid &&
         request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']))
      );
      allow delete: if isSignedIn() && (
        // Sender can cancel, recipient can clean up after reject
        resource.data.from == request.auth.uid ||
        resource.data.to   == request.auth.uid
      );
    }


    // ── QUESTIONS ────────────────────────────────────────────────────────────
    // /questions/{qId}
    //   - Any signed-in user can READ questions (needed to play the game)
    //   - Only admin can CREATE, UPDATE, DELETE questions
    match /questions/{qId} {
      allow read: if isSignedIn();
      allow create: if isAdmin() && validQuestionFields();
      allow update: if isAdmin() && validQuestionFields();
      allow delete: if isAdmin();
    }


    // ── DENY EVERYTHING ELSE ─────────────────────────────────────────────────
    match /{document=**} {
      allow read, write: if false;
    }

  }
}
