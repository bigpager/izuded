const { ContactManager } = require('../src/services/ContactManager');

describe('Contact Management', () => {
  let contactManager;
  let userId;

  beforeEach(() => {
    contactManager = new ContactManager();
    userId = '123';
  });

  test('can add contact with valid phone number', () => {
    const contactPhone = '+1987654321';
    contactManager.addContact(userId, contactPhone);
    expect(contactManager.getPendingContacts(userId)).toContain(contactPhone);
  });

  test('rejects invalid phone numbers', () => {
    expect(() => {
      contactManager.addContact(userId, '123');
    }).toThrow('Invalid phone number');
    
    expect(() => {
      contactManager.addContact(userId, 'not-a-number');
    }).toThrow('Invalid phone number');
  });

  test('contact must opt-in before receiving notifications', async () => {
    const contactPhone = '+1987654321';
    const mockSendOptIn = jest.fn();
    contactManager.messagingService = { sendOptInRequest: mockSendOptIn };

    await contactManager.addContact(userId, contactPhone);
    
    expect(mockSendOptIn).toHaveBeenCalledWith(
      contactPhone,
      expect.stringContaining('opt-in')
    );
    expect(contactManager.getPendingContacts(userId)).toContain(contactPhone);
    expect(contactManager.getApprovedContacts(userId)).not.toContain(contactPhone);
  });

  test('can approve contact after opt-in', async () => {
    const contactPhone = '+1987654321';
    await contactManager.addContact(userId, contactPhone);
    await contactManager.approveContact(userId, contactPhone);
    
    expect(contactManager.getPendingContacts(userId)).not.toContain(contactPhone);
    expect(contactManager.getApprovedContacts(userId)).toContain(contactPhone);
  });

  test('can remove contact', () => {
    const contactPhone = '+1987654321';
    contactManager.addContact(userId, contactPhone);
    contactManager.removeContact(userId, contactPhone);
    
    expect(contactManager.getPendingContacts(userId)).not.toContain(contactPhone);
    expect(contactManager.getApprovedContacts(userId)).not.toContain(contactPhone);
  });

  test('limits maximum number of contacts', () => {
    const MAX_CONTACTS = 5;
    const contacts = Array.from(
      { length: MAX_CONTACTS + 1 },
      (_, i) => `+1${String(i).padStart(10, '0')}`
    );

    contacts.slice(0, MAX_CONTACTS).forEach(contact => {
      contactManager.addContact(userId, contact);
    });

    expect(() => {
      contactManager.addContact(userId, contacts[MAX_CONTACTS]);
    }).toThrow('Maximum number of contacts reached');
  });
});