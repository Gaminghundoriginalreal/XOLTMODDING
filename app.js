document.addEventListener("DOMContentLoaded", () => {
    const gamesGrid = document.getElementById("gamesGrid");
    const gamesError = document.getElementById("gamesError");
    const searchInput = document.getElementById("searchInput");
    const yearSpan = document.getElementById("year");

    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    let allGames = [];

    function createGameCard(game) {
        const card = document.createElement("article");
        card.className = "xm-card";

        card.innerHTML = `
            <div class="xm-card-image-wrap">
                <img src="${game.screenshot}" alt="${game.gameName} screenshot" class="xm-card-image" onerror="this.src='https://via.placeholder.com/600x350?text=No+Image';" />
                <div class="xm-card-badge">Game</div>
            </div>
            <div class="xm-card-body">
                <h3 class="xm-card-title" title="${game.gameName}">${game.gameName}</h3>
                <div class="xm-card-meta">
                    <span>${game.platform || "PC"}</span>
                    <span>${game.category || "Modded"}</span>
                </div>
                <div class="xm-card-actions">
                    <a href="${game.download}" class="xm-btn-download" target="_blank" rel="noopener noreferrer">
                        <span>Download</span>
                        ⬇
                    </a>
                </div>
            </div>
        `;

        return card;
    }

    function renderGames(games) {
        gamesGrid.innerHTML = "";

        if (!games || games.length === 0) {
            gamesGrid.innerHTML =
                '<p style="color:#a4a9c8; font-size:0.9rem;">No games found.</p>';
            return;
        }

        games.forEach((game) => {
            const card = createGameCard(game);
            gamesGrid.appendChild(card);
        });
    }

    function filterGames(term) {
        const t = term.toLowerCase();
        const filtered = allGames.filter((game) =>
            game.gameName.toLowerCase().includes(t)
        );
        renderGames(filtered);
    }

    // Fetch games.json
    fetch("games.json", { cache: "no-store" })
        .then((res) => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then((data) => {
            allGames = Array.isArray(data) ? data : [];
            renderGames(allGames);
        })
        .catch((err) => {
            console.error("Error loading games.json:", err);
            gamesError.style.display = "block";
        });

    // Live-Search
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            filterGames(e.target.value);
        });
    }
});
