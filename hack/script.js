const publicKey = `-----BEGIN PUBLIC KEY-----\nYOUR_PUBLIC_KEY_HERE\n-----END PUBLIC KEY-----`;
let voteCounts = { "Candidate A": 0, "Candidate B": 0 };

function hashData(data) {
    return CryptoJS.SHA256(data).toString();
}

function encryptData(data) {
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    return encrypt.encrypt(data);
}

function hasVoted(voterId) {
    return localStorage.getItem(hashData(voterId)) !== null;
}

function updateLiveResults() {
    let storedVotes = Object.values(localStorage);
    voteCounts = { "Candidate A": 0, "Candidate B": 0 };
    storedVotes.forEach(encryptedVote => {
        try {
            let decryptedVote = JSON.parse(encryptedVote); 
            if (voteCounts[decryptedVote.vote] !== undefined) {
                voteCounts[decryptedVote.vote]++;
            }
        } catch (e) {}
    });
    document.getElementById("liveResults").innerText = `Candidate A: ${voteCounts["Candidate A"]} votes, Candidate B: ${voteCounts["Candidate B"]} votes`;
}

function castVote() {
    let voterId = document.getElementById("voterId").value.trim();
    let vote = document.getElementById("vote").value;
    let message = document.getElementById("message");
    let result = document.getElementById("result");

    if (voterId.length !== 16) {
        message.innerText = "Voter ID must be exactly 16 characters!";
        return;
    }

    if (!vote) {
        message.innerText = "You must select a candidate!";
        return;
    }

    if (hasVoted(voterId)) {
        message.innerText = "You have already voted!";
        return;
    }

    if (!confirm("Are you sure you want to submit your vote?")) {
        return;
    }

    let voteData = JSON.stringify({ voterId: hashData(voterId), vote: vote });
    let encryptedVote = encryptData(voteData);

    localStorage.setItem(hashData(voterId), encryptedVote);

    message.innerText = "Vote successfully cast and securely encrypted!";
    result.innerText = "Encrypted Vote Data: " + encryptedVote;
    updateLiveResults();
}

function clearVote() {
    let voterId = document.getElementById("voterId").value.trim();
    let message = document.getElementById("message");
    let result = document.getElementById("result");
    
    if (voterId.length !== 16) {
        message.innerText = "Enter a valid 16-character Voter ID to clear vote!";
        return;
    }
    
    localStorage.removeItem(hashData(voterId));
    message.innerText = "Vote has been cleared.";
    result.innerText = "";
    updateLiveResults();
}

updateLiveResults();
