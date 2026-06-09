"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmergencyContact,
  getEmergencyContacts,
  saveEmergencyContacts,
  getInitials,
  getNameColor,
} from "@/lib/storage";
import {
  formatIndonesianPhone,
  formatPhoneDisplay,
  getWhatsAppLink,
  isValidIndonesianMobile,
} from "@/lib/phone";

export function EmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setContacts(getEmergencyContacts());
  }, []);

  const openAdd = () => {
    setEditingContact(null);
    setName("");
    setPhone("");
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setName(contact.name);
    setPhone(contact.phone.replace("+62", "0"));
    setError("");
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    saveEmergencyContacts(updated);
    setContacts(updated);
  };

  const handleSave = () => {
    if (!name.trim()) {
      setError("Nama wajib diisi");
      return;
    }
    if (!isValidIndonesianMobile(phone)) {
      setError("Nomor telepon tidak valid. Gunakan format 08xx");
      return;
    }

    const formatted = formatIndonesianPhone(phone);
    let updated: EmergencyContact[];

    if (editingContact) {
      updated = contacts.map((c) =>
        c.id === editingContact.id ? { ...c, name: name.trim(), phone: formatted } : c
      );
    } else {
      updated = [
        ...contacts,
        { id: crypto.randomUUID(), name: name.trim(), phone: formatted },
      ];
    }

    saveEmergencyContacts(updated);
    setContacts(updated);
    setDialogOpen(false);
  };

  const formattedPreview = formatIndonesianPhone(phone);
  const waPreview = formattedPreview
    ? getWhatsAppLink(formattedPreview)
    : "";

  return (
    <div className="px-4 pt-4" style={{ minHeight: "40vh" }}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
        Kontak Darurat
      </h2>

      {contacts.length === 0 && (
        <div className="mb-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          ⚠️ Tambahkan kontak darurat agar fitur panik berfungsi penuh
        </div>
      )}

      <div className="space-y-3">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-700 dark:bg-gray-900"
          >
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm"
              style={{ backgroundColor: getNameColor(contact.name) }}
            >
              {getInitials(contact.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {contact.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatPhoneDisplay(contact.phone)}
              </p>
            </div>
            <a
              href={getWhatsAppLink(contact.phone)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
              aria-label={`WhatsApp ${contact.name}`}
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <button
              onClick={() => openEdit(contact)}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Edit kontak"
            >
              <Pencil className="h-4 w-4 text-gray-500" />
            </button>
            <button
              onClick={() => handleDelete(contact.id)}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label="Hapus kontak"
            >
              <Trash2 className="h-4 w-4 text-danger" />
            </button>
          </div>
        ))}
      </div>

      {contacts.length < 3 && (
        <Button
          variant="outline"
          className="w-full mt-3"
          onClick={openAdd}
        >
          <Plus className="h-4 w-4" />
          Tambah Kontak
        </Button>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Kontak" : "Tambah Kontak Darurat"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Nama</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kontak"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Nomor Telepon</label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xx xxxx xxxx"
                type="tel"
              />
              {waPreview && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Preview: {waPreview}
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm text-danger">{error}</p>
            )}
            <Button className="w-full" onClick={handleSave}>
              Simpan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
