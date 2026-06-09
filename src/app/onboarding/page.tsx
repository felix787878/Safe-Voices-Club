"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  formatIndonesianPhone,
  getWhatsAppLink,
  isValidIndonesianMobile,
} from "@/lib/phone";
import {
  EmergencyContact,
  saveEmergencyContacts,
  setOnboardingComplete,
} from "@/lib/storage";

interface ContactForm {
  name: string;
  phone: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [contacts, setContacts] = useState<ContactForm[]>([
    { name: "", phone: "" },
  ]);
  const [error, setError] = useState("");
  const [skippedContacts, setSkippedContacts] = useState(false);

  const handleAddContact = () => {
    if (contacts.length < 3) {
      setContacts([...contacts, { name: "", phone: "" }]);
    }
  };

  const updateContact = (index: number, field: keyof ContactForm, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const handleContactsNext = () => {
    const validContacts = contacts.filter(
      (c) => c.name.trim() && isValidIndonesianMobile(c.phone)
    );

    if (validContacts.length === 0) {
      setError("Minimal 1 kontak darurat wajib diisi");
      return;
    }

    const saved: EmergencyContact[] = validContacts.map((c) => ({
      id: crypto.randomUUID(),
      name: c.name.trim(),
      phone: formatIndonesianPhone(c.phone),
    }));

    saveEmergencyContacts(saved);
    setError("");
    setStep(3);
  };

  const handleSkipContacts = () => {
    setSkippedContacts(true);
    setStep(3);
  };

  const handleFinish = () => {
    setOnboardingComplete();
    router.push("/");
  };

  if (step === 1) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
        <div className="text-center max-w-sm">
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.png"
              alt="Safe Voices Club"
              width={120}
              height={120}
              className="rounded-2xl"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Kamu Tidak Sendirian
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2 text-lg">
            Safe Voices Club
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-8">
            Lindungi Dirimu, Jaga Sesama
          </p>
          <Button size="lg" className="w-full" onClick={() => setStep(2)}>
            Mulai Setup
          </Button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen px-4 py-8 bg-background">
        <div className="mx-auto max-w-sm">
          <h1 className="text-2xl font-bold text-primary mb-2">
            Kontak Darurat
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Tambahkan hingga 3 kontak WhatsApp yang akan dihubungi saat mode panik
            diaktifkan.
          </p>

          <div className="space-y-4 mb-6">
            {contacts.map((contact, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
              >
                <p className="text-sm font-medium mb-2">Kontak {i + 1}</p>
                <Input
                  value={contact.name}
                  onChange={(e) => updateContact(i, "name", e.target.value)}
                  placeholder="Nama"
                  className="mb-2"
                />
                <Input
                  value={contact.phone}
                  onChange={(e) => updateContact(i, "phone", e.target.value)}
                  placeholder="08xx xxxx xxxx"
                  type="tel"
                />
                {contact.phone && isValidIndonesianMobile(contact.phone) && (
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    {getWhatsAppLink(formatIndonesianPhone(contact.phone))}
                  </p>
                )}
              </div>
            ))}
          </div>

          {contacts.length < 3 && (
            <Button variant="outline" className="w-full mb-4" onClick={handleAddContact}>
              + Tambah Kontak Lain
            </Button>
          )}

          {error && <p className="text-sm text-danger mb-4">{error}</p>}

          <Button className="w-full mb-3" onClick={handleContactsNext}>
            Lanjut
          </Button>
          <Button variant="ghost" className="w-full" onClick={handleSkipContacts}>
            Lewati (tidak disarankan)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-background">
      <div className="mx-auto max-w-sm">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Izin yang Dibutuhkan
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Aplikasi akan meminta izin saat fitur digunakan pertama kali.
        </p>

        {skippedContacts && (
          <div className="mb-4 rounded-lg bg-orange-50 border border-orange-200 px-4 py-3 text-sm text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300">
            ⚠️ Anda melewati setup kontak. Fitur WhatsApp darurat tidak akan berfungsi.
          </div>
        )}

        <div className="space-y-4 mb-8">
          {[
            {
              icon: "🎙️",
              title: "Mikrofon",
              desc: "Merekam audio sebagai bukti saat mode panik diaktifkan.",
            },
            {
              icon: "📍",
              title: "Lokasi",
              desc: "Mengirim koordinat ke kontak darurat dan peta komunitas.",
            },
            {
              icon: "🔔",
              title: "Notifikasi",
              desc: "Opsional — untuk pengingat keamanan di masa depan.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700"
            >
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button size="lg" className="w-full" onClick={handleFinish}>
          Saya Mengerti, Mulai
        </Button>
      </div>
    </div>
  );
}
