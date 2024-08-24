const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const vCard = require('vcf');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/contacts', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  address: String,
});

const Contact = mongoose.model('Contact', contactSchema);

// Save contact to MongoDB
app.post('/api/contacts', async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.send(contact);
});

// Download all contacts as VCF
app.get('/api/contacts/download', async (req, res) => {
  const contacts = await Contact.find();
  const vCardData = contacts.map(contact => {
    let vCardEntry = new vCard();
    vCardEntry.set('fn', contact.name);
    vCardEntry.set('tel', contact.phone);
    vCardEntry.set('email', contact.email);
    vCardEntry.set('adr', contact.address);
    return vCardEntry.toString();
  }).join('\n');

  fs.writeFileSync('contacts.vcf', vCardData);
  res.download('contacts.vcf');
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
