import type { ReactNode } from "react";
import Image from "next/image";
import favicon from "@/app/favicon.png";
import "./user-guide.css";

function NavIcon({ type, active }: { type: "home" | "map" | "mic" | "info"; active?: boolean }) {
  const cls = `guide-ni${active ? " on" : ""}`;
  const stroke = "currentColor";
  const sw = 2;

  if (type === "home") {
    return (
      <div className={cls}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
        Beranda
      </div>
    );
  }
  if (type === "map") {
    return (
      <div className={cls}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <polygon points="1,6 1,22 8,18 16,22 23,18 23,2 16,6 8,2" />
          <line x1="8" y1="2" x2="8" y2="18" />
          <line x1="16" y1="6" x2="16" y2="22" />
        </svg>
        Peta
      </div>
    );
  }
  if (type === "mic") {
    return (
      <div className={cls}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
          <path d="M19 10v2a7 7 0 01-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
        Rekaman
      </div>
    );
  }
  return (
    <div className={cls}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      Info
    </div>
  );
}

function Callout({
  side,
  top,
  label,
  letter,
}: {
  side: "left" | "right";
  top: number;
  label: string;
  letter: string;
}) {
  const style = side === "left" ? { left: 0, top } : { right: 0, top };
  return (
    <div className={`guide-co${side === "right" ? " r" : ""}`} style={style}>
      <div className={`guide-co-txt${side === "left" ? " r" : ""}`}>{label}</div>
      <div className="guide-co-n">{letter}</div>
      <div className="guide-co-line" />
    </div>
  );
}

function LegendItem({ letter, children }: { letter: string; children: ReactNode }) {
  return (
    <div className="guide-li">
      <div className="guide-li-n">{letter}</div>
      <div className="guide-li-t">{children}</div>
    </div>
  );
}

const WAVEFORM_HEIGHTS = [
  [8, 15, 6, 19, 10, 17, 7, 13, 20, 8, 16, 9, 18, 11, 6, 14, 9, 17, 7, 12],
  [12, 6, 18, 8, 14, 16, 9, 11, 20, 7, 13, 17, 5, 15, 8, 11, 16, 9, 14, 7],
];

function Waveform({ heights }: { heights: number[] }) {
  return (
    <div className="guide-wf">
      {heights.map((h, i) => (
        <div key={i} className="guide-wb" style={{ height: h }} />
      ))}
    </div>
  );
}

