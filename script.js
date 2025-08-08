document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formTransaksi");
    const daftarTransaksi = document.getElementById("daftarTransaksi");
    const saldoEl = document.getElementById("saldo");

    const kebutuhanEl = document.getElementById("kebutuhan");
    const keinginanEl = document.getElementById("keinginan");
    const tabunganEl = document.getElementById("tabungan");
    const peringatanEl = document.getElementById("peringatan");

    let transaksi = JSON.parse(localStorage.getItem("transaksi")) || [];

    function updateSaldo() {
        let saldo = 0;
        let totalPemasukan = 0;
        let totalPengeluaran = 0;

        transaksi.forEach(t => {
            if (t.tipe === "pemasukan") {
                saldo += t.jumlah;
                totalPemasukan += t.jumlah;
            } else {
                saldo -= t.jumlah;
                totalPengeluaran += t.jumlah;
            }
        });

        saldoEl.textContent = "Rp " + saldo.toLocaleString("id-ID");

        // Hitung alokasi 50/30/20 dari total pemasukan
        kebutuhanEl.textContent = "Kebutuhan: Rp " + Math.floor(totalPemasukan * 0.5).toLocaleString("id-ID");
        keinginanEl.textContent = "Keinginan: Rp " + Math.floor(totalPemasukan * 0.3).toLocaleString("id-ID");
        tabunganEl.textContent = "Tabungan: Rp " + Math.floor(totalPemasukan * 0.2).toLocaleString("id-ID");

        // Tampilkan peringatan jika pengeluaran > pemasukan
        if (totalPengeluaran > totalPemasukan) {
            peringatanEl.style.display = "block";
        } else {
            peringatanEl.style.display = "none";
        }
    }

    function renderTransaksi() {
        daftarTransaksi.innerHTML = "";
        transaksi.forEach((t, index) => {
            const li = document.createElement("li");
            li.textContent = `${t.tipe === "pemasukan" ? "+" : "-"} Rp ${t.jumlah.toLocaleString("id-ID")} - ${t.deskripsi}`;
            li.classList.add(t.tipe);

            // Tombol hapus
            const btnHapus = document.createElement("button");
            btnHapus.textContent = "❌";
            btnHapus.style.marginLeft = "10px";
            btnHapus.onclick = () => {
                transaksi.splice(index, 1);
                localStorage.setItem("transaksi", JSON.stringify(transaksi));
                renderTransaksi();
                updateSaldo();
            };

            li.appendChild(btnHapus);
            daftarTransaksi.appendChild(li);
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const tipe = document.getElementById("tipe").value;
        const jumlah = parseInt(document.getElementById("jumlah").value);
        const deskripsi = document.getElementById("deskripsi").value;

        transaksi.push({ tipe, jumlah, deskripsi });
        localStorage.setItem("transaksi", JSON.stringify(transaksi));

        renderTransaksi();
        updateSaldo();
        form.reset();
    });

    renderTransaksi();
    updateSaldo();
});
