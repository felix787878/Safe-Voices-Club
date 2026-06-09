"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HARASSMENT_TYPES = [
  {
    title: "Pelecehan Verbal",
    definition:
      "Pelecehan verbal adalah bentuk pelecehan yang melibatkan kata-kata, komentar, atau suara yang menyinggung, mengancam, atau merendahkan.",
    examples: "Catcalling, komentar tentang tubuh, siulan, ejekan seksual.",
    action:
      "Catat kejadian, cari tempat aman, laporkan ke pihak berwenang atau platform terkait.",
  },
  {
    title: "Pelecehan Fisik",
    definition:
      "Pelecehan fisik melibatkan kontak fisik yang tidak diinginkan atau perilaku yang mengancam keselamatan fisik.",
    examples: "Sentuhan tanpa izin, penghadangan jalan, pengejaran.",
    action:
      "Jauhi pelaku jika memungkinkan, minta bantuan orang di sekitar, hubungi 110 atau 112.",
  },
  {
    title: "Pelecehan Digital / Online",
    definition:
      "Pelecehan yang terjadi melalui media digital termasuk media sosial, pesan, atau platform online.",
    examples: "Revenge porn, stalking online, pengiriman konten seksual tanpa persetujuan.",
    action:
      "Simpan bukti (screenshot), laporkan ke platform, hubungi Kominfo atau lembaga terkait.",
  },
  {
    title: "di Tempat Kerja",
    definition:
      "Pelecehan di lingkungan kerja oleh atasan, rekan kerja, atau pihak terkait pekerjaan.",
    examples: "Komentar seksual, ancaman karier, diskriminasi gender.",
    action:
      "Dokumentasikan kejadian. Anda dilindungi UU No. 12/2022 tentang Kekerasan Seksual.",
  },
  {
    title: "di Transportasi Umum",
    definition:
      "Pelecehan yang terjadi di kereta, bus, angkot, atau moda transportasi publik lainnya.",
    examples: "Pegangan tidak senonoh, eksibisionisme, penguntitan di stasiun.",
    action:
      "Gunakan tombol darurat KRL/MRT, laporkan ke petugas keamanan, atau hubungi polisi.",
  },
];

const BYSTANDER_5D = [
  {
    title: "Direct",
    icon: "👋",
    desc: "Langsung interveni dengan aman. Katakan dengan tegas bahwa perilaku tersebut tidak pantas.",
  },
  {
    title: "Distract",
    icon: "🔄",
    desc: "Alihkan perhatian pelaku atau korban. Tanyakan arah atau buat gangguan untuk menghentikan kejadian.",
  },
  {
    title: "Delegate",
    icon: "🤝",
    desc: "Minta bantuan orang lain — petugas keamanan, staf, atau orang yang lebih berwenang.",
  },
  {
    title: "Document",
    icon: "📱",
    desc: "Rekam atau catat kejadian sebagai bukti. Jangan mengorbankan keselamatan Anda sendiri.",
  },
  {
    title: "Delay",
    icon: "⏳",
    desc: "Setelah kejadian, dekati korban dan tanyakan apakah mereka butuh bantuan atau pendampingan.",
  },
];

const HELP_CENTERS = [
  {
    name: "SAPA 129 — Kementerian PPPA",
    desc: "Hotline kekerasan terhadap perempuan dan anak",
    phone: "129",
  },
  {
    name: "Komnas Perempuan",
    desc: "Pelaporan kasus kekerasan berbasis gender",
    phone: "0213903963",
  },
  {
    name: "LBH APIK Jakarta",
    desc: "Bantuan hukum gratis untuk perempuan",
    phone: "02187797289",
  },
  {
    name: "Into The Light Indonesia",
    desc: "Konseling kesehatan mental dan pencegahan bunuh diri",
    phone: "119",
  },
  {
    name: "Yayasan Pulih",
    desc: "Konseling trauma",
    phone: "02178842580",
  },
  {
    name: "Polisi",
    desc: "Layanan kepolisian darurat",
    phone: "110",
  },
  {
    name: "Ambulans / Darurat Nasional",
    desc: "Layanan darurat nasional",
    phone: "112",
  },
];

export default function InfoPage() {
  return (
    <div className="px-4 py-4">
      <h1 className="text-xl font-bold text-primary mb-4">Info & Bantuan</h1>

      <Tabs defaultValue="kenali">
        <TabsList>
          <TabsTrigger value="kenali">Kenali Pelecehan</TabsTrigger>
          <TabsTrigger value="bantuan">Pusat Bantuan</TabsTrigger>
        </TabsList>

        <TabsContent value="kenali">
          <Accordion type="single" collapsible className="mb-6">
            {HARASSMENT_TYPES.map((item) => (
              <AccordionItem key={item.title} value={item.title}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    <strong>Definisi:</strong> {item.definition}
                  </p>
                  <p className="mb-2">
                    <strong>Contoh:</strong> {item.examples}
                  </p>
                  <p>
                    <strong>Yang bisa dilakukan:</strong> {item.action}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <h2 className="text-lg font-semibold mb-3">
            Panduan Bystander — Metode 5D
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 snap-x">
            {BYSTANDER_5D.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.02 }}
                className="snap-start shrink-0 w-48 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="text-3xl mb-2 block">{item.icon}</span>
                <p className="font-semibold mb-1">{item.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bantuan">
          <div className="grid gap-3">
            {HELP_CENTERS.map((center) => (
              <Card key={center.name}>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-1">{center.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {center.desc}
                  </p>
                  <a
                    href={`tel:${center.phone}`}
                    className="text-primary font-medium text-sm flex items-center gap-1 mb-3"
                  >
                    <Phone className="h-4 w-4" />
                    {center.phone}
                  </a>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      window.location.href = `tel:${center.phone}`;
                    }}
                  >
                    Hubungi Sekarang
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
