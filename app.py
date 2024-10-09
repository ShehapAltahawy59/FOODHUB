from flask import Flask, request, render_template, redirect, url_for, flash,jsonify,session,send_from_directory
import firebase_admin
from flask_login import LoginManager, login_user,login_required, logout_user, current_user
from firebase_admin import credentials, firestore, storage,auth
from users.user import User
import os
# Initialize Flask app
app = Flask(__name__)

login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.login_message_category = 'info'
login_manager.init_app(app)

app.secret_key = '73ac6ddcd6a88955e0f720b20b459f93'

# Initialize Firebase
try:
    cred = credentials.Certificate('firebase_config.json')
except:
    firebase_config = {
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),  # Ensure new lines are correct
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_X509_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_X509_CERT_URL"),
    "universe_domain": os.getenv("FIREBASE_UNIVERSE_DOMAIN"),
    }
    cred = credentials.Certificate(firebase_config)


firebase_admin.initialize_app(cred, {
    'storageBucket': 'foodorderapp-2b2df.appspot.com'
})
db = firestore.client()
bucket = storage.bucket()

@app.route('/')
def home():
    categories_ref = db.collection('categories')
    categories = [doc.to_dict() for doc in categories_ref.stream()]
    categories = [category for category in categories if category["Type"]==1]

    constants_ref = db.collection('constants')
    constants = [doc.to_dict() for doc in constants_ref.stream()]
    _constants=constants[0]["Types"]
    
    types = [constant  for constant in _constants if (constant["syana"]==0)]
    for type in types:
        type["resturants"]=[category for category in categories if type["id"] in category["list_types"]]
    
    return render_template('E_commerc.html',categories=categories,types=types,current_user=current_user)
    
@app.route('/categories/<category_id>')
def get_categories(category_id):
    items_ref = db.collection('items')
    items = [doc.to_dict() for doc in items_ref.stream()]
    _items= [item for item in items if category_id == item["item_cat"]   ]
    categories_ref = db.collection('categories')
    categories = [doc.to_dict() for doc in categories_ref.stream()]
    category =next((category for category in categories if category["id"] == category_id), None)
    

    types=category["subcat"]["en"]
    types_names= [{index: name} for index, name in enumerate(types)]
    print(types_names)
    print(_items)
    return render_template('E_commerc_categories_page.html',items=_items,category=category,types=types_names)


@login_manager.user_loader
def load_user(user_id):
    # Retrieve user from Firestore using their UID (which is stored as user_id)
    users_ref = db.collection('users')
    query = users_ref.where('user_id', '==', user_id).limit(1).get()
    
    
    if len(query) > 0:
        user_doc = query[0]
        user_data = user_doc.to_dict()
        
        return User(user_id, user_data['email'], user_data['username'],user_data['profile_img'],user_data['phone'],user_data['addresses'])
    return None

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        name = data.get('username')
        phone = data.get('phone')
        img = data.get('photoURL')
        uid = data.get('uid')

        # Query Firestore to check if user with the email exists
        users_ref = db.collection('users')
        query = users_ref.where('user_id', '==', uid).limit(1).get()

        # Check if any documents are returned
        if len(query) == 0:
            # User does not exist, add them to Firestore
            new_user_ref = users_ref.document()  # Auto-generate document ID
            new_user_ref.set({
                'email': email,
                'username': name,
                'phone': [phone],
                'profile_img': img,
                'user_id': uid,
                'addresses': []
            })
        

        # Log the user in using Flask-Login
        user_obj = User(uid, email, name,img,phone,[])
        login_user(user_obj)

        # Redirect to a different page after successful login
        return jsonify({'redirect_url': url_for('home')}), 200

    return render_template('E_commerc_login_page.html')



@app.route('/logout', methods=['POST'])
def logout():
    logout_user()  # Logs out the user from Flask-Login
    return '', 204  # Return a 204 No Content status    


@app.route('/orders')
@login_required
def orders():
    return render_template('E_orders_page.html')

@app.route('/cart')
@login_required
def cart():
    return render_template('E_cart_page.html',current_user=current_user)

@app.route('/profile')
@login_required
def profile():
    
    return render_template('E_profile_page.html',current_user=current_user)


if __name__ == '__main__':
    app.run(debug=True)