export function UserGuidePoster() {
  return (
    <div className="guide-poster">
      <div className="guide-header">
        <div className="guide-logo">
          <Image src={favicon} alt="" width={36} height={36} className="guide-logo-img" />
        </div>
        <div>
          <h1>Safe Voices Club</h1>
          <p>Panduan Lengkap Penggunaan Aplikasi Keselamatan Pribadi</p>
        </div>
      </div>

      <div className="guide-steps">
        <div className="guide-step">
          <div className="guide-step-n">1</div>
          <h3>Pasang &amp; Setup Kontak</h3>
          <p>Tambahkan 1–3 nomor WhatsApp kontak darurat terpercaya.</p>
        </div>
        <div className="guide-step">
          <div className="guide-step-n">2</div>
          <h3>Pasang di Homescreen</h3>
          <p>Bisa ketuk &quot;Pasang Aplikasi&quot; saat muncul banner. Akses dari homescreen.</p>
        </div>
        <div className="guide-step">
          <div className="guide-step-n">3</div>
          <h3>Ketuk 3× atau Goyangkan HP</h3>
          <p>Jalankan aksi darurat dengan ketuk PANIK? 3 kali atau goyangkan HP.</p>
        </div>
        <div className="guide-step">
          <div className="guide-step-n">4</div>
          <h3>Konfirmasi 1 Ketukan di Dialer</h3>
          <p>Dialer 112 terbuka otomatis. Tekan tombol hijau sekali untuk terhubung ke layanan darurat.</p>
        </div>
      </div>

      <div className="guide-mockups">
        <div className="guide-mockups-title">Tampilan Layar &amp; Petunjuk Fitur</div>
        <div className="guide-mockups-grid">
          {/* Screen 1 */}
          <div className="guide-m-item">
            <div className="guide-m-label">① Halaman Utama</div>
            <div className="guide-p-wrap">
              <div className="guide-phone">
                <div className="guide-screen">
                  <div className="guide-sbar">
                    <span>10:32 PM</span>
                    <span>4G 🔋 48</span>
                  </div>
                  <div style={{ background: "#111", padding: "10px 10px 0" }}>
                    <div className="guide-s1-head-lbl">Kontak Darurat</div>
                    <div className="guide-cc">
                      <div className="guide-av" style={{ background: "#29B6D8" }}>O</div>
                      <div className="guide-ci">
                        <div className="cn">Opung</div>
                        <div className="cp">0859-4736-0230</div>
                      </div>
                      <div className="guide-wa-circ">💬</div>
                      <div className="guide-edit-ico">✏️</div>
                      <div className="guide-del-ico">🗑</div>
                    </div>
                    <div className="guide-add-c">＋ Tambah Kontak</div>
                    <div className="guide-pz">
                      <div className="guide-pz-big">PANIK?</div>
                      <div className="guide-pz-sub">Ketuk 3x Cepat atau Goyangkan HP</div>
                      <div className="guide-pz-rings">
                        <div className="guide-ring guide-ring1" />
                        <div className="guide-ring guide-ring2" />
                        <div className="guide-ring guide-ring3" />
                        <div className="guide-pz-finger">👆</div>
                      </div>
                      <div className="guide-pz-dots">
                        <div className="guide-pdot" />
                        <div className="guide-pdot on" />
                        <div className="guide-pdot" />
                      </div>
                    </div>
                  </div>
                  <div className="guide-bnav">
                    <NavIcon type="home" active />
                    <NavIcon type="map" />
                    <NavIcon type="mic" />
                    <NavIcon type="info" />
                  </div>
                </div>
              </div>
              <Callout side="left" top={100} letter="A" label="Kartu kontak darurat + tombol WA hijau" />
              <Callout side="left" top={156} letter="B" label="Tambah kontak baru (maks 3)" />
              <Callout side="right" top={210} letter="C" label="Zona PANIK, ketuk 3× cepat" />
            </div>
            <div className="guide-legend">
              <LegendItem letter="A">
                <strong>Kartu Kontak:</strong> Nama, nomor, tombol WA hijau untuk kirim pesan langsung, ikon edit ✏️ dan hapus 🗑.
              </LegendItem>
              <LegendItem letter="B">
                <strong>+ Tambah Kontak:</strong> Simpan hingga 3 kontak. Semua tersimpan di perangkat, tidak ke server.
              </LegendItem>
              <LegendItem letter="C">
                <strong>Zona Panik:</strong> Area ungu besar. Ketuk 3× dalam 1,5 detik atau goyangkan HP.
              </LegendItem>
            </div>
          </div>

          {/* Screen 2 */}
          <div className="guide-m-item">
            <div className="guide-m-label">② Layar Darurat</div>
            <div className="guide-p-wrap">
              <div className="guide-phone">
                <div className="guide-screen">
                  <div className="guide-ps-bg">
                    <div className="guide-sbar-red">
                      <span>10:32 PM</span>
                      <span>4G 🔋 48</span>
                    </div>
                    <div className="guide-ps-head">
                      <div className="guide-ps-title">🚨 DARURAT AKTIF</div>
                      <div className="guide-ps-cd">3</div>
                      <div className="guide-ps-sub">Membuka dialer 112 dalam 3 detik...</div>
                    </div>
                    <div className="guide-cb">
                      <div className="guide-cb-ico r">📞</div>
                      <div>
                        <div className="guide-cb-num">Hubungi 112</div>
                        <div className="guide-cb-lbl">Darurat Nasional</div>
                      </div>
                    </div>
                    <div className="guide-cb">
                      <div className="guide-cb-ico b">📞</div>
                      <div>
                        <div className="guide-cb-num">Hubungi 110</div>
                        <div className="guide-cb-lbl">Polisi</div>
                      </div>
                    </div>
                    <div className="guide-sc-grid">
                      <div className="guide-sc"><div className="guide-sc-ico">📞</div><div className="guide-sc-l">Panggilan</div><div className="guide-sc-s">⏳ Dialer</div></div>
                      <div className="guide-sc"><div className="guide-sc-ico">📍</div><div className="guide-sc-l">Lokasi</div><div className="guide-sc-s">✓ Tersimpan</div></div>
                      <div className="guide-sc"><div className="guide-sc-ico">💬</div><div className="guide-sc-l">WhatsApp</div><div className="guide-sc-s">⏳ Mengirim</div></div>
                      <div className="guide-sc"><div className="guide-sc-ico">🎙️</div><div className="guide-sc-l">Rekaman</div><div className="guide-sc-s">● Merekam</div></div>
                    </div>
                    <div className="guide-wa-sec">
                      <div className="guide-wa-lbl">Kirim ke Kontak Darurat:</div>
                      <div className="guide-wa-btn">💬 Opung (+62 859-4736-0230)</div>
                    </div>
                    <div className="guide-safe-btn">✓ SAYA SUDAH AMAN</div>
                  </div>
                </div>
              </div>
              <Callout side="left" top={72} letter="A" label="Countdown 3 detik lalu dialer terbuka" />
              <Callout side="right" top={136} letter="B" label="Butuh 1 ketukan konfirmasi di dialer HP" />
              <Callout side="right" top={175} letter="C" label="Backup: polisi langsung (110)" />
              <Callout side="right" top={340} letter="D" label="Ketuk saat situasi sudah aman" />
            </div>
            <div className="guide-legend">
              <LegendItem letter="A"><strong>Countdown 112:</strong> 3 detik hitung mundur, lalu dialer terbuka dengan 112 sudah terisi otomatis.</LegendItem>
              <LegendItem letter="B"><strong>Konfirmasi di Dialer:</strong> Browser wajib meminta konfirmasi. Ketuk tombol hijau ☎ di dialer.</LegendItem>
              <LegendItem letter="C"><strong>Tombol 110:</strong> Alternatif langsung ke polisi jika 112 tidak tersambung.</LegendItem>
              <LegendItem letter="D"><strong>Saya Sudah Aman:</strong> Menghentikan rekaman dan menandai situasi selesai.</LegendItem>
            </div>
          </div>

          {/* Screen 3 */}
          <div className="guide-m-item">
            <div className="guide-m-label">③ Peta Komunitas</div>
            <div className="guide-p-wrap">
              <div className="guide-phone">
                <div className="guide-screen">
                  <div className="guide-sbar-pur">
                    <span>10:32 PM</span>
                    <span>4G 🔋 48</span>
                  </div>
                  <div className="guide-map-area">
                    <div className="guide-mr" style={{ top: 32, left: 0, right: 0, height: 7, opacity: 0.7 }} />
                    <div className="guide-mr" style={{ top: 78, left: 0, right: 0, height: 5, opacity: 0.6 }} />
                    <div className="guide-mr" style={{ top: 132, left: 0, right: 0, height: 8, opacity: 0.65 }} />
                    <div className="guide-mr" style={{ top: 188, left: 0, right: 0, height: 5, opacity: 0.5 }} />
                    <div className="guide-mr" style={{ top: 244, left: 0, right: 0, height: 7, opacity: 0.55 }} />
                    <div className="guide-mr" style={{ top: 296, left: 0, right: 0, height: 5, opacity: 0.4 }} />
                    <div className="guide-mr" style={{ top: 0, left: 36, bottom: 0, width: 6, opacity: 0.65 }} />
                    <div className="guide-mr" style={{ top: 0, left: 88, bottom: 0, width: 8, opacity: 0.65 }} />
                    <div className="guide-mr" style={{ top: 0, left: 136, bottom: 0, width: 5, opacity: 0.5 }} />
                    <div className="guide-mr" style={{ top: 0, left: 162, bottom: 0, width: 7, opacity: 0.4 }} />
                    <div className="guide-pm" style={{ top: 26, left: 46 }} />
                    <div className="guide-pm" style={{ top: 102, left: 22 }} />
                    <div className="guide-pm ora" style={{ top: 180, left: 52 }} />
                    <div className="guide-pm ora" style={{ top: 138, left: 148 }} />
                    <div className="guide-report-fb">＋ Laporkan Kejadian</div>
                  </div>
                  <div className="guide-bnav">
                    <NavIcon type="home" />
                    <NavIcon type="map" active />
                    <NavIcon type="mic" />
                    <NavIcon type="info" />
                  </div>
                </div>
              </div>
              <Callout side="left" top={56} letter="A" label="Laporan darurat aktif (24 jam)" />
              <Callout side="right" top={160} letter="B" label="Laporan manual dari pengguna (oranye)" />
              <Callout side="right" top={288} letter="C" label="Tandai lokasi kejadian lampau" />
            </div>
            <div className="guide-legend">
              <LegendItem letter="A"><strong>Marker Merah:</strong> Laporan panik aktif dari pengguna lain. Muncul selama 24 jam, lalu otomatis hilang.</LegendItem>
              <LegendItem letter="B"><strong>Marker Oranye:</strong> Laporan manual pengguna (catcalling, stalking, dll).</LegendItem>
              <LegendItem letter="C"><strong>+ Laporkan:</strong> Tandai lokasi kejadian pelecehan yang sudah lewat agar pengguna lain bisa waspada di area tersebut.</LegendItem>
            </div>
          </div>

          {/* Screen 4 */}
          <div className="guide-m-item">
            <div className="guide-m-label">④ Rekaman Bukti</div>
            <div className="guide-p-wrap">
              <div className="guide-phone">
                <div className="guide-screen">
                  <div className="guide-sbar">
                    <span>10:32 PM</span>
                    <span>4G 🔋 48</span>
                  </div>
                  <div style={{ background: "#111", padding: "10px 10px 0" }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#9B59B6", padding: "6px 0 10px" }}>Rekaman Bukti</div>
                    <div className="guide-rec-card">
                      <div className="guide-rec-date">Selasa, 10 Jun 2025 pukul 22.34</div>
                      <div className="guide-rec-meta">2 menit 0 detik · 480 KB</div>
                      <Waveform heights={WAVEFORM_HEIGHTS[0]} />
                      <div className="guide-rec-acts">
                        <div className="guide-rec-play">▷ Putar</div>
                        <div className="guide-rec-dl">⬇</div>
                        <div className="guide-rec-del">🗑</div>
                      </div>
                    </div>
                    <div className="guide-rec-card" style={{ marginBottom: 0 }}>
                      <div className="guide-rec-date">Senin, 9 Jun 2025 pukul 19.15</div>
                      <div className="guide-rec-meta">1 menit 47 detik</div>
                      <Waveform heights={WAVEFORM_HEIGHTS[1]} />
                      <div className="guide-rec-acts">
                        <div className="guide-rec-play">▷ Putar</div>
                        <div className="guide-rec-dl">⬇</div>
                        <div className="guide-rec-del">🗑</div>
                      </div>
                    </div>
                  </div>
                  <div className="guide-bnav">
                    <NavIcon type="home" />
                    <NavIcon type="map" />
                    <NavIcon type="mic" active />
                    <NavIcon type="info" />
                  </div>
                </div>
              </div>
              <Callout side="left" top={62} letter="A" label="Rekaman otomatis saat panik (2 menit)" />
              <Callout side="left" top={120} letter="B" label="Waveform gelombang suara rekaman" />
              <Callout side="left" top={230} letter="D" label="Rekaman kedua dari sesi lain" />
              <Callout side="right" top={155} letter="C" label="Unduh sebagai file bukti (.webm)" />
            </div>
            <div className="guide-legend">
              <LegendItem letter="A"><strong>Rekaman Otomatis:</strong> Merekam 2 menit audio saat tombol panik aktif.</LegendItem>
              <LegendItem letter="B"><strong>Waveform:</strong> Visualisasi gelombang suara. Ketuk ▶ Putar untuk dengarkan ulang sebelum melapor.</LegendItem>
              <LegendItem letter="C"><strong>⬇ Unduh:</strong> Simpan rekaman ke HP kamu.</LegendItem>
              <LegendItem letter="D"><strong>Riwayat Sesi:</strong> Semua rekaman panik tersimpan dengan tanggal dan durasi. Kelola dari halaman ini.</LegendItem>
            </div>
          </div>
        </div>
      </div>

      <div className="guide-emg">
        <h2>Nomor Darurat</h2>
        <div className="guide-ng">
          <div className="guide-nc">
            <div className="n">112</div>
            <div className="nm">Darurat Nasional</div>
            <div className="tp">Polisi · Ambulans · PMK · 24 jam</div>
          </div>
          <div className="guide-nc">
            <div className="n">110</div>
            <div className="nm">Polisi</div>
            <div className="tp">Langsung ke Polri · 24 jam</div>
          </div>
          <div className="guide-nc">
            <div className="n">129</div>
            <div className="nm">SAPA (PPPA)</div>
            <div className="tp">Kekerasan perempuan &amp; anak · 24 jam</div>
          </div>
          <div className="guide-nc">
            <div className="n sm">021-3903963</div>
            <div className="nm">Komnas Perempuan</div>
            <div className="tp">Sen–Jum 08.00–16.00</div>
          </div>
        </div>
      </div>
    </div>
  );
}
