import { Mail, MailPlus } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { useEffect, useState } from "react";
import contactService from "../services/contactService";
import ContactsTable from "../components/contacts/ContactsTable";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [contactsStats, setContactsStats] = useState({
    totalContacts: 0,
    newContactsToday: 0,
  });

  const handleGetAllContacts = async () => {
    const res = await contactService.getAllContacts();
    setContacts(res?.data);
  };

  const calculateContactsStats = (contacts) => {
    const today = new Date();
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();

    const startOfTomorrow = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    ).getTime();

    const totalContacts = contacts.length;
    const newContactsToday = contacts.filter((user) => {
      const createdAt = new Date(user?.contact_date).getTime();
      return createdAt >= startOfToday && createdAt < startOfTomorrow;
    }).length;

    setContactsStats((prevStats) => ({
      ...prevStats,
      totalContacts,
      newContactsToday,
    }));
  };

  useEffect(() => {
    handleGetAllContacts();
  }, []);

  useEffect(() => {
    if (contacts.length > 0) {
      calculateContactsStats(contacts);
    }
  }, [contacts]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Liên Hệ" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Tổng Liên Hệ"
            icon={Mail}
            value={contactsStats.totalContacts.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="Liên Hệ Mới Hôm Nay"
            icon={MailPlus}
            value={contactsStats.newContactsToday}
            color="#10B981"
          />
        </motion.div>

        <ContactsTable contacts={contacts} />
      </main>
    </div>
  );
};

export default ContactsPage;
