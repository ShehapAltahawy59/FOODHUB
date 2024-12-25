from flask_login import UserMixin
class User(UserMixin):
    def __init__(self, uid,email,name,photoURL,phonesNumber,addresses,is_admin,is_sub_admin):
        self.id = uid
        self.email = email
        self.name = name
        self.photoURL =photoURL
        self.phone = phonesNumber
        self.addresses = addresses
        self.is_admin = is_admin
        self.is_sub_admin = is_sub_admin
    def get_id(self):
        return self.id
        
