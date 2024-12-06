# iz u ded? is a simple utility with a unique value proposition.

I adopted a puppy and morbidly realized that, if I were to be hit by a bus on a Friday, 
it might be a few days before anyone knew I was unavailable to care for him.

A tongue-in-cheek presentation of a serious matter, iz-u-ded is a service that periodically 
sends text messages to make sure its users are still alive, or to report to their 
preferred contacts that they may have expired.

Users decide how often they want to be reminded , called their `$IUD_REMINDER_INTERVAL`.
The default is once a day (expressed in hours) but can be extended up to 7 days.

For each user, the system may be in one of the following states:

- **active**: the system is sending reminders to the user
- **inactive**: the system is not sending reminders to the user
- **suspended**: the system has suspended reminders to the user

For each `$IUD_REMINDER_INTERVAL`, the system sends a text message to the user's phone number: 

> "u ded?" 

Along with a link that says,

> "naw"

If they click the link, the server-side re-sets their clock.

If they don't click the link, the system will ask again after another $IUD_REMINDER_INTERVAL passes.

From the point of this 2nd request, the user is considered "at-risk", and a 24-hour grace period begins.

If there's been no response after this grace period, the system will inform the user's contacts 
that they may have expired.

## https://izuded.today

SMS is the registration and login method, so incorporate UI components for a 3rd-party auth service.

Logged-in users can toggle their own accounts between "active" and "inactive" states, and use a select box to set 
the # of days between reminders, up to 7 days. 

In addition, there's a textarea for a note from the user, and a child set of textboxes for contact 
phone numbers to notify. Phone numbers added here will need to opt-in to messages from the system before they 
can receive EOL messages. This implies additional user flows and views.