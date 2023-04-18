# Password Keeper SavePassword

<b>Description:</b>

Password Keeper is a secure and easy-to-use password manager that helps you keep all your passwords in one place. Password Keeper helps you to generate strong passwords, check password security and have access to this passwords from any device having access to the Internet. 

Link to mockup: https://www.figma.com/file/F1WY2IGvfFPGSESIWLFtvK/Untitled?node-id=0%3A1&t=FMLjXtSkQGWDilhx-1

<b>Functions of the SavePassword:</b>
- Authorization.
- Add passwords to account.
- Search passwords by site name.
- Download passwords of profile to JSON file.
- Generating strong passwords when creating new password record.
- Check password security using databases of pwned passwords (ex "HIBP" https://haveibeenpwned.com/Passwords).

<b>Data models:</b>
- User
  + Email
  + Password
  + Array of passwords records

- Password record
  + Website
  + Login to access this website
  + Password to access this website
  
