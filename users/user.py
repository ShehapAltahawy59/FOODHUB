from flask_login import UserMixin
class User(UserMixin):
    def __init__(self, uid,email,name,photoURL,phonesNumber,addresses):
        self.id = uid
        self.email = email
        self.name = name
        self.photoURL =photoURL
        self.phone = phonesNumber
        self.addresses = addresses
    def get_id(self):
        return self.id
        
