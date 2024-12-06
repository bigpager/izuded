class ContactManager {
  constructor() {
    this.pendingContacts = new Map();
    this.approvedContacts = new Map();
    this.MAX_CONTACTS = 5;
  }

  validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\+[1-9]\d{10,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error('Invalid phone number');
    }
  }

  initializeUserContacts(userId) {
    if (!this.pendingContacts.has(userId)) {
      this.pendingContacts.set(userId, new Set());
    }
    if (!this.approvedContacts.has(userId)) {
      this.approvedContacts.set(userId, new Set());
    }
  }

  async addContact(userId, phoneNumber) {
    this.validatePhoneNumber(phoneNumber);
    this.initializeUserContacts(userId);

    const totalContacts = 
      this.pendingContacts.get(userId).size + 
      this.approvedContacts.get(userId).size;

    if (totalContacts >= this.MAX_CONTACTS) {
      throw new Error('Maximum number of contacts reached');
    }

    this.pendingContacts.get(userId).add(phoneNumber);

    // Send opt-in request
    if (this.messagingService) {
      await this.messagingService.sendOptInRequest(
        phoneNumber,
        `Someone wants to add you as an emergency contact. Reply YES to opt-in.`
      );
    }
  }

  async approveContact(userId, phoneNumber) {
    this.initializeUserContacts(userId);
    
    if (this.pendingContacts.get(userId).has(phoneNumber)) {
      this.pendingContacts.get(userId).delete(phoneNumber);
      this.approvedContacts.get(userId).add(phoneNumber);
      return true;
    }
    return false;
  }

  removeContact(userId, phoneNumber) {
    this.initializeUserContacts(userId);
    
    this.pendingContacts.get(userId).delete(phoneNumber);
    this.approvedContacts.get(userId).delete(phoneNumber);
  }

  getPendingContacts(userId) {
    this.initializeUserContacts(userId);
    return Array.from(this.pendingContacts.get(userId));
  }

  getApprovedContacts(userId) {
    this.initializeUserContacts(userId);
    return Array.from(this.approvedContacts.get(userId));
  }
}

module.exports = { ContactManager };