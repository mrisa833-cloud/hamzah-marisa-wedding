(() => {
  const cfg = window.WEDDING_CONFIG;
  const $ = (s) => document.querySelector(s);
  const opening = $("#opening");
  const guestParam = new URLSearchParams(location.search).get("to");
  if (guestParam) $("#guestName").textContent = guestParam.replace(/\+/g, " ").slice(0, 80);

  $("#openInvitation").addEventListener("click", () => {
    opening.classList.add("is-hidden");
    document.body.classList.remove("locked");
    setTimeout(() => opening.remove(), 850);
  });
  document.body.classList.add("locked");

  // Countdown uses the configured local WIB timestamp.
  function updateCountdown() {
    const remaining = new Date(cfg.countdownTarget).getTime() - Date.now();
    if (remaining <= 0) {
      ["days","hours","minutes","seconds"].forEach(id => $("#"+id).textContent = "00");
      return;
    }
    const d = Math.floor(remaining / 86400000);
    const h = Math.floor(remaining % 86400000 / 3600000);
    const m = Math.floor(remaining % 3600000 / 60000);
    const s = Math.floor(remaining % 60000 / 1000);
    $("#days").textContent = String(d).padStart(3, "0");
    $("#hours").textContent = String(h).padStart(2, "0");
    $("#minutes").textContent = String(m).padStart(2, "0");
    $("#seconds").textContent = String(s).padStart(2, "0");
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  // Calendar links: UTC timestamps represent the supplied WIB event times.
  document.querySelectorAll(".calendar-link").forEach(link => {
    const event = cfg.events[link.dataset.event];
    const params = new URLSearchParams({
      action: "TEMPLATE", text: event.title, dates: `${event.start}/${event.end}`,
      details: event.description, location: `${cfg.venue.name}, ${cfg.venue.address}`
    });
    link.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
  });
  $("#mapsLink").href = cfg.venue.mapsUrl;
  $("#venueAddress").textContent = cfg.venue.address;
  $("#giftAddress").textContent = cfg.gift.address;
  $("#giftNumber").textContent = cfg.gift.number;
  $("#giftMapsLink").href = cfg.gift.mapsUrl;
  document.querySelectorAll(".copy-button").forEach(button => {
    if (button.dataset.copy === "082158874278") button.dataset.copy = cfg.gift.number;
  });

  // Progressive reveal.
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  // Wishes are rendered with textContent to prevent HTML injection.
  function renderWishes(items) {
    const list = $("#wishesList");
    list.replaceChildren();
    if (!items || !items.length) {
      const empty = document.createElement("p");
      empty.className = "empty-wishes";
      empty.textContent = "Jadilah yang pertama mengirimkan doa untuk kami.";
      list.append(empty); return;
    }
    items.slice().reverse().forEach(item => {
      if (!item.message) return;
      const card = document.createElement("article"); card.className = "wish-card";
      const name = document.createElement("h3"); name.textContent = item.name || "Tamu Undangan";
      const message = document.createElement("p"); message.textContent = `“${item.message}”`;
      card.append(name, message); list.append(card);
    });
  }
  function loadWishes() {
    if (!cfg.rsvpEndpoint) {
      renderWishes([]);
      return;
    }
    const callback = "weddingWishes_" + Date.now();
    const script = document.createElement("script");
    const timeout = setTimeout(() => { cleanup(); }, 10000);
    function cleanup() { clearTimeout(timeout); try { delete window[callback]; } catch (_) {} script.remove(); }
    window[callback] = (data) => { renderWishes(data && data.wishes ? data.wishes : []); cleanup(); };
    script.onerror = () => { cleanup(); $("#wishesList").textContent = "Ucapan belum dapat dimuat. Silakan coba kembali nanti."; };
    script.src = `${cfg.rsvpEndpoint}?action=wishes&callback=${callback}&_=${Date.now()}`;
    document.body.append(script);
  }
  loadWishes();
  const attendanceSelect = document.querySelector('[name="attendance"]');
  const guestCount = $("#guestCount");
  function syncGuestCount() {
    const attending = attendanceSelect.value === "Hadir";
    guestCount.disabled = !attending;
    guestCount.required = attending;
    if (!attending) guestCount.value = "1";
  }
  attendanceSelect.addEventListener("change", syncGuestCount);
  syncGuestCount();
  if (cfg.rsvpEndpoint) setInterval(loadWishes, cfg.refreshWishesMs || 20000);

  $("#rsvpForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = $("#formStatus");
    if (!cfg.rsvpEndpoint) {
      status.textContent = "RSVP belum aktif. Admin perlu memasang URL Google Apps Script di config.js.";
      return;
    }
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.guests = data.attendance === "Hadir" ? Number(data.guests || 1) : 0;
    data.action = "rsvp";
    const submit = form.querySelector('button[type="submit"]');
    submit.disabled = true; status.textContent = "Mengirim konfirmasi...";
    try {
      // Apps Script endpoint accepts URL-encoded POST. no-cors avoids preflight;
      // success is confirmed by the follow-up wishes refresh, not by opaque response.
      await fetch(cfg.rsvpEndpoint, {
        method: "POST", mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body: new URLSearchParams(data).toString()
      });
      status.textContent = "Terima kasih! Permintaan konfirmasi telah dikirim. Ucapan akan muncul setelah tersinkronisasi dengan Google Sheets.";
      form.reset(); $("#guestCount").value = "1"; syncGuestCount();
      setTimeout(loadWishes, 2500);
    } catch (err) {
      status.textContent = "Pengiriman belum berhasil. Periksa koneksi internet dan coba kembali.";
    } finally { submit.disabled = false; }
  });

  document.querySelectorAll(".copy-button").forEach(button => {
    button.addEventListener("click", async () => {
      const original = button.textContent;
      try { await navigator.clipboard.writeText(button.dataset.copy); button.textContent = "Tersalin ✓"; }
      catch (_) { button.textContent = "Tidak dapat menyalin"; }
      setTimeout(() => button.textContent = original, 1800);
    });
  });

  // Optional music asset. Browsers require a user gesture before playback.
  const audio = $("#backgroundMusic"), musicButton = $("#musicButton");
  if (cfg.musicFile) audio.src = cfg.musicFile;
  else musicButton.hidden = true;
  musicButton.addEventListener("click", async () => {
    if (audio.paused) { try { await audio.play(); musicButton.classList.add("playing"); } catch (_) {} }
    else { audio.pause(); musicButton.classList.remove("playing"); }
  });
})();
