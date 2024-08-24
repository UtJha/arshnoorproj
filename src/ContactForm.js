import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contact = { name, phone, email, address };
    await axios.post('http://localhost:5000/api/contacts', contact);
    alert('Contact saved successfully');
  };

  const handleDownload = async () => {
    const response = await axios.get('http://localhost:5000/api/contacts/download', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contacts.vcf');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" required />
        <button type="submit">Save Contact</button>
      </form>
      <button onClick={handleDownload}>Download All Contacts as VCF</button>
    </div>
  );
};

export default ContactForm;
